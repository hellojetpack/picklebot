const interpolateColor = (colorStart, colorEnd, t) =>
                         Math.round(colorStart + ((colorEnd - colorStart) * t));

const component2Hex = (c) => {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
};

const createColor = (startArr, endArr, t) => {
  const rgbArr = startArr.map((elem, index) => interpolateColor(elem, endArr[index], t));
  return rgbArr.map(elem => component2Hex(elem)).join('');
};

const addColor = aArr => aArr.map((elem, index, arr) => {
  const value = index / (arr.length - 1);
  const color = { color: createColor([11, 225, 162], [11, 57, 225], value).toUpperCase() };
  return Object.assign({}, elem, color);
});

const formatAttachment = (obj) => {
  const attachment = {};
  const fields = [{ value: obj.createdBy, short: true }];
  const timeField = {};
  const boldOrNo = obj.scheduled ? 'title' : 'value';
  timeField[boldOrNo] = obj.gameTime;
  timeField.short = true;
  fields.push(timeField);
  attachment.color = '';
  attachment.fields = fields;
  return attachment;
};

const formatMessage = (arr) => {
  const gameOrderMessage = {};
  let attachments = arr.reduce((acc, curr) => acc.concat(formatAttachment(curr)), []);
  attachments = addColor(attachments);
  attachments.push({ text: '',
    footer: 'Type "@pickleball next" to get on the list!',
    footer_icon: 'https://platform.slack-edge.com/img/default_application_icon.png',
    color: '' });

  gameOrderMessage.text = ':point_down: Here is the current game list:';
  gameOrderMessage.attachments = attachments;

  return gameOrderMessage;
};
module.exports = { formatAttachment, formatMessage, addColor };
