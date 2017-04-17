const listMethods = require('../components/game_order_methods');
const messageFormat = require('../components/message_formating');


module.exports = (controller) => {
  controller.hears(['skip (me|my game)'], ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
    controller.storage.teams.get(message.team, (err, data) => {
      const teamData = data;

      if (!teamData || !teamData.gameOrder || teamData.gameOrder.length === 0) {
        bot.replyInThread(message, 'uh oh. no game to skip');
        return false; // do not bubble event
      }

      const inList = teamData.gameOrder.find(x => x.createdBy === message.user);

      if (!inList) {
        bot.replyInThread(message, 'You\'re not in the list to skip');
        return false; // do not bubble event
      }

      if (teamData.gameOrder.length === 1) {
        bot.replyInThread(message, 'You\'re the only person on the list. :thinking_face:');
        return false; // do not bubble event
      }

      if (teamData.gameOrder.indexOf(inList) === teamData.gameOrder.length - 1) {
        bot.replyInThread(message, 'You\'re the last person on the list.\n' +
                           'Type `@picklebot remove` to remove your game');
        return false; // do not bubble event
      }

      teamData.gameOrder = listMethods.gameSkip(teamData.gameOrder, message.user);

      controller.storage.teams.save(teamData, (saveErr, saved) => {
        if (saveErr) {
          bot.reply(message, `Could not save to my db at this time because ${saveErr}`);
        } else {
          bot.api.reactions.add({
            name: 'thumbsup',
            channel: message.channel,
            timestamp: message.ts,
          });
          bot.startConversation(message, (conErr, convo) => {
            convo.say('Skip successful');
            convo.say(messageFormat.formatMessage(saved.gameOrder));
          });
        }
      });
      return true; // do not bubble event;
    });
  });
};
