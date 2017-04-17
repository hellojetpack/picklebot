
const interpolateColor = (colorStart, colorEnd, t) =>
                         Math.round(colorStart + ((colorEnd - colorStart) * t));

// takes an rgb value and converts it to a hex value
const component2Hex = (c) => {
  const hex = c.toString(16);
  // add 0 padding if needed
  return hex.length === 1 ? `0${hex}` : hex;
};

// converts a rgb triple array, interpolates it and returns a hex color string
const createColor = (startArr, endArr, t) => {
  const rgbArr = startArr.map((elem, index) => interpolateColor(elem, endArr[index], t));
  return rgbArr.map(elem => component2Hex(elem)).join('');
};

// takes an array of attachments and adds a color to each attachment
// starts with green and color interpolates to a dark blue
const addColor = aArr => aArr.map((elem, index, arr) => {
  const value = index / (arr.length - 1);
  const color = { color: createColor([11, 225, 162], [11, 57, 225], value).toUpperCase() };
  return Object.assign({}, elem, color);
});

// takes a game order game slot and converts it into a slack attachment with two fields
const formatAttachment = (obj) => {
  const attachment = {};
  const fields = [{ value: obj.createdBy, short: true }];
  const timeField = {};
  const boldOrNo = obj.scheduled ? 'title' : 'value'; // bold scheduled times
  timeField[boldOrNo] = obj.startTime;
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

  // adds field titles to the slack message
  attachments.unshift({ color: 'fff', fields: [{ title: 'Player', short: true }, { title: 'Game Time', short: true }] });

  // adds the footer to the slack message
  attachments.push({ text: '',
    footer: 'Type "@pickleball next" to get on the list!',
    footer_icon: 'https://platform.slack-edge.com/img/default_application_icon.png',
    color: 'fff' });
  gameOrderMessage.text = ':point_down: Here is the current game list:';
  gameOrderMessage.attachments = attachments;

  return gameOrderMessage;
};

module.exports = { formatAttachment, formatMessage, addColor };
