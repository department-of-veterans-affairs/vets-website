const {
  getDrupalValue,
  createMetaTagArray,
  utcToEpochTime,
} = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'node',
    entityBundle: 'publication_listing',
    title: getDrupalValue(entity.title),
    changed: utcToEpochTime(getDrupalValue(entity.changed)),
    entityMetatags: createMetaTagArray(entity.metatag.value),
    entityUrl: {
      breadcrumb: [],
      path: entity.path[0].alias,
    },
    fieldIntroText: getDrupalValue(entity.fieldIntroText),
    fieldOffice: entity.fieldOffice[0],
  },
});
module.exports = {
  filter: [
    'title',
    'changed',
    'metatag',
    'path',
    'field_intro_text',
    'field_office',
  ],
  transform,
};
