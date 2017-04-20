const listMethods = require('../components/game_order_methods');
const messageFormat = require('../components/message_formating');
const reactionsMsg = require('../components/reactions');

module.exports = (controller) => {
  controller.hears('remove (game|me)', ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
    controller.storage.teams.get(message.team, (err, data) => {
      if (err) {
        bot.replyInThread(message, 'something went wrong accessing team storage');
        return false; // do not bubble
      }
      const teamData = data;
      if (!teamData || !teamData.gameOrder || teamData.gameOrder.length === 0) {
        bot.replyInThread(message, 'I am currently not tracking any games at this time. :cry:');
        return false; // do not bubble
      }
      const inList = teamData.gameOrder.find(gameSlot => gameSlot.createdBy === message.user);

      if (!inList) {
        bot.replyInThread(message, 'You\'re not in the list to remove');
        return false; // do not bubble event
      }
      teamData.gameOrder = listMethods.gameRemove(teamData.gameOrder, message.user);
      controller.storage.teams.save(teamData, (saveErr, saved) => {
        if (saveErr) {
          bot.replyInThread(message, `Could not save to my db at this time because ${saveErr}`);
        } else {
          bot.startConversation(message, (convoErr, convo) => {
            if (convoErr) {
              convo.say('Don\'t wanna talk right now');
            } else {
              bot.api.reactions.add(reactionsMsg.thumbsup(message));
              convo.say('Your game was successfully removed');
              if (teamData.gameOrder.length > 0) {
                convo.say(messageFormat.formatMessage(saved.gameOrder));
              } else {
                convo.say('There are no teams scheduled to play now :cry:');
              }
            }
          });
        }
      });
      return true;
    });
  });
};
