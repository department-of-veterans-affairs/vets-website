const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  // TODO: Change this to get the actual derivative from the CMS export data
  derivative: {
    url: getDrupalValue(entity.uri),
  },
});
module.exports = {
  filter: ['uri'],
  transform,
};
