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

const individualQueries = {
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
};

module.exports = {
  getQuery,
  queries,
  individualQueries,
};
