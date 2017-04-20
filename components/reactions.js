const thumbsup = (msgObj) => {
  const reaction = {
    name: 'thumbsup',
    channel: msgObj.channel,
    timestamp: msgObj.ts,
  };
  return reaction;
};


module.exports = { thumbsup };
