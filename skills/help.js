module.exports = (controller) => {
  controller.hears(['help'], ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
    bot.reply(message, {
      attachments: [
        {
          fallback: 'Here are a few things you can ask me:',
          color: '#C1F862',
          pretext: 'Here are a few things you can ask me:',
          title: 'Hopefully Helpful Commands',
          text: '*`@picklebot next`* - Adds you to the game order list \n' +
          '*`@picklebot next [time]`* - Adds you to the game order list at a specific time \n' +
          '*`@picklebot game order` OR `games` OR `order` OR `list`* - Shows the current game order \n ' +
          '*`@picklebot skip`* - Moves your game down one slot in the game order list \n' +
          '*`@picklebot remove`* - Removes your game from the game order list \n' +
          '*`@picklebot avg game time` OR `average game time`* - Tells you the average game time duh! \n' +
          '*`@picklebot order food`* - You just Ordered pizza for the whole team!  You are now the team favorite!! JK',
          mrkdwn_in: ['text'],
        },
      ],
    },
    );
  });
};
