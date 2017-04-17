module.exports = (controller) => {
  controller.hears(['help'], ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
    bot.reply(message, {
      attachments: [
        {
          fallback: 'Here are a few things you can ask me:',
          callback_id: `981-${message.user}`,
          color: '#C1F862',
          pretext: 'Here are a few things you can ask me:',
          title: 'Hopefully Helpful Commands',
          text: '• *`@picklebot next`* - Adds you to the game order list \n\n' +
          '• *`@picklebot next [time]`* - Adds you to the game order list at a specific time \n\n' +
          '• *`@picklebot game order` OR `games`* - Shows the current game order \n\n' +
          '• *`@picklebot skip`* - Moves your game down one slot in the game order list \n\n' +
          '• *`@picklebot remove`* - Removes your game from the game order list \n\n' +
          '• *`@picklebot avg game time`* - Tells you the average game time duh! \n\n' +
          '• *`@picklebot order food`* - You just Ordered pizza for the whole team!  You are now the team favorite!! JK',
          mrkdwn_in: ['text'],
          attachment_type: 'default',
          actions: [
            {
              name: 'done',
              text: 'Done',
              type: 'button',
              style: 'primary',
              value: 'done',
            },
          ],
        },
      ],
    });
  });
  controller.on('interactive_message_callback', (bot, message) => {
    if (message.callback_id === `981-${message.user}`) {
      bot.replyInteractive(message, 'You Said you were done...so I closed the help screen');
    }
  });
};
