module.exports = (controller) => {
  // listens to when users want the avg game time so we can send them the avg game time
  controller.hears(['^what .* avg|average game time'], ['direct_message', 'direct_mention'], (bot, message) => {
    // get the teams data collection that matches the team id sent with the message
    controller.storage.teams.get(message.team, (err, teamData) => {
      if (err) {
        bot.say(`I had trouble receiving that from my database: ${err}`);
      }
      bot.startConversation(message, (converr, convo) => {
        if (converr) {
          bot.say(`I could not start the conversation because of an error: ${converr}`);
        }

        convo.say('Let me check that');

        // runs check for that teams avg time
        // and respond if we can or cannot find it
        if (!teamData || !teamData.gameData || !teamData.gameData.avgTime) {
          convo.say('Ummm...');

          convo.say(':thinking_face: Looks like your team doesn\'t have that set yet. Go play more pickleball!');
        } else {
          convo.say('Found it!');

          convo.say(`Here is your team's avg game time: ${teamData.gameData.avgTime} mins.`);

          // send a response depending if the avg game time
          // is high or low
          if (teamData.gameData.avgTime > 35) {
            convo.say(':flushed: Woah, you guy\'s must have some intense games!');
          } else if (teamData.gameData.avgTime < 17) {
            convo.say('hunh, you guys must only play to 11.');
          }
        }
      });
    });
  });
};
