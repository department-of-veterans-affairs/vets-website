const moment = require('moment');
const {
  getDrupalValue,
  getWysiwygString,
  createMetaTagArray,
  uriToUrl,
  isPublished,
} = require('./helpers');

const transform = ({
  title,
  status,
  metatag: { value: metaTags },
  fieldNicknameForThisFacility,
  fieldRelatedLinks,
  fieldPressReleaseBlurb,
  fieldLinkFacilityEmergList,
  fieldLeadership,
  reverseFieldRegionPage,
  reverseFieldOffice,
}) => ({
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
  reverseFieldRegionPageNode: {
    entities: reverseFieldRegionPage
      ? reverseFieldRegionPage
          .filter(
            reverseField =>
              reverseField.entityBundle === 'health_care_local_facility',
          )
          .map(r => ({
            title: r.title,
            fieldOperatingStatusFacility: r.fieldOperatingStatusFacility,
          }))
      : [],
  },
  newsStoryTeasers: {
    entities: reverseFieldOffice
      ? reverseFieldOffice
          .filter(
            reverseField =>
              reverseField.entityBundle === 'news_story' &&
              reverseField.entityPublished &&
              reverseField.fieldFeatured,
          )
          .sort((a, b) => b.created - a.created)
          .slice(0, 2)
          .map(r => ({
            title: r.title,
            fieldFeatured: r.fieldFeatured,
            fieldIntroText: r.fieldIntroText,
            fieldMedia: r.fieldMedia,
            entityUrl: r.entityUrl,
          }))
      : [],
  },
  allNewsStoryTeasers: {
    entities: reverseFieldOffice
      ? reverseFieldOffice
          .filter(
            reverseField =>
              reverseField.entityBundle === 'news_story' &&
              reverseField.entityPublished,
          )
          .sort((a, b) => b.created - a.created)
          .slice(0, 500)
          .map(r => ({
            title: r.title,
            fieldFeatured: r.fieldFeatured,
            fieldIntroText: r.fieldIntroText,
            fieldMedia: r.fieldMedia,
            entityUrl: r.entityUrl,
          }))
      : [],
  },
  eventTeasers: {
    entities: reverseFieldOffice
      ? reverseFieldOffice
          .filter(
            reverseField =>
              reverseField.entityBundle === 'event' &&
              reverseField.entityPublished &&
              reverseField.fieldFeatured &&
              moment(reverseField.fieldDate.value).isAfter(moment(), 'day'),
          )
          .sort((a, b) => a.fieldDate.value - b.fieldDate.value)
          .slice(0, 2)
          .map(r => ({
            title: r.title,
            uid: r.uid,
            fieldDate: r.fieldDate,
            fieldDescription: r.fieldDescription,
            fieldLocationHumanreadable: r.fieldLocationHumanreadable,
            fieldFacilityLocation: r.fieldFacilityLocation,
            entityUrl: r.entityUrl,
          }))
      : [],
  },
  allEventTeasers: {
    entities: reverseFieldOffice
      ? reverseFieldOffice
          .filter(
            reverseField =>
              reverseField.entityBundle === 'event' &&
              reverseField.entityPublished,
          )
          .sort((a, b) => a.fieldDate.value - b.fieldDate.value)
          .slice(0, 500)
          .map(r => ({
            title: r.title,
            fieldFeatured: r.fieldFeatured,
            fieldIntroText: r.fieldIntroText,
            fieldMedia: r.fieldMedia,
            entityUrl: r.entityUrl,
          }))
      : [],
  },
  allPressReleaseTeasers: {
    entities: reverseFieldOffice
      ? reverseFieldOffice
          .filter(
            reverseField =>
              reverseField.entityBundle === 'press_release' &&
              reverseField.entityPublished,
          )
          .sort((a, b) => b.fieldReleaseDate.value - a.fieldReleaseDate.value)
          .slice(0, 100)
          .map(r => ({
            title: r.title,
            fieldReleaseDate: r.fieldReleaseDate,
            entityUrl: r.entityUrl,
          }))
      : [],
  },
  mainFacilities: {
    entities: reverseFieldRegionPage
      ? reverseFieldRegionPage
          .filter(
            reverseField =>
              reverseField.fieldMainLocation && reverseField.entityPublished,
          )
          .sort((a, b) =>
            a.fieldNicknameForThisFacility.localeCompare(
              b.fieldNicknameForThisFacility,
            ),
          )
          .map(r => ({
            entityUrl: r.entityUrl,
            entityBundle: r.entityBundle,
            title: r.title,
            entityId: r.entityId,
            changed: r.changed,
            fieldOperatingStatusFacility: r.fieldOperatingStatusFacility,
            fieldFacilityLocatorApiId: r.fieldFacilityLocatorApiId,
            fieldNicknameForThisFacility: r.fieldNicknameForThisFacility,
            fieldIntroText: r.fieldIntroText,
            fieldLocationServices: r.fieldLocationServices,
            fieldAddress: r.fieldAddress,
            fieldPhoneNumber: r.fieldPhoneNumber,
            fieldMentalHealthPhone: r.fieldMentalHealthPhone,
            fieldFacilityHours: r.fieldFacilityHours,
            fieldMainLocation: r.fieldMainLocation,
            fieldMedia: r.fieldMedia,
          }))
      : [],
  },
  otherFacilities: {
    entities: reverseFieldRegionPage
      ? reverseFieldRegionPage
          .filter(
            reverseField =>
              !reverseField.fieldMainLocation && reverseField.entityPublished,
          )
          .sort((a, b) =>
            a.fieldNicknameForThisFacility.localeCompare(
              b.fieldNicknameForThisFacility,
            ),
          )
          .map(r => ({
            entityUrl: r.entityUrl,
            entityBundle: r.entityBundle,
            title: r.title,
            entityId: r.entityId,
            changed: r.changed,
            fieldOperatingStatusFacility: r.fieldOperatingStatusFacility,
            fieldFacilityLocatorApiId: r.fieldFacilityLocatorApiId,
            fieldNicknameForThisFacility: r.fieldNicknameForThisFacility,
            fieldIntroText: r.fieldIntroText,
            fieldLocationServices: r.fieldLocationServices,
            fieldAddress: r.fieldAddress,
            fieldPhoneNumber: r.fieldPhoneNumber,
            fieldMentalHealthPhone: r.fieldMentalHealthPhone,
            fieldFacilityHours: r.fieldFacilityHours,
            fieldMainLocation: r.fieldMainLocation,
            fieldMedia: r.fieldMedia,
          }))
      : [],
  },
  eventTeasersAll: {
    entities: reverseFieldOffice
      ? reverseFieldOffice
          .filter(reverseField => reverseField.entityBundle === 'event_listing')
          .slice(0, 1000)
          .map(r => ({
            reverseFieldListingNode: {
              entities: r.reverseFieldListingNode
                ? r.reverseFieldListingNode.entities
                    .filter(
                      reverseField =>
                        reverseField.entityBundle === 'event' &&
                        reverseField.entityPublished &&
                        moment(reverseField.fieldDate.value).isAfter(
                          moment(),
                          'day',
                        ),
                    )
                    .slice(0, 1000)
                    .map(e => ({
                      title: e.title,
                      fieldDate: e.fieldDate,
                      fieldDescription: e.fieldDescription,
                      fieldLocationHumanreadable: e.fieldLocationHumanreadable,
                      fieldFacilityLocation: e.fieldFacilityLocation,
                      entityUrl: e.entityUrl,
                    }))
                : [],
            },
          }))
      : [],
  },
  eventTeasersFeatured: {
    entities: reverseFieldOffice
      ? reverseFieldOffice
          .filter(reverseField => reverseField.entityBundle === 'event_listing')
          .slice(0, 1000)
          .map(r => ({
            reverseFieldListingNode: {
              entities: r.reverseFieldListingNode
                ? r.reverseFieldListingNode.entities
                    .slice(0, 1000)
                    .filter(
                      reverseField =>
                        reverseField.entityBundle === 'event' &&
                        reverseField.entityPublished &&
                        reverseField.fieldFeatured &&
                        moment(reverseField.fieldDate.value).isAfter(
                          moment(),
                          'day',
                        ),
                    )
                    .map(e => ({
                      title: e.title,
                      fieldDate: e.fieldDate,
                      fieldDescription: e.fieldDescription,
                      fieldLocationHumanreadable: e.fieldLocationHumanreadable,
                      fieldFacilityLocation: e.fieldFacilityLocation,
                      entityUrl: e.entityUrl,
                    }))
                : [],
            },
          }))
      : [],
  },
  newsStoryTeasersFeatured: {
    entities: reverseFieldOffice
      ? reverseFieldOffice
          .filter(reverseField => reverseField.entityBundle === 'story_listing')
          .slice(0, 1000)
          .map(r => ({
            reverseFieldListingNode: {
              entities: r.reverseFieldListingNode
                ? r.reverseFieldListingNode.entities
                    .filter(
                      reverseField =>
                        reverseField.entityBundle === 'news_story' &&
                        reverseField.entityPublished &&
                        reverseField.fieldFeatured,
                    )
                    .slice(0, 1000)
                    .map(e => ({
                      title: e.title,
                      fieldFeatured: e.fieldFeatured,
                      fieldIntroText: e.fieldIntroText,
                      fieldMedia: e.fieldMedia,
                      entityUrl: e.entityUrl,
                    }))
                : [],
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
    'reverse_field_region_page',
    'reverse_field_office',
  ],
  transform,
};
