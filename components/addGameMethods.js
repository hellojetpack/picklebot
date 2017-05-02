import moment from 'moment';

export const addScheduledGame = (gameOrder, userId, time) => {
  const gameSlot = { createdBy: userId, startTime: time, scheduled: true };
  return [...gameOrder, gameSlot].sort((a, b) => a.startTime > b.startTime);
};

export const addSimpleGame = (gameOrder, userId) => {
  const copy = [...gameOrder];

  if (copy.length === 0) {
    return [{ createdBy: userId, startTime: `${moment().add(5, 'minutes').format('H:mm')}`, scheduled: false }];
  }

  const elementBefore = copy.find((gameSlot, index, array) =>
    index === array.length - 1 || (moment(array[index + 1].startTime, 'H:mm') - moment(gameSlot.startTime, 'H:mm')) / 1000 / 60 > 30);

  const indexToAddTo = copy.indexOf(elementBefore) + 1;
  const startTime = `${moment(elementBefore.startTime, 'H:mm').add(30, 'minutes').format('H:mm')}`;

  copy.splice(indexToAddTo, 0, { createdBy: userId, startTime, scheduled: false });
  return copy;
};

export const gameTimeConflicts = (gameOrder, time) =>
  gameOrder.reduce((acc, curr) =>
    ((Math.abs(moment(curr.startTime, 'H:mm') - moment(time, 'H:mm')) / 1000) / 60 < 30 ? true : acc), false);

export const convertTo24 = (timestamp, hourRequested) => {
  const nowHour = moment(timestamp, 'X').hour();
  const futureHour = Number(hourRequested);

  if (nowHour > 12) {
    if (nowHour > futureHour) {
      return `${futureHour}`;
    }
    return `${futureHour + 12}`;
  }

  if (nowHour > futureHour) {
    return `${futureHour + 12}`;
  }

  return `${futureHour}`;
};
