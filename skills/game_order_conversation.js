
module.exports = (controller) => {

  controller.hears(['order','games','list'], 'direct_mention, mention, ambient', (bot, message) => {

    controller.storage.channels.get( message.channel, (err, channelData) => {

      if ( !channelData || !channelData.gameOrder || channelData.gameOrder.length === 0 ) {
        bot.reply(message, 'Hello, There are curently no games scheduled. Say next or next `time` to get you in the queue!');
      } else {

        const text = `Here is the current game order:\n${generateGameOrder(channelData.gameOrder)}`;
        bot.reply( message, text);
      }
    });
  });

  const generateGameOrder = (arr) => arr.reduce( ( acc, curr, index ) => acc.concat(`${index + 1}) ${curr}\n`), "");
}
