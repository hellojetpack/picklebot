import { addScheduledGame, addSimpleGame, gameTimeConflicts, convertTo24 } from '../components/add_game_methods';
import reactionsMsg from '../components/reactions';
import { formatMessage } from '../components/message_formating';

module.exports = (controller) => {
  controller.hears([/^next.*?(\d{0,2}):?(\d{0,2})$/i], ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
    const hour = message.match[1] ? convertTo24(message.ts, message.match[1]) : false;
    const mins = message.match[2] ? message.match[2] : '00';

    controller.storage.teams.get(message.team, (err, data) => {
      if (err) {
        bot.replyInThread(message, `err... I'm having trouble accesing my data stores because of: ${err}`);
        return false; // do not bubble
      }

      const teamData = data;

      if (!teamData || !teamData.gameOrder) {
        bot.replyInThread(message, 'I am currently not tracking any games at this time. :cry:');
        return false; // do not bubble
      }

      const inList = teamData.gameOrder.find(gameSlot => gameSlot.createdBy === message.user);
      if (inList) {
        bot.startConversationInThread(message, (convErr, convo) => {
          if (convErr) {
            throw new Error();
          } else {
            convo.say('Currently, I can only have you scheduled for one game at a time :scream:');
            convo.say('When you are done with your game, come back and tell me to schedule a new game for you.');
          }
        });
        return false; // no bubbles
      }

      let scheduledGame;

      if (hour) {
        if (gameTimeConflicts(teamData.gameOrder, `${hour}:${mins}`)) {
          bot.startConversationInThread(message, (convErr, convo) => {
            if (convErr) throw new Error();
            convo.say('Looks like the time you are trying to schedule will interfere with another game.');
            convo.say('Try a different time');
          });
          return false;
        }

        scheduledGame = addScheduledGame(teamData.gameOrder, message.user, `${hour}:${mins}`);
      } else {
        scheduledGame = addSimpleGame(teamData.gameOrder, message.user, message.ts);
      }

      teamData.gameOrder = scheduledGame;

      controller.storage.teams.save(teamData, (saveErr, saved) => {
        if (saveErr) {
          bot.replyInThread(message, `Could not save to my db at this time because ${saveErr}`);
        } else {
          bot.api.reactions.add(reactionsMsg.thumbsup(message));
          bot.reply(message, formatMessage(saved.gameOrder));
        }
      });

      return true;
    });
  });
};
