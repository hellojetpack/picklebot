module.exports = (controller) => {
  controller.hears([/^next.*?(\d{0,2}):?(\d{0,2})$/i], ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
    // Convert to millitary time
    const hours = message.match[1] > 12 ? 12 + message.match[1] : message.match[1];
    const mins = message.match[2];

    let gameScheduled = false;

    controller.storage.teams.get(message.team, (err, data) => {
      if (err) {
        bot.replyInThread(message, `err... I'm having trouble accesing my data stores because of: ${err}`);
        return false; // do not bubble
      }

      const teamData = data;

      if (!teamData || !teamData.gameOrder || teamData.gameOrder.length === 0) {
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
      if (hours) {
        const time = new Date();
        time.setHours(hours, mins);
        gameScheduled = true;
        const updatedGameOrder = addScheduledGame(message.user, time);
        cont
      }
    });
  });
};
