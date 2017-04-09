module.exports = () => {
  // Will determine the average game time when called
  const returnAvgGameTime = numOfGames => mins => defaultAvg =>
                            (numOfGames < 20 ? defaultAvg : mins / numOfGames);

  // Update and returns the new team game count or
  // returns an error if unsuccessful
  const addTeamGame = (controller, teamID, callback) => {
    let gamesPlayed = false;
    let returnError = false;

    // check to see if the game count exsits in the database
    controller.storage.teams.get(teamID, (err, data) => {
      const teamData = data;

      if (err) {
        returnError = `Could not access my storage because of an error: ${err}`;
      } else {
        if (!teamData || !teamData.gameData || !teamData.gameData.gamesPlayed) {
          returnError = 'Something is wrong with your data';
        }

        // update games played by one
        teamData.gameData.gamesPlayed += 1;

        // save the team data back to the database and sets gamesPlayed
        controller.storage.teams.save(teamData, (saveErr, saved) => {
          if (saveErr) {
            returnError = `I experienced an error adding your task: ${saveErr}`;
          } else {
            gamesPlayed = teamData.gameData.gamesPlayed;
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
    addTeamGame,
  };
};
