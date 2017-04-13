
module.exports = (controller) => {
  controller.hears(['(game)? (order|list)'], ['direct_mention', 'mention', 'ambient'], (bot, message) => {
    bot.startConversation(message, (convoErr, convo) => {
      if (convoErr) throw Error;

      controller.storage.teams.get(message.team, (err, teamData) => {
        if (err) {
          convo.say({
            text: `Uhhh, I experienced and error trying to access my sata files: ${err}`,
            action: 'stop',
          });
        }
        if (!teamData || !teamData.gameData ||
            !teamData.gameData.gameOrder || !teamData.gameOrder.length === 0) {
          convo.say({
            text: 'Good news, looks like the pickleball court is wide open!',
            action: 'stop',
          });
        }
        convo.say('hello');
      });
    });
  });
};
