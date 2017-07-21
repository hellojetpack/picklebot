import moment from 'moment';

const diffInMinutes = (time1, time2) => (Math.abs(moment(time1, 'H:mm') - moment(time2, 'H:mm')) / 1000) / 60;

const checkPadding = padding => min => min >= padding;
const check30MinPad = checkPadding(30);
const check60MinPad = checkPadding(60);

const timeForm = time => moment(time, 'H:mm');
const timeFormX = time => moment(String(time), 'X');

const gameOrderJSTimeToMoment = gameOrder => gameOrder.map(
  (slot) => {
    slot.startTime = moment.utc(slot.startTime);
    return slot;
  });

const gameOrderMomentToJSTime = gameOrder => gameOrder.map(
  (slot) => {
    slot.startTime = slot.startTime.toDate();
    return slot;
  });

const sortByStartTime = (...gameOrder) => gameOrder.sort((a, b) => a.startTime > b.startTime);

const find60MinWindow = gameOrder => gameOrder.find(
  (curr, index, arr) => index === arr.length - 1 ||
  check60MinPad(diffInMinutes(arr[index + 1].startTime, curr.startTime)));

const createGameSlot = (createdBy, startTime, scheduled) => {
  const gameSlot = { createdBy, startTime, scheduled };
  return gameSlot;
};

const findNextInFilledList = gameOrder => timeForm(find60MinWindow(gameOrder).startTime).add(30, 'm');

const findNextAvailableTime = (gameOrder, msgTimestamp) => {
  const now = timeFormX(msgTimestamp);

  return gameOrder.length === 0 ||
    check30MinPad(diffInMinutes(gameOrder[0].startTime, now.format('H:mm'))) ?
    now : findNextInFilledList(gameOrder);
};

export const addScheduledGame = (gameOrder, userId, time) => gameOrderMomentToJSTime(
  sortByStartTime(
    ...gameOrderJSTimeToMoment(gameOrder),
    createGameSlot(userId, time, true),
  ),
);

export const addSimpleGame = (gameOrder, userId, time) =>
  sortByStartTime(...gameOrder, createGameSlot(userId,
    findNextAvailableTime(gameOrder, time).format('H:mm'), false));

export const gameTimeConflicts = (gameOrder, time) =>
  !gameOrder.every(gameSlot => check30MinPad(diffInMinutes(gameSlot.startTime, time)));

export const convertTo24 = (timestamp, hourRequested) => {
  const nowHour = timeFormX(timestamp).hour();
  const futureHour = Number(hourRequested);

  if (nowHour > 12) {
    if (nowHour < futureHour) {
      return `${futureHour}`;
    }
    return `${futureHour + 12}`;
  }

  if (nowHour > futureHour) {
    return `${futureHour + 12}`;
  }

  return `${futureHour}`;
};
