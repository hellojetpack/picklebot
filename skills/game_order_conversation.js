const scripts = require('../scripts/add_to_game_list');
const messageFormat = require('../components/message_formating.js');

module.exports = (controller) => {
  controller.hears(['(game)? (order|list)', 'games'], ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
    controller.storage.teams.get(message.team, (err, data) => {
      if (err) {
        bot.reply(message, `err... I'm having trouble accesing my data stores because of: ${err}`);
      } else if (!data || !data.gameOrder || data.gameOrder.length === 0) {
        bot.startConversationInThread(message, (convErr, convo) => {
          convo.say('Great News: the pickleball court is wide open!');
          convo.ask('Would you like me to set up a game for you?', [
            {
              pattern: bot.utterances.yes,
              callback: (response, rConvo) => {
                scripts.startAddToGameList(rConvo);
                rConvo.next();
              },
            },
            {
              pattern: bot.utterances.no,
              callback: (response, rConvo) => {
                rConvo.say('All good! just type `@picklebot next` when you\'re ready');
                rConvo.next();
              },
            },
          ]);
        });
      } else {
        bot.reply(message, messageFormat.formatMessage(data.gameOrder));
      }
    });
  });
};
