const {
  getDrupalValue,
  utcToEpochTime,
  createMetaTagArray,
} = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'event_listing',
  entityUrl: {
    // TODO: Get the breadcrumb from the CMS export when it's available
    breadcrumb: [],
    path: entity.path[0].alias,
  },
  entityMetatags: createMetaTagArray(entity.metatag.value),
  title: getDrupalValue(entity.title),
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  fieldIntroText: getDrupalValue(entity.fieldIntroText),
  fieldOffice: entity.fieldOffice[0],
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
