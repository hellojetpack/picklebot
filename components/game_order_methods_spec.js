const test = require('tape');
const listMethods = require('./game_order_methods');

test('Skipping game order', (assert) => {
  {
    const msg = 'Should push the matching game slot down one';
    const gameOrder = [{ createdBy: '12343' }, { createdBy: '123' }, { createdBy: '1234' }];
    const userId = '123';

    const expected = [{ createdBy: '12343' }, { createdBy: '1234' }, { createdBy: '123' }];
    const actual = listMethods.gameSkip(gameOrder, userId);

    assert.same(actual, expected, msg);
  }
  {
    const msg = 'Should return the same order is there is only one slot in the game list';
    const gameOrder = [{ createdBy: '12343' }];
    const userId = '12343';

    const expected = [{ createdBy: '12343' }];
    const actual = listMethods.gameSkip(gameOrder, userId);

    assert.same(actual, expected, msg);
  }
  assert.end();
});
test('Removing game from order', (assert) => {
  {
    const msg = 'should remove user/player game from list';
    const gameOrder = [{ createdBy: '12343' }, { createdBy: '123' }, { createdBy: '1234' }];
    const userId = '123';
    const expected = [{ createdBy: '12343' }, { createdBy: '1234' }];
    const actual = listMethods.gameRemove(gameOrder, userId);
    assert.same(actual, expected, msg);
  }
  assert.end();
});
