const queries = {
  GET_ALL_PAGES: './graphql/GetAllPages.graphql',
  GET_LATEST_PAGE_BY_ID: './graphql/GetLatestPageById.graphql',
};

function getQuery(query, { useTomeSync } = {}) {
  if (query === queries.GET_ALL_PAGES) {
    // eslint-disable-next-line import/no-dynamic-require
    return require(query)({ useTomeSync });
  }
  // eslint-disable-next-line import/no-dynamic-require
  return require(query);
}

const { GetNodePages } = require('./graphql/page.graphql');
const { GetNodeLandingPages } = require('./graphql/landingPage.graphql');
const { GetNodeVaForms } = require('./graphql/vaFormPage.graphql');
const { GetNodePersonProfiles } = require('./graphql/bioPage.graphql');

const {
  GetNodeHealthCareRegionPages,
} = require('./graphql/healthCareRegionPage.graphql');

const { GetNodeOffices } = require('./graphql/officePage.graphql');

const {
  GetNodeHealthCareLocalFacilityPages,
} = require('./graphql/healthCareLocalFacilityPage.graphql');

const {
  GetNodeHealthServicesListingPages,
} = require('./graphql/healthServicesListingPage.graphql');

const { GetNodeNewsStoryPages } = require('./graphql/newStoryPage.graphql');

const {
  GetNodePressReleasePages,
} = require('./graphql/pressReleasePage.graphql');

const {
  GetNodePressReleaseListingPages,
} = require('./graphql/pressReleasesListingPage.graphql');

const {
  GetNodeEventListingPage,
} = require('./graphql/eventListingPage.graphql');

const { GetNodeEventPages } = require('./graphql/eventPage.graphql');

const {
  GetNodeStoryListingPages,
} = require('./graphql/storyListingPage.graphql');

const {
  GetNodeLocationsListingPages,
} = require('./graphql/locationsListingPage.graphql');

const {
  GetNodeLeadershipListingPages,
} = require('./graphql/leadershipListingPage.graphql');

const {
  GetNodeVamcOperatingStatusAndAlerts,
} = require('./graphql/vamcOperatingStatusAndAlerts.graphql');

const {
  GetNodePublicationListingPages,
} = require('./graphql/benefitListingPage.graphql');

const {
  GetNodeHealthCareRegionDetailPage,
} = require('./graphql/healthCareRegionDetailPage.graphql');

const nodeQueries = {
  GetNodePages,
  GetNodeLandingPages,
  GetNodeVaForms,
  GetNodeHealthCareRegionPages,
  GetNodePersonProfiles,
  GetNodeOffices,
  GetNodeHealthCareLocalFacilityPages,
  GetNodeHealthServicesListingPages,
  GetNodeNewsStoryPages,
  GetNodePressReleasePages,
  GetNodePressReleaseListingPages,
  GetNodeEventListingPage,
  GetNodeEventPages,
  GetNodeStoryListingPages,
  GetNodeLocationsListingPages,
  GetNodeLeadershipListingPages,
  GetNodeVamcOperatingStatusAndAlerts,
  GetNodePublicationListingPages,
  GetNodeHealthCareRegionDetailPage,
};

function nonNodeQueries() {
  // Get current feature flags
  const { cmsFeatureFlags } = global;

  const componentQueries = {
    GetIcsFiles: require('./graphql/file-fragments/ics.file.graphql'),
    GetSidebars: require('./graphql/navigation-fragments/sidebar.nav.graphql'),
    GetFacilitySidebars: require('./graphql/navigation-fragments/facilitySidebar.nav.graphql'),
    GetOutreachSidebar: require('./graphql/navigation-fragments/outreachSidebar.nav.graphql'),
    GetAlerts: require('./graphql/alerts.graphql'),
    GetBannerAlerts: require('./graphql/bannerAlerts.graphql'),
    GetOutreachAssets: require('./graphql/file-fragments/outreachAssets.graphql'),
    GetHomepage: require('./graphql/homePage.graphql'),
    GetMenuLinks: require('./graphql/navigation-fragments/menuLinks.nav.graphql'),
    GetTaxonomies: require('./graphql/taxonomy-fragments/GetTaxonomies.graphql'),
  };

  if (cmsFeatureFlags.FEATURE_ALL_HUB_SIDE_NAVS) {
    componentQueries.GetAllSideNavMachineNames = require('./graphql/navigation-fragments/allSideNavMachineNames.nav.graphql');
  }

  return componentQueries;
}

function getIndividualizedQueries() {
  return {
    ...nodeQueries,
    ...nonNodeQueries(),
  };
}

module.exports = {
  getQuery,
  queries,
  getIndividualizedQueries,
};
