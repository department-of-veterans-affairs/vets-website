const landingPage = require('./landingPage.graphql');
const page = require('./page.graphql');
const healthCareRegionPage = require('./healthCareRegionPage.graphql');

const healthCareLocalFacilityPage = require('./healthCareLocalFacilityPage.graphql');
const healthCareRegionDetailPage = require('./healthCareRegionDetailPage.graphql');
const pressReleasePage = require('./pressReleasePage.graphql');
const vamcOperatingStatusAndAlerts = require('./vamcOperatingStatusAndAlerts.graphql');
const fragments = require('./fragments.graphql');
const newsStoryPage = require('./newStoryPage.graphql');
const sidebarQuery = require('./navigation-fragments/sidebar.nav.graphql');
const alertsQuery = require('./alerts.graphql');
const bannerAlertsQuery = require('./bannerAlerts.graphql');
const eventPage = require('./eventPage.graphql');
const facilitySidebarQuery = require('./navigation-fragments/facilitySidebar.nav.graphql');
const outreachSidebarQuery = require('./navigation-fragments/outreachSidebar.nav.graphql');
const icsFileQuery = require('./file-fragments/ics.file.graphql');
const outreachAssetsQuery = require('./file-fragments/outreachAssets.graphql');
const bioPage = require('./bioPage.graphql');
const benefitListingPage = require('./benefitListingPage.graphql');
const eventListingPage = require('./eventListingPage.graphql');
const storyListingPage = require('./storyListingPage.graphql');
const leadershipListingPage = require('./leadershipListingPage.graphql');
const pressReleasesListingPage = require('./pressReleasesListingPage.graphql');
const healthServicesListingPage = require('./healthServicesListingPage.graphql');
const locationListingPage = require('./locationsListingPage.graphql');
const homePageQuery = require('./homePage.graphql');
const allSideNavMachineNamesQuery = require('./navigation-fragments/allSideNavMachineNames.nav.graphql');
const menuLinksQuery = require('./navigation-fragments/menuLinks.nav.graphql');

// Get current feature flags
const { cmsFeatureFlags } = global;

// String Helpers
const {
  updateQueryString,
  queryParamToBeChanged,
} = require('./../../../../utilities/stringHelpers');

const officePage = require('./officePage.graphql');

let regString = '';
queryParamToBeChanged.forEach(param => {
  regString += `${param}|`;
});

const regex = new RegExp(`${regString}`, 'g');

const buildQuery = ({ useTomeSync }) => {
  let pageQueries = '';

  if (!useTomeSync) {
    pageQueries = Object.entries({
      landingPage,
      page,
      healthCareRegionPage,
      healthCareLocalFacilityPage,
      healthCareRegionDetailPage,
      pressReleasePage,
      vamcOperatingStatusAndAlerts,
      newsStoryPage,
      eventPage,
      officePage,
      bioPage,
      benefitListingPage,
      eventListingPage,
      storyListingPage,
      leadershipListingPage,
      pressReleasesListingPage,
      healthServicesListingPage,
      locationListingPage,
    })
      .map(([pageFragmentName, pageFragment]) => {
        return `

      ${pageFragment}

      query GetAllPages($onlyPublishedContent: Boolean!) {
        nodeQuery(limit: 2000, filter: {
          conditions: [
            { field: "status", value: ["1"], enabled: $onlyPublishedContent }
          ]
        }) {
          entities {
            ... ${pageFragmentName}
          }
        }
      }
    `;
      })
      .map(query => query.replace(regex, updateQueryString));
  }

  /**
   * Queries for all of the pages out of Drupal
   * To execute, run this query at http://staging.va.agile6.com/graphql/explorer.
   */
  const sitewideQuery = `
  query GetAllPages($onlyPublishedContent: Boolean!) {
    ${icsFileQuery}
    ${sidebarQuery}
    ${facilitySidebarQuery}
    ${outreachSidebarQuery}
    ${alertsQuery}
    ${bannerAlertsQuery}
    ${outreachAssetsQuery}
    ${homePageQuery}
    ${
      cmsFeatureFlags.FEATURE_ALL_HUB_SIDE_NAVS
        ? `${allSideNavMachineNamesQuery}`
        : ''
    }
    ${menuLinksQuery}
  }
`.replace(regex, updateQueryString);

  return {
    sitewideQuery,
    pageQueries,
  };
};

module.exports = buildQuery;
