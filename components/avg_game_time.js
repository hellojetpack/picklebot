
// Will determine the average game time when called
const returnAvgGameTime = numOfGames => mins => defaultAvg =>
                          (numOfGames < 20 ? defaultAvg : mins / numOfGames);

// returns an error if unsuccessful
const iterateGameDataValue = (controller, zone, zoneID, prop, addValue, cb) => {
  let returnError = false;

  // check to see if the game count exsits in the database
  controller.storage[zone].get(zoneID, (err, data) => {
    const zoneData = data;

    // handle errors from database and if we are missing team game data
    if (err) {
      returnError = new Error(`Could not access my storage because of an error: ${err}`);
    } else {
      if (!zoneData || !zoneData.gameData || !zoneData.gameData[prop]) {
        returnError = new Error('Something is wrong with your data');
      }

      if (!returnError) {
        // update games played by one
        zoneData.gameData[prop] += addValue;

        // save the team data back to the database and sets gamesPlayed
        controller.storage[zone].save(zoneData, (saveErr, saved) => {
          if (saveErr) {
            returnError = new Error(`I experienced an error adding your task: ${saveErr}`);
          } else {
            // allow a callback to do something with games played
            cb(returnError, zoneData.gameData[prop]);
          }
        });
      }
    }
  });
};
module.exports = iterateGameDataValue;
