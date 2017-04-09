module.exports = () => {
  // Will determine the average game time when called
  const returnAvgGameTime = numOfGames => mins => defaultAvg =>
                            (numOfGames < 20 ? defaultAvg : mins / numOfGames);

  // Update and returns the new team game count or
  // returns an error if unsuccessful
  const addGame = (controller, zone, teamID, callback) => {
    let gamesPlayed = false;
    let returnError = false;

    // check to see if the game count exsits in the database
    controller.storage.zone.get(teamID, (err, data) => {
      const zoneData = data;

      if (err) {
        returnError = `Could not access my storage because of an error: ${err}`;
      } else {
        if (!zoneData || !zoneData.gameData || !zoneData.gameData.gamesPlayed) {
          returnError = 'Something is wrong with your data';
        }

        // update games played by one
        zoneData.gameData.gamesPlayed += 1;

        // save the team data back to the database and sets gamesPlayed
        controller.storage.zone.save(zoneData, (saveErr, saved) => {
          if (saveErr) {
            returnError = `I experienced an error adding your task: ${saveErr}`;
          } else {
            gamesPlayed = zoneData.gameData.gamesPlayed;
          }
        });
      }
    });
    // allow a callback
    return callback(returnError, gamesPlayed);
  };
  // return methods
  return {
    returnAvgGameTime,
    addGame,
  };
};
