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

const { GetNodeEventPages, GetArchivedNodeEventPages } = require('./graphql/eventPage.graphql');

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

const { GetNodeQa } = require('./graphql/nodeQa.graphql');
const { GetNodeMultipleQaPages } = require('./graphql/faqMultipleQa.graphql');
const { GetNodeStepByStep } = require('./graphql/nodeStepByStep.graphql');
const {
  GetNodeMediaListImages,
} = require('./graphql/nodeMediaListImages.graphql');
const { GetNodeChecklist } = require('./graphql/nodeChecklist.graphql');
const {
  GetNodeMediaListVideos,
} = require('./graphql/nodeMediaListVideos.graphql');

const {
  GetNodeSupportResourcesDetailPage,
} = require('./graphql/nodeSupportResourcesDetailPage.graphql');

const {
  GetNodeBasicLandingPage,
} = require('./graphql/nodeBasicLandingPage.graphql');

const {
  GetCampaignLandingPages,
} = require('./graphql/nodeCampaignLandingPage.graphql');

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
  GetArchivedNodeEventPages,
  GetNodeStoryListingPages,
  GetNodeLocationsListingPages,
  GetNodeLeadershipListingPages,
  GetNodeVamcOperatingStatusAndAlerts,
  GetNodePublicationListingPages,
  GetNodeHealthCareRegionDetailPage,
  GetNodeQa,
  GetNodeMultipleQaPages,
  GetNodeStepByStep,
  GetNodeMediaListImages,
  GetNodeChecklist,
  GetNodeMediaListVideos,
  GetNodeSupportResourcesDetailPage,
  GetNodeBasicLandingPage,
  GetCampaignLandingPages,
};

function nonNodeQueries() {
  // Get current feature flags
  const { cmsFeatureFlags } = global;

  const componentQueries = [
    require('./graphql/file-fragments/ics.file.graphql'),
    require('./graphql/navigation-fragments/sidebar.nav.graphql'),
    require('./graphql/navigation-fragments/facilitySidebar.nav.graphql'),
    require('./graphql/navigation-fragments/outreachSidebar.nav.graphql'),
    require('./graphql/alerts.graphql'),
    require('./graphql/bannerAlerts.graphql'),
    require('./graphql/file-fragments/outreachAssets.graphql'),
    require('./graphql/homePage.graphql'),
    require('./graphql/navigation-fragments/menuLinks.nav.graphql'),
    require('./graphql/taxonomy-fragments/GetTaxonomies.graphql'),
  ];

  if (cmsFeatureFlags.FEATURE_ALL_HUB_SIDE_NAVS) {
    componentQueries.push(
      require('./graphql/navigation-fragments/allSideNavMachineNames.nav.graphql'),
    );
  }

  // @todo - wrap each component like the nodes instead of doing a mono query
  const GetNonNodeWebsiteComponents = `
    query GetNonNodeWebsiteComponents($onlyPublishedContent: Boolean!) {
      ${componentQueries.join('\n')}
    }
  `;

  return { GetNonNodeWebsiteComponents };
}

function getIndividualizedQueries() {
  return {
    ...nodeQueries,
    ...nonNodeQueries(),
  };
}

module.exports = {
  getIndividualizedQueries,
};
