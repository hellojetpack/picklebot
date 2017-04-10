
  // Will determine the average game time when called
  const returnAvgGameTime = numOfGames => mins => defaultAvg =>
                            (numOfGames < 20 ? defaultAvg : mins / numOfGames);

  // Update and returns the new team game count or
  // returns an error if unsuccessful
  const addGame = (controller, teamID, cb) => {
    let returnError = false;

    // check to see if the game count exsits in the database
    controller.storage.teams.get(teamID, (err, data) => {
      const zoneData = data;

      if (err) {
        returnError = new Error(`Could not access my storage because of an error: ${err}`);
      } else {
        if (!zoneData || !zoneData.gameData || !zoneData.gameData.gamesPlayed) {
          returnError = new Error('Something is wrong with your data');
        }

        if (!returnError) {
          // update games played by one
          zoneData.gameData.gamesPlayed += 1;

          // save the team data back to the database and sets gamesPlayed
          controller.storage.teams.save(zoneData, (saveErr, saved) => {
            if (saveErr) {
              returnError = new Error(`I experienced an error adding your task: ${saveErr}`);
            } else {
              cb(returnError, zoneData.gameData.gamesPlayed);
            }
          });
        }
      }
    });
    // allow a callback
    };
  module.exports = addGame;
