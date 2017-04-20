const test = require('tape');
const reactions = require('../reactions');

test('reactions', (assert) => {
  {
    const msg = 'This should return a thumbsup slack reaction';
    const slackMessage = { channel: '123', ts: '124' };
    const expected = {
      name: 'thumbsup',
      channel: '123',
      timestamp: '124',
    };
    const actual = reactions.thumbsup(slackMessage);

    assert.same(actual, expected, msg);
    assert.end();
  }
});
