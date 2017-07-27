import test from 'tape';
import moment from 'moment';
import { addScheduledGame, addSimpleGame, gameTimeConflicts, convertTo24 } from './add_game_methods';

const time = moment.utc(1500222600, 'X'); // 10:30 am mst or 4:30 pm utc
const jsDate = mTime => mTime.toDate();

const createGameOrderState = () => [
  { createdBy: 'john', startTime: jsDate(time), scheduled: false },
  { createdBy: 'matt', startTime: jsDate(time.clone().add(1, 'h')), scheduled: false },
  { createdBy: 'jeff', startTime: jsDate(time.clone().add(3, 'h')), scheduled: false },
];

const insertIntoArray = (
  arr = [],
  start = 0,
  ...items
) => [...arr.slice(0, start), ...items, ...arr.slice(start)];

test('adding a scheduled game', (assert) => {
  {
    const msg = 'Should check gameOrder times and add player game to appropriate time slot';

    const createdBy = '124h4';
    const startTime = time.add(4, 'h');
    const scheduled = true;

    const actual = addScheduledGame(createGameOrderState(), createdBy, startTime);
    const expected = insertIntoArray(
      createGameOrderState(),
      1,
      { createdBy, startTime: startTime.toDate(), scheduled },
    );

    assert.same(actual, expected, msg);
  }
  assert.end();
});

test('Checking for conflicts with requested time', (assert) => {
  {
    const msg = 'Should check the scheduled time request against the game order list and return false';

    const startTime = time.clone().add(30, 'm').toDate();

    const actual = gameTimeConflicts(createGameOrderState(), startTime);

    const expected = false;

    assert.same(actual, expected, msg);
  }

  {
    const msg = 'Should check the scheduled time request against the game order list and return true';
    const startTime = time.clone().add(10, 'm').toDate();
    const actual = gameTimeConflicts(createGameOrderState(), startTime);
    const expected = true;

    assert.same(actual, expected, msg);
  }

  assert.end();
});

test('Converting the hour requested to 24hour format', (assert) => {
  {
    const msg = 'Should return with 13 if the hour requested is 1 and the timestamp is 10';
    const hour = '1';
    const timeStamp = '1493481822';

    const actual = convertTo24(timeStamp, hour);
    const ecpected = '13';

    assert.same(actual, ecpected, msg);
  }

  {
    const msg = 'Should return with 16 if the hour requested is 4 and the timestamp is 14';
    const hour = '4';
    const timeStamp = '1493474542'; // timestamp format sent by slack api\

    const actual = convertTo24(timeStamp, hour);
    const expected = '16';
    assert.same(actual, expected, msg);
  }

  {
    const msg = 'Should return with 7 if the hour requested is 7 and the timestamp is 6';
    const hour = '7';
    const timeStamp = '1493445742';

    const actual = convertTo24(timeStamp, hour);
    const expected = '7';

    assert.same(actual, expected, msg);
  }


  assert.end();
});

test('Adding an unschedule game.', (assert) => {
  {
    const msg = 'Should take the game order and insert a game slot at the next availble time.';
    const createdBy = '123asd';
    const startTime = jsDate(time.clone().add(30, 'm'));

    const actual = addSimpleGame(createGameOrderState(), createdBy, startTime);
    const expected = insertIntoArray(
      createGameOrderState(),
      1,
      { createdBy, startTime, scheduled: false },
    );

    assert.same(actual, expected, msg);
  }

  {
    const msg = 'Should take the gameOrder and insert a new gameSlot at the end of the list if there are no avaible times between current game slots';
    const createdBy = '123asd';
    const gameOrder = [
      { createdBy: 'john', startTime: jsDate(time), scheduled: false },
    ];

    const actual = addSimpleGame(gameOrder, createdBy, time.toDate());
    const expected = [
      ...gameOrder,
      { createdBy: '123asd', startTime: jsDate(time.clone().add(30, 'm')), scheduled: false },
    ];

    assert.same(actual, expected, msg);
  }

  {
    const msg = 'Should take the gameOrder and insert a new game slot if the game order is empty';
    const createdBy = '123asd';
    const gameOrder = [];
    const startTime = jsDate(time);

    const actual = addSimpleGame(gameOrder, createdBy, startTime);
    const expected = [
      { createdBy, startTime, scheduled: false },
    ];

    assert.same(actual, expected, msg);
  }

  {
    const msg = 'Should take the gameOrder and insert the game slot in front';
    const createdBy = '123asd';
    const startTime = jsDate(time.clone().subtract(30, 'm'));

    const gameOrder = [
      { createdBy: 'john', startTime: jsDate(time), scheduled: false },
    ];

    const actual = addSimpleGame(gameOrder, createdBy, startTime);

    const expected = [
      { createdBy, startTime, scheduled: false },
      ...gameOrder,
    ];

    assert.same(actual, expected, msg);
  }
  assert.end();
});
