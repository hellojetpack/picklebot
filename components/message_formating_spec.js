import test from 'tape';
import { formatAttachment, formatMessage, addColor } from './message_formating';

// test suite
test('format attachment', (assert) => {
  {
    const msg = 'formatAttachment() should take an object and format it into a slack attachment. Scheduled time is false should return value for time key';
    const gameSlot = { createdBy: 'john', startTime: '10', scheduled: false };

    const actual = formatAttachment(gameSlot);
    const expected = { color: '', fields: [{ value: '<@john>', short: true }, { value: '10', short: true }] };

    assert.same(actual, expected, msg);
  }

  {
    const msg = 'formatAttachment() should take an object and format it into a slack attachment. Scheduled time is true should return "title" for time key';
    const gameSlotSchedTime = { createdBy: 'john', startTime: '10', scheduled: true };

    const actual = formatAttachment(gameSlotSchedTime);
    const expected = { color: '', fields: [{ value: '<@john>', short: true }, { title: '10', short: true }] };

    assert.same(actual, expected, msg);
  }
  assert.end();
});

test('format message', (assert) => {
  {
    const msg = 'formatMessage() should take the game array and format it into a slack message';
    const arr = [
      { createdBy: 'john', startTime: '10', scheduled: false },
      { createdBy: 'matt', startTime: '11', scheduled: false },
      { createdBy: 'jeff', startTime: '11:30', scheduled: false },
    ];

    const actual = formatMessage(arr);
    const expected = {
      text: ':point_down: Here is the current game list:',
      attachments: [
        {
          color: 'fff',
          fields: [{ title: 'Player', short: true }, { title: 'Game Time', short: true }],
        },
        {
          color: '0BE1A2',
          fields: [{ value: '<@john>', short: true }, { value: '10', short: true }],
        },
        { color: '0B8DC2',
          fields: [{ value: '<@matt>', short: true }, { value: '11', short: true }],
        },
        { color: '0B39E1',
          fields: [{ value: '<@jeff>', short: true }, { value: '11:30', short: true }],
        },
        {
          text: '',
          footer: 'Type "@pickleball next" to get on the list!',
          footer_icon: 'https://platform.slack-edge.com/img/default_application_icon.png',
          color: 'fff',
        },
      ],
    };

    assert.same(actual, expected, msg);
    assert.end();
  }
});

test('color generator', (assert) => {
  {
    const msg = 'should take an array of slack attachments and add a generated color from green to red';
    const arr = [{}, {}, {}];

    const actual = addColor(arr);
    const expected = [{ color: '0BE1A2' }, { color: '0B8DC2' }, { color: '0B39E1' }];

    assert.same(actual, expected, msg);
    assert.end();
  }
});
