const test = require('tape');

const messageFormat = require('./message_formating.js');

// test suite
test('format attachment', (assert) => {
  {
    const msg = 'formatAttachment() should take an object and format it into a slack attachment. Scheduled time is false should return value for time key';
    const gameSlot = { createdBy: 'john', startTime: '10am', scheduled: false };

    const actual = messageFormat.formatAttachment(gameSlot);
    const expected = { color: '', fields: [{ value: 'john', short: true }, { value: '10am', short: true }] };

    assert.same(actual, expected, msg);
  }

  {
    const msg = 'formatAttachment() should take an object and format it into a slack attachment. Scheduled time is true should return "title" for time key';
    const gameSlotSchedTime = { createdBy: 'john', startTime: '10am', scheduled: true };

    const actual = messageFormat.formatAttachment(gameSlotSchedTime);
    const expected = { color: '', fields: [{ value: 'john', short: true }, { title: '10am', short: true }] };

    assert.same(actual, expected, msg);
  }
  assert.end();
});

test('format message', (assert) => {
  {
    const msg = 'formatMessage() should take the game array and format it into a slack message';
    const arr = [
      { createdBy: 'john', startTime: '10am', scheduled: false },
      { createdBy: 'matt', startTime: '11am', scheduled: false },
      { createdBy: 'jeff', startTime: '11:30am', scheduled: false },
    ];

    const actual = messageFormat.formatMessage(arr);
    const expected = {
      text: ':point_down: Here is the current game list:',
      attachments: [
        {
          color: 'fff',
          fields: [{ title: 'Player', short: true }, { title: 'Game Time', short: true }],
        },
        {
          color: '0BE1A2',
          fields: [{ value: 'john', short: true }, { value: '10am', short: true }],
        },
        { color: '0B8DC2',
          fields: [{ value: 'matt', short: true }, { value: '11am', short: true }],
        },
        { color: '0B39E1',
          fields: [{ value: 'jeff', short: true }, { value: '11:30am', short: true }],
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

    const actual = messageFormat.addColor(arr);
    const expected = [{ color: '0BE1A2' }, { color: '0B8DC2' }, { color: '0B39E1' }];

    assert.same(actual, expected, msg);
    assert.end();
  }
});
