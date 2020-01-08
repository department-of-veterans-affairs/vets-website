// const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'media',
    entityBundle: 'image',
    image: entity.image,
  },
});
module.exports = {
  filter: ['image'],
  transform,
};
