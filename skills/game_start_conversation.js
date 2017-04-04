//Allow users to get in the game order queue

module.exports = (controller) => {

  controller.hears( ['next'], 'direct_mention, mention', (bot, message) => {

    controller.storage.channels.get( message.channel, (err, channelData) => {

      if(!channelData) {
          channelData = {};
          channelData.id = message.channel;
          channelData.gameOrder = [];
      }

      channelData.gameOrder.push(`<@${message.user}>`);

      controller.storage.channels.save( channelData, (err, saved) => {
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
