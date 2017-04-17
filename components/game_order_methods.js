
// takes in the game order array and pushes the game slot
// with the matching userId down one spot in the list
const gameSkip = (arr, userId) => {
  const gameOrder = arr;
  const matchingIndex = gameOrder.reduce((acc, curr, index) =>
                                        (curr.createdBy === userId ? index : acc));
  // removes the matching slot and the one after and stores them in the array and reverses the array
  const swap = gameOrder.splice(gameOrder.indexOf(matchingIndex), 2).reverse();

  // adds the swaped gameslots back into the game order array
  gameOrder.splice(matchingIndex, 0, ...swap);
  return gameOrder;
};

module.exports = { gameSkip };
