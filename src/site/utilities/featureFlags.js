const fs = require('fs');
const path = require('path');

// Edit this to add new flags
const featureFlags = {
  FEATURE_FIELD_REGIONAL_HEALTH_SERVICE: 'featureFieldRegionalHealthService',
  FEATURE_FIELD_ADDITIONAL_INFO: 'featureFieldAdditionalInformationAbo',
  FEATURE_FIELD_MEDIA_IN_LIBRARY: 'featureFieldMediaInLibrary',
  FEATURE_FIELD_ASSET_LIBRARY_DESCRIPTION:
    'featureFieldAssetLibraryDescription',
  FEATURE_FIELD_EVENT_LISTING_DESCRIPTION:
    'featureFieldEventListingDescription',
  FEATURE_FIELD_BODY: 'featureFieldBody',
  GRAPHQL_MODULE_UPDATE: 'featureGraphQLModuleUpdate',
  FEATURE_FIELD_OTHER_VA_LOCATIONS: 'featureFieldOtherVaLocations',
  FEATURE_FIELD_COMMONLY_TREATED_CONDITIONS:
    'featureFieldCommonlyTreatedConditions',
  FEATURE_HEALTH_CARE_REGION_DETAIL_PAGE_FIELD_ALERT:
    'FEATURE_HEALTH_CARE_REGION_DETAIL_PAGE_FIELD_ALERT',
  FEATURE_FIELD_LINKS: 'featureFieldLinks',
  FEATURE_REGION_DETAIL_PAGE_FEATURED_CONTENT: 'fieldFeaturedContent',
  FEATURE_LOCAL_FACILITY_GET_IN_TOUCH: 'featureLocalFacilityGetInTouch',
  FEATURE_SINGLE_VALUE_FIELD_LINK: 'featureSingleValueFieldLink',
  FEATURE_REGION_PAGE_LINKS: 'featureRegionPageLinks',
  FEATURE_REGION_DETAIL_PAGE_TOC: 'featureRegionDetailPageTOC',
  FEATURE_FEATURED_HEALTH_SERVICE_CONTENT:
    'featureFeaturedHealthServiceContent',
  FEATURE_FIELD_OPERATING_STATUS_FACILITY: 'fieldOperatingStatusFacility',
  FEATURE_FIELD_COMPLETE_BIOGRAPHY: 'fieldCompleteBiography',
  FEATURE_HEALTH_SERVICE_API_ID: 'featureHealthServiceApiId',
  FEATURE_DOWNLOADABLE_FILE: 'featureDownloadableFile',
};

// Edit this to turn flags on or off
const flagsByBuildtype = {
  localhost: [
    featureFlags.FEATURE_FIELD_ASSET_LIBRARY_DESCRIPTION,
    featureFlags.FEATURE_FIELD_EVENT_LISTING_DESCRIPTION,
    featureFlags.FEATURE_FIELD_BODY,
    featureFlags.FEATURE_FIELD_ADDITIONAL_INFO,
    featureFlags.FEATURE_FIELD_REGIONAL_HEALTH_SERVICE,
    featureFlags.GRAPHQL_MODULE_UPDATE,
    featureFlags.FEATURE_FIELD_OTHER_VA_LOCATIONS,
    featureFlags.FEATURE_HEALTH_CARE_REGION_DETAIL_PAGE_FIELD_ALERT,
    featureFlags.FEATURE_FIELD_COMMONLY_TREATED_CONDITIONS,
    featureFlags.FEATURE_FIELD_LINKS,
    featureFlags.FEATURE_REGION_DETAIL_PAGE_FEATURED_CONTENT,
    featureFlags.FEATURE_LOCAL_FACILITY_GET_IN_TOUCH,
    featureFlags.FEATURE_REGION_PAGE_LINKS,
    featureFlags.FEATURE_REGION_DETAIL_PAGE_TOC,
    featureFlags.FEATURE_FEATURED_HEALTH_SERVICE_CONTENT,
    featureFlags.FEATURE_FIELD_OPERATING_STATUS_FACILITY,
    featureFlags.FEATURE_FIELD_COMPLETE_BIOGRAPHY,
    featureFlags.FEATURE_HEALTH_SERVICE_API_ID,
    featureFlags.FEATURE_DOWNLOADABLE_FILE,
  ],
  vagovdev: [
    featureFlags.FEATURE_FIELD_ASSET_LIBRARY_DESCRIPTION,
    featureFlags.FEATURE_FIELD_EVENT_LISTING_DESCRIPTION,
    featureFlags.FEATURE_FIELD_BODY,
    featureFlags.FEATURE_FIELD_ADDITIONAL_INFO,
    featureFlags.FEATURE_FIELD_REGIONAL_HEALTH_SERVICE,
    featureFlags.GRAPHQL_MODULE_UPDATE,
    featureFlags.FEATURE_FIELD_OTHER_VA_LOCATIONS,
    featureFlags.FEATURE_HEALTH_CARE_REGION_DETAIL_PAGE_FIELD_ALERT,
    featureFlags.FEATURE_FIELD_COMMONLY_TREATED_CONDITIONS,
    featureFlags.FEATURE_FIELD_LINKS,
    featureFlags.FEATURE_REGION_DETAIL_PAGE_FEATURED_CONTENT,
    featureFlags.FEATURE_LOCAL_FACILITY_GET_IN_TOUCH,
    featureFlags.FEATURE_REGION_PAGE_LINKS,
    featureFlags.FEATURE_REGION_DETAIL_PAGE_TOC,
    featureFlags.FEATURE_FEATURED_HEALTH_SERVICE_CONTENT,
    featureFlags.FEATURE_FIELD_OPERATING_STATUS_FACILITY,
    featureFlags.FEATURE_FIELD_COMPLETE_BIOGRAPHY,
    featureFlags.FEATURE_HEALTH_SERVICE_API_ID,
    featureFlags.FEATURE_DOWNLOADABLE_FILE,
  ],
  vagovstaging: [
    featureFlags.FEATURE_FIELD_ADDITIONAL_INFO,
    featureFlags.FEATURE_FIELD_REGIONAL_HEALTH_SERVICE,
    featureFlags.GRAPHQL_MODULE_UPDATE,
    featureFlags.FEATURE_FIELD_BODY,
    featureFlags.FEATURE_FIELD_OTHER_VA_LOCATIONS,
    featureFlags.FEATURE_HEALTH_CARE_REGION_DETAIL_PAGE_FIELD_ALERT,
    featureFlags.FEATURE_FIELD_COMMONLY_TREATED_CONDITIONS,
    featureFlags.FEATURE_FIELD_LINKS,
    featureFlags.FEATURE_REGION_DETAIL_PAGE_FEATURED_CONTENT,
    featureFlags.FEATURE_REGION_PAGE_LINKS,
    featureFlags.FEATURE_REGION_DETAIL_PAGE_TOC,
    featureFlags.FEATURE_FEATURED_HEALTH_SERVICE_CONTENT,
    featureFlags.FEATURE_FIELD_OPERATING_STATUS_FACILITY,
    featureFlags.FEATURE_FIELD_COMPLETE_BIOGRAPHY,
    featureFlags.FEATURE_HEALTH_SERVICE_API_ID,
    featureFlags.FEATURE_DOWNLOADABLE_FILE,
  ],
  vagovprod: [
    featureFlags.FEATURE_FIELD_ADDITIONAL_INFO,
    featureFlags.FEATURE_FIELD_REGIONAL_HEALTH_SERVICE,
    featureFlags.GRAPHQL_MODULE_UPDATE,
    featureFlags.FEATURE_FIELD_BODY,
    featureFlags.FEATURE_FIELD_OTHER_VA_LOCATIONS,
    featureFlags.FEATURE_HEALTH_CARE_REGION_DETAIL_PAGE_FIELD_ALERT,
    featureFlags.FEATURE_FIELD_COMMONLY_TREATED_CONDITIONS,
    featureFlags.FEATURE_FIELD_LINKS,
    featureFlags.FEATURE_REGION_DETAIL_PAGE_FEATURED_CONTENT,
    featureFlags.FEATURE_REGION_PAGE_LINKS,
  ],
};

// Exported feature flag state, which can be used in code as needed
const enabledFeatureFlags = Object.values(featureFlags).reduce((acc, next) => {
  acc[next] = flagsByBuildtype[global.buildtype].includes(next);
  return acc;
}, {});

const applyFeatureFlags = (moduleToFlag, flagToUse = null) => {
  let flaggedPath;
  Object.keys(enabledFeatureFlags)
    .filter(
      flag => enabledFeatureFlags[flag] && (!flagToUse || flagToUse === flag),
    )
    .forEach(flag => {
      const extension = path.extname(moduleToFlag.filename);
      const pathToTest = moduleToFlag.filename.replace(
        extension,
        `.${flag}${extension}`,
      );

      if (fs.existsSync(pathToTest)) {
        flaggedPath = pathToTest;
      }
    });

  if (flaggedPath) {
    // eslint-disable-next-line import/no-dynamic-require,no-param-reassign
    moduleToFlag.exports = require(flaggedPath);
  }
};

Object.defineProperty(global, 'applyFeatureFlags', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: applyFeatureFlags,
});

module.exports = {
  enabledFeatureFlags,
  featureFlags,
};
