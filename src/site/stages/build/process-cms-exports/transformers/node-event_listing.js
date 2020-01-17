const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'node',
    entityBundle: 'event_listing',
    title: getDrupalValue(entity.title),
    changed: getDrupalValue(entity.changed),
    metatag: getDrupalValue(entity.metatag),
    path: getDrupalValue(entity.path),
    fieldIntroText: getDrupalValue(entity.fieldIntroText),
    fieldOffice: getDrupalValue(entity.fieldOffice),
  },
});
module.exports = {
  filter: ['title', 'changed', 'metatag', 'path', 'field_intro_text', 'field_office'],
  transform,
};
