const {
  createMetaTagArray,
  getDrupalValue,
  utcToEpochTime,
  getWysiwygString,
} = require('./helpers');

const transform = entity => ({
  targetId: getDrupalValue(entity.nid),
  entityType: 'node',
  entityBundle: 'office',
  entityLabel: getDrupalValue(entity.title),
  title: getDrupalValue(entity.title),
  created: utcToEpochTime(getDrupalValue(entity.created)),
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  fieldAdministration: entity.fieldAdministration[0],
  fieldBody: {
    processed: getWysiwygString(getDrupalValue(entity.fieldBody)),
  },
  fieldDescription: getDrupalValue(entity.fieldDescription),
  fieldMetaTitle: getDrupalValue(entity.fieldMetaTitle),
});
module.exports = {
  filter: [
    'nid',
    'title',
    'created',
    'changed',
    'metatag',
    'field_administration',
    'field_body',
    'field_description',
    'field_meta_title',
  ],
  transform,
};
