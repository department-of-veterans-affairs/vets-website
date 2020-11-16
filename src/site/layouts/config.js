/**
 * Use this file to map a new type of Drupal node into a directory in "src/site/layouts".
 * This process leverages the "entityBundle" property on each Drupal node, which is a
 * a unique identifer of the page's content model.
 *
 * For example, observe the following query for Drupal's GraphQL schema.
 *
 *  ```graphql
 *  # https://prod.cms.va.gov/graphql/explorer
 * {
 *   nodeQuery(limit: 10) {
 *     entities {
 *       entityId
 *       entityBundle
 *     }
 *   }
 * }
 * ```
 *
 * This query will result in an array of Drupal nodes represented as objects with the shape:
 * {
 *   entityId - The ID of this node, which can be used to preview the page. Examples - "192", "816", "37"
 *   entityBundle - The name of this node's content model. Examples - "landing_page", "news_story", "va_form"
 * }
 *
 * The entityBundle of each item should align with the name of a layout file as configured in this file.
 * For example, { entityId: "8296", entityBundle: "basic_landing_page" } would indicate that there is a Drupal
 * node (page) of ID "8296" that uses the "resources-and-support/basic_landing_page.drupal.liquid" layout file
 * during the website templating process. The page's live preview could be visited at "http://preview-prod.vfs.va.gov/preview?nodeId=8296".
 *
 * If you are writing a template for a new type of Drupal node, follow these steps.
 * 1. Write the data layer of the new Drupal node via the content export or GraphQL (for the preview server)
 * 2. Find the name of the "entityBundle" of the Drupal node, which should be provided to you by an engineer on the CMS team.
 * 3. Create the file
 */

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
