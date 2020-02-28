const {
  getDrupalValue,
  getWysiwygString,
  createMetaTagArray,
} = require('./helpers');

const transform = ({
  title,
  path,
  moderationState,
  metatag: { value: metaTags },
  fieldNicknameForThisFacility,
  fieldRelatedLinks,
  fieldPressReleaseBlurb,
}) => ({
  entity: {
    entityType: 'node',
    entityBundle: 'health_care_region_page',
    entityPublished: getDrupalValue(moderationState) === 'published',
    entityLabel: getDrupalValue(title),
    title: getDrupalValue(title),
    entityUrl: {
      path: path[0].alias,
    },
    fieldNicknameForThisFacility: getDrupalValue(fieldNicknameForThisFacility),
    fieldRelatedLinks: fieldRelatedLinks[0],
    fieldPressReleaseBlurb: {
      processed: getWysiwygString(getDrupalValue(fieldPressReleaseBlurb)),
    },
    entityMetatags: createMetaTagArray(metaTags),
  },
});
module.exports = {
  filter: [
    'title',
    'moderation_state',
    'path',
    'field_nickname_for_this_facility',
    'field_related_links',
    'field_press_release_blurb',
    'metatag',
  ],
  transform,
};
