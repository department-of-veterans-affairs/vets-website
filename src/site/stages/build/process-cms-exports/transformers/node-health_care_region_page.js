const { getImageCrop } = require('./helpers');
const {
  getDrupalValue,
  createMetaTagArray,
  uriToUrl,
  isPublished,
} = require('./helpers');

const getSocialMediaObject = ({ uri, title }) =>
  uri
    ? {
        url: { path: uri },
        title,
      }
    : null;

const currentTimeInSeconds = new Date().getTime() / 1000;

const transform = (
  {
    title,
    status,
    metatag: { value: metaTags },
    fieldIntroText,
    fieldGovdeliveryIdEmerg,
    fieldGovdeliveryIdNews,
    fieldOperatingStatus,
    fieldOtherVaLocations,
    fieldRelatedLinks,
    fieldLinkFacilityEmergList,
    reverseFieldRegionPage,
    reverseFieldOffice,
    fieldMedia,
  },
  { ancestors },
) => ({
  entityType: 'node',
  entityBundle: 'health_care_region_page',
  entityPublished: isPublished(getDrupalValue(status)),
  entityLabel: getDrupalValue(title),
  title: getDrupalValue(title),
  fieldIntroText: getDrupalValue(fieldIntroText),
  fieldGovdeliveryIdEmerg: getDrupalValue(fieldGovdeliveryIdEmerg),
  fieldGovdeliveryIdNews: getDrupalValue(fieldGovdeliveryIdNews),
  fieldOperatingStatus: fieldOperatingStatus[0]
    ? getSocialMediaObject(fieldOperatingStatus[0])
    : null,
  fieldMedia:
    fieldMedia && fieldMedia.length
      ? { entity: getImageCrop(fieldMedia[0], '_72MEDIUMTHUMBNAIL') }
      : null,
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
  entityMetatags: createMetaTagArray(metaTags),
  reverseFieldRegionPageNode: {
    entities: reverseFieldRegionPage
      ? reverseFieldRegionPage.filter(p => {
          return !ancestors.find(r => r.entity.uuid === p.uuid);
        })
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
              reverseField.fieldDatetimeRangeTimezone.value >
                currentTimeInSeconds,
          )
          .sort(
            (a, b) =>
              a.fieldDatetimeRangeTimezone.value -
              b.fieldDatetimeRangeTimezone.value,
          )
          .slice(0, 2)
          .map(r => ({
            title: r.title,
            uid: r.uid,
            fieldDatetimeRangeTimezone: r.fieldDatetimeRangeTimezone,
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
          .sort(
            (a, b) =>
              a.fieldDatetimeRangeTimezone.value -
              b.fieldDatetimeRangeTimezone.value,
          )
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
          .map(r => ({
            entityUrl: r.entityUrl,
            entityBundle: r.entityBundle,
            title: r.title,
            entityId: r.entityId,
            changed: r.changed,
            fieldOperatingStatusFacility: r.fieldOperatingStatusFacility,
            fieldFacilityLocatorApiId: r.fieldFacilityLocatorApiId,
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
  fieldOtherVaLocations: fieldOtherVaLocations.map(i => i.value),
  otherFacilities: {
    entities: reverseFieldRegionPage
      ? reverseFieldRegionPage
          .filter(
            reverseField =>
              !reverseField.fieldMainLocation && reverseField.entityPublished,
          )
          .map(r => ({
            entityUrl: r.entityUrl,
            entityBundle: r.entityBundle,
            title: r.title,
            entityId: r.entityId,
            changed: r.changed,
            fieldOperatingStatusFacility: r.fieldOperatingStatusFacility,
            fieldFacilityLocatorApiId: r.fieldFacilityLocatorApiId,
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
                        reverseField.fieldDatetimeRangeTimezone.value >
                          currentTimeInSeconds,
                    )
                    .slice(0, 1000)
                    .map(e => ({
                      title: e.title,
                      fieldDatetimeRangeTimezone: e.fieldDatetimeRangeTimezone,
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
                        reverseField.fieldDatetimeRangeTimezone.value >
                          currentTimeInSeconds,
                    )
                    .map(e => ({
                      title: e.title,
                      fieldDatetimeRangeTimezone: e.fieldDatetimeRangeTimezone,
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
    'field_intro_text',
    'field_govdelivery_id_emerg',
    'field_govdelivery_id_news',
    'field_link_facility_emerg_list',
    'field_media',
    'field_operating_status',
    'field_other_va_locations',
    'field_press_release_blurb',
    'field_related_links',
    'metatag',
    'reverse_field_region_page',
    'reverse_field_office',
  ],
  transform,
};
