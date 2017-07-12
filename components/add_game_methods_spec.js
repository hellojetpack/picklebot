import test from 'tape';
import moment from 'moment';
import { addScheduledGame, addSimpleGame, gameTimeConflicts, convertTo24 } from './add_game_methods';


test('adding a scheduled game', (assert) => {
  {
    const msg = 'Should check gameOrder times and add player game to appropriate time slot';
    const arr = [
      { createdBy: 'john', startTime: '10:00', scheduled: false },
      { createdBy: 'matt', startTime: '11:00', scheduled: false },
      { createdBy: 'jeff', startTime: '13:30', scheduled: false },
    ];
    const userID = '124h4';
    const time = '10:30';

    const actual = addScheduledGame(arr, userID, time);
    const expected = [
      { createdBy: 'john', startTime: '10:00', scheduled: false },
      { createdBy: '124h4', startTime: '10:30', scheduled: true },
      { createdBy: 'matt', startTime: '11:00', scheduled: false },
      { createdBy: 'jeff', startTime: '13:30', scheduled: false },
    ];

    assert.same(actual, expected, msg);
  }
  assert.end();
});

test('Checking for conflicts with requested time', (assert) => {
  const gameOrder = [
    { createdBy: 'john', startTime: '10:00', scheduled: false },
    { createdBy: 'matt', startTime: '11:00', scheduled: false },
    { createdBy: 'jeff', startTime: '13:30', scheduled: false },
  ];

  {
    const msg = 'Should check the scheduled time request against the game order list and return false';

    const time = '11:30';

    const actual = gameTimeConflicts(gameOrder, time);
    const expected = false;

    assert.same(actual, expected, msg);
  }

  {
    const msg = 'Should check the scheduled time request against the game order list and return true';
    const time = '10:45';
    const actual = gameTimeConflicts(gameOrder, time);
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
    const gameOrder = [
      { createdBy: 'john', startTime: '10:00', scheduled: false },
      { createdBy: 'matt', startTime: '10:50', scheduled: false },
      { createdBy: 'jeff', startTime: '13:30', scheduled: true },
    ];
    const userId = '123asd';

    const actual = addSimpleGame(gameOrder, userId, 1493481822);
    const expected = [
      { createdBy: 'john', startTime: '10:00', scheduled: false },
      { createdBy: 'matt', startTime: '10:50', scheduled: false },
      { createdBy: '123asd', startTime: '11:20', scheduled: false },
      { createdBy: 'jeff', startTime: '13:30', scheduled: true },
    ];

    assert.same(actual, expected, msg);
  }

  {
    const msg = 'Should take the gameOrder and insert a new gameSlot at the end of the list if there are no avaible times between current game slots';
    const UserId = '123asd';
    const gameOrder = [
      { createdBy: 'john', startTime: '10:00', scheduled: false },
    ];

    const actual = addSimpleGame(gameOrder, UserId, 1493481822);
    const expected = [
      { createdBy: 'john', startTime: '10:00', scheduled: false },
      { createdBy: '123asd', startTime: '10:30', scheduled: false },
    ];

    assert.same(actual, expected, msg);
  }

  {
    const msg = 'Should take the gameOrder and insert a new game slot if the game order is empty';
    const userId = '123asd';
    const gameOrder = [];
    const msgTimestamp = 1493481822; // The format that slacks send it

    const actual = addSimpleGame(gameOrder, userId, msgTimestamp);
    const expected = [{ createdBy: '123asd', startTime: moment(String(msgTimestamp), 'X').format('H:mm'), scheduled: false }];

    assert.same(actual, expected, msg);
  }

  {
    const msg = 'Should take the gameOrder and insert the game slot in front';
    const userId = '123asd';
    const msgTimestamp = 1493481822;
    const gameOrder = [
      { createdBy: 'john', startTime: '11:00', scheduled: false },
    ];

    const actual = addSimpleGame(gameOrder, userId, 1493481822);
    const expected = [{ createdBy: '123asd', startTime: moment(String(msgTimestamp), 'X').format('H:mm'), scheduled: false }, ...gameOrder];

    assert.same(actual, expected, msg);
  }
  assert.end();
});
