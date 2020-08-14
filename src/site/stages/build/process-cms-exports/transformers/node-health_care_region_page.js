const {
  getDrupalValue,
  getWysiwygString,
  createMetaTagArray,
  uriToUrl,
  isPublished,
} = require('./helpers');

const transform = ({
  title,
  path,
  status,
  metatag: { value: metaTags },
  fieldNicknameForThisFacility,
  fieldRelatedLinks,
  fieldPressReleaseBlurb,
  fieldLinkFacilityEmergList,
  fieldLeadership,
}) => ({
  entity: {
    entityType: 'node',
    entityBundle: 'health_care_region_page',
    entityPublished: isPublished(getDrupalValue(status)),
    entityLabel: getDrupalValue(title),
    title: getDrupalValue(title),
    fieldNicknameForThisFacility: getDrupalValue(fieldNicknameForThisFacility),
    fieldLinkFacilityEmergList:
      fieldLinkFacilityEmergList && fieldLinkFacilityEmergList[0]
        ? {
            url: {
              path: uriToUrl(fieldLinkFacilityEmergList[0].uri),
              routed: false, // Until we have an indication of where this comes from
            },
          }
        : null,
    fieldRelatedLinks: fieldRelatedLinks[0],
    fieldPressReleaseBlurb: {
      processed: getWysiwygString(getDrupalValue(fieldPressReleaseBlurb)),
    },
    entityMetatags: createMetaTagArray(metaTags),
    fieldLeadership: fieldLeadership.length
      ? fieldLeadership.map(n => ({
          entity: {
            entityPublished: n.entityPublished,
            title: n.title,
            fieldNameFirst: n.fieldNameFirst,
            fieldLastName: n.fieldLastName,
            fieldSuffix: n.fieldSuffix,
            fieldEmailAddress: n.fieldEmailAddress,
            fieldPhoneNumber: n.fieldPhoneNumber,
            fieldDescription: n.fieldDescription,
            fieldOffice: {
              entity: {
                entityLabel: 'VA Pittsburgh health care',
                entityType: 'node',
              },
            },
            fieldIntroText: n.fieldIntroText,
            fieldPhotoAllowHiresDownload: n.fieldPhotoAllowHiresDownload,
            fieldMedia: n.fieldMedia,
            fieldBody: n.fieldBody,
            changed: n.changed,
            entityUrl: n.entityUrl,
          },
        }))
      : [],
  },
});
module.exports = {
  filter: [
    'title',
    'status',
    'path',
    'field_nickname_for_this_facility',
    'field_link_facility_emerg_list',
    'field_related_links',
    'field_press_release_blurb',
    'metatag',
    'field_leadership',
  ],
  transform,
};
