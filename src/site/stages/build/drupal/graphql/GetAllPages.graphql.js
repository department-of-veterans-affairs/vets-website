const landingPage = require('./landingPage.graphql');
const page = require('./page.graphql');
const healthCareRegionPage = require('./healthCareRegionPage.graphql');

const healthCareLocalFacilityPage = require('./healthCareLocalFacilityPage.graphql');
const healthCareRegionDetailPage = require('./healthCareRegionDetailPage.graphql');
const pressReleasePage = require('./pressReleasePage.graphql');
const fragments = require('./fragments.graphql');
const newsStoryPage = require('./newStoryPage.graphql');
const sidebarQuery = require('./navigation-fragments/sidebar.nav.graphql');
const alertsQuery = require('./alerts.graphql');
const eventPage = require('./eventPage.graphql');
const facilitySidebarQuery = require('./navigation-fragments/facilitySidebar.nav.graphql');
const icsFileQuery = require('./file-fragments/ics.file.graphql');
const outreachAssetsQuery = require('./file-fragments/outreachAssets.graphql');
const bioPage = require('./bioPage.graphql');

// Get current feature flags
const {
  featureFlags,
  enabledFeatureFlags,
} = require('./../../../../utilities/featureFlags');

// String Helpers
const {
  updateQueryString,
  queryParamToBeChanged,
} = require('./../../../../utilities/stringHelpers');

/**
 * Queries for all of the pages out of Drupal
 * To execute, run this query at http://staging.va.agile6.com/graphql/explorer.
 */
module.exports = `

  ${fragments}
  ${landingPage}
  ${page}
  ${healthCareRegionPage}
  ${healthCareLocalFacilityPage}
  ${healthCareRegionDetailPage}
  ${pressReleasePage}
  ${newsStoryPage}
  ${eventPage}
  ${bioPage}

  query GetAllPages($today: String!, $onlyPublishedContent: Boolean!) {
    nodeQuery(limit: 500, filter: {
      conditions: [
        { field: "status", value: ["1"], enabled: $onlyPublishedContent }
      ]
    }) {
      entities {
        ... landingPage
        ... page
        ... healthCareRegionPage
        ... healthCareLocalFacilityPage
        ... healthCareRegionDetailPage
        ... pressReleasePage
        ... newsStoryPage
        ... eventPage
        ... bioPage
      }
    }
    ${icsFileQuery}
    ${sidebarQuery}
    ${facilitySidebarQuery}
    ${alertsQuery}
    ${outreachAssetsQuery}
  }
`;

if (enabledFeatureFlags[featureFlags.GRAPHQL_MODULE_UPDATE]) {
  const query = module.exports;

  let regString = '';
  queryParamToBeChanged.forEach(param => {
    regString += `${param}|`;
  });

  const regex = new RegExp(`${regString}`, 'g');
  module.exports = query.replace(regex, updateQueryString);
}
