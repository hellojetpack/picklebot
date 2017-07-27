import moment from 'moment';

const diffInMinutes = (time1, time2) => (Math.abs(time1.getTime() - time2.getTime()) / 1000) / 60;


const checkPadding = padding => min => min >= padding;
const check30MinPad = checkPadding(30);
const check60MinPad = checkPadding(60);


const timeForm = time => moment.utc(time);
const timeFormX = time => moment.utc(String(time), 'X');


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


const createGameSlot = (createdBy, startTime, scheduled) => ({ createdBy, startTime, scheduled });


const findNextInFilledList = gameOrder => timeForm(find60MinWindow(gameOrder).startTime).add(30, 'm').toDate();

const findNextAvailableTime = (
  gameOrder = [],
  msgTimestamp = new Date(),
) => (
gameOrder.length === 0 || check30MinPad(diffInMinutes(gameOrder[0].startTime, msgTimestamp)) ?
  msgTimestamp :
  findNextInFilledList(gameOrder)
);


export const addScheduledGame = (gameOrder, userId, time) => gameOrderMomentToJSTime(
  sortByStartTime(
    ...gameOrderJSTimeToMoment(gameOrder),
    createGameSlot(userId, time, true),
  ),
);

export const addSimpleGame = (gameOrder, userId, time) =>
  sortByStartTime(...gameOrder, createGameSlot(userId,
    findNextAvailableTime(gameOrder, time), false));

export const gameTimeConflicts = (
  gameOrder = [],
  time = new Date(),
  ) =>
  !(gameOrder.every(gameSlot => check30MinPad(diffInMinutes(gameSlot.startTime, time))));

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
