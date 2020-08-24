const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  // TODO: Change this to get the actual derivative from the CMS export data
  url: getDrupalValue(entity.uri) ? getDrupalValue(entity.uri) : '',
  filename: getDrupalValue(entity.filename),
});
module.exports = {
  filter: ['uri', 'filename'],
  transform,
};
