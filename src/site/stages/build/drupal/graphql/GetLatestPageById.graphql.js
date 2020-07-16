const landingPage = require('./landingPage.graphql');
const page = require('./page.graphql');
const fragments = require('./fragments.graphql');
const healthCareRegionPage = require('./healthCareRegionPage.graphql');

const healthCareLocalFacilityPage = require('./healthCareLocalFacilityPage.graphql');
const healthCareRegionDetailPage = require('./healthCareRegionDetailPage.graphql');
const newsStoryPage = require('./newStoryPage.graphql');
const vaFormPage = require('./vaFormPage.graphql');
const pressReleasePage = require('./pressReleasePage.graphql');
const vamcOperatingStatusAndAlerts = require('./vamcOperatingStatusAndAlerts.graphql');
const sidebarQuery = require('./navigation-fragments/sidebar.nav.graphql');
const facilitySidebarQuery = require('./navigation-fragments/facilitySidebar.nav.graphql');
const bioPage = require('./bioPage.graphql');
const eventPage = require('./eventPage.graphql');
const alertsQuery = require('./alerts.graphql');
const bannerAlertsQuery = require('./bannerAlerts.graphql');
const icsFileQuery = require('./file-fragments/ics.file.graphql');
const allSideNavMachineNamesQuery = require('./navigation-fragments/allSideNavMachineNames.nav.graphql');
const menuLinksQuery = require('./navigation-fragments/menuLinks.nav.graphql');

// Get current feature flags
const { cmsFeatureFlags } = global;

// String Helpers
const {
  updateQueryString,
  queryParamToBeChanged,
} = require('./../../../../utilities/stringHelpers');

/**
 * Queries for a page by the node id, getting the latest revision
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
  ${vamcOperatingStatusAndAlerts}
  ${newsStoryPage}
  ${eventPage}
  ${bioPage}
  ${vaFormPage}

  query GetLatestPageById($id: String!, $today: String!, $onlyPublishedContent: Boolean!) {
    nodes: nodeQuery(revisions: LATEST, filter: {
    conditions: [
      { field: "nid", value: [$id] }
    ]
    }) {
      entities {
        ... landingPage
        ... page
        ... healthCareRegionPage
        ... healthCareLocalFacilityPage
        ... healthCareRegionDetailPage
        ... newsStoryPage
        ... pressReleasePage
        ... vamcOperatingStatusAndAlerts
        ... eventPage
        ... bioPage
        ... vaFormPage
      }
    }
    ${icsFileQuery}
    ${sidebarQuery}
    ${facilitySidebarQuery}
    ${alertsQuery}
    ${bannerAlertsQuery}
    ${
      cmsFeatureFlags.FEATURE_ALL_HUB_SIDE_NAVS
        ? `${allSideNavMachineNamesQuery}`
        : ''
    }
    ${menuLinksQuery}
  }
`;

const query = module.exports;

let regString = '';
queryParamToBeChanged.forEach(param => {
  regString += `${param}|`;
});

const regex = new RegExp(`${regString}`, 'g');
module.exports = query.replace(regex, updateQueryString);
