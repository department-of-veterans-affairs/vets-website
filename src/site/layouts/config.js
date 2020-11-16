const { ENTITY_BUNDLES } = require('../constants/content-modeling');

const directoryStructure = {
  'va-medical-centers': [
    ENTITY_BUNDLES.BIOS_PAGE,
    ENTITY_BUNDLES.EVENT,
    ENTITY_BUNDLES.EVENTS_PAGE,
    ENTITY_BUNDLES.EVENT_LISTING,
    ENTITY_BUNDLES.HEALTH_CARE_FACILITY_STATUS,
    ENTITY_BUNDLES.HEALTH_CARE_LOCAL_FACILITY,
    ENTITY_BUNDLES.HEALTH_CARE_LOCAL_HEALTH_SERVICE,
    ENTITY_BUNDLES.HEALTH_CARE_REGION_DETAIL_PAGE,
    ENTITY_BUNDLES.HEALTH_CARE_REGION_LOCATIONS_PAGE,
    ENTITY_BUNDLES.HEALTH_CARE_REGION_PAGE,
    ENTITY_BUNDLES.HEALTH_SERVICES_LISTING,
    ENTITY_BUNDLES.LEADERSHIP_LISTING,
    ENTITY_BUNDLES.LOCATIONS_LISTING,
    ENTITY_BUNDLES.NEWS_STORIES_PAGE,
    ENTITY_BUNDLES.NEWS_STORY,
    ENTITY_BUNDLES.OFFICE,
    ENTITY_BUNDLES.PERSON_PROFILE,
    ENTITY_BUNDLES.PRESS_RELEASE,
    ENTITY_BUNDLES.PRESS_RELEASES_LISTING,
    ENTITY_BUNDLES.PUBLICATION_LISTING,
    ENTITY_BUNDLES.REGIONAL_HEALTH_CARE_SERVICE_DES,
    ENTITY_BUNDLES.STORY_LISTING,
    ENTITY_BUNDLES.SUPPORT_SERVICE,
    ENTITY_BUNDLES.VAMC_OPERATING_STATUS_AND_ALERTS,
  ],
  'resources-and-support': [
    ENTITY_BUNDLES.BASIC_LANDING_PAGE,
    ENTITY_BUNDLES.CHECKLIST,
    ENTITY_BUNDLES.FAQ_MULTIPLE_Q_A,
    ENTITY_BUNDLES.MEDIA_LIST_IMAGES,
    ENTITY_BUNDLES.MEDIA_LIST_VIDEOS,
    ENTITY_BUNDLES.Q_A,
    ENTITY_BUNDLES.STEP_BY_STEP,
    ENTITY_BUNDLES.SUPPORT_RESOURCES_ARTICLE_LISTING,
    ENTITY_BUNDLES.SUPPORT_RESOURCES_DETAIL_PAGE,
  ],
  'benefit-hubs': [
    ENTITY_BUNDLES.HOME,
    ENTITY_BUNDLES.LANDING_PAGE,
    ENTITY_BUNDLES.PAGE,
    ENTITY_BUNDLES.VA_FORM,
  ],
  placeholders: [
    ENTITY_BUNDLES.FULL_WIDTH_BANNER_ALERT,
    ENTITY_BUNDLES.OUTREACH_ASSET,
  ],
};

const layoutFilesByEntityBundle = new Map();

for (const [directory, entityBundles] of Object.entries(directoryStructure)) {
  for (const entityBundle of entityBundles) {
    layoutFilesByEntityBundle.set(
      entityBundle,
      `${directory}/${entityBundle}.drupal.liquid`,
    );
  }
}

module.exports = {
  get(entityBundle) {
    const layoutFile = layoutFilesByEntityBundle.get(entityBundle);

    if (!layoutFile) {
      throw new Error(
        `No layout file configured for entityBundle "${entityBundle}". Are you writing a template for a new type of Drupal node? Open "src/site/layouts/config.js" to learn more and configure it.`,
      );
    }

    return layoutFile;
  },
};
