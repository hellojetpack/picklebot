//Allow users to get in the game order queue

module.exports = (controller) => {

  controller.hears( ['next'], 'direct_message, direct_mention, mention', (bot, message) => {

    controller.storage.teams.get( message.team, (err, teamData) => {

      if(!teamData.gameOrder) {
        teamData.gameOrder = [];
      }
      const gameOrderSlot = {createdBy: `<@${message.user}>` , scheduled: false , startTime: '10:30'};
      teamData.gameOrder.push(gameOrderSlot);

      controller.storage.teams.save( teamData, (err, saved) => {
        if(err) {
          bot.reply("Hmmm, I received an error when trying to save your spot:" + err );
        } else {
          bot.api.reactions.add({
            name: 'thumbsup',
            channel: message.channel,
            timestamp: message.ts
          });
          

          bot.reply( message, "Great news!, I got you in!! get ready to smash some pickleballs!")
        }
      });

    });
  });
}
