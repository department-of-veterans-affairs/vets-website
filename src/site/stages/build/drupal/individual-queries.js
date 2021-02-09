const { NodePageSlices } = require('./graphql/page.graphql');
const { GetNodeLandingPages } = require('./graphql/landingPage.graphql');
const { VaFormQuerySlices } = require('./graphql/vaFormPage.graphql');

const { NodePersonProfilesSlices } = require('./graphql/bioPage.graphql');

const {
  NodeHealthCareRegionPageSlices,
} = require('./graphql/healthCareRegionPage.graphql');

const { GetNodeOffices } = require('./graphql/officePage.graphql');

const {
  NodeHealthCareLocalFacilityPageSlices,
} = require('./graphql/healthCareLocalFacilityPage.graphql');

const {
  NodeHealthServicesListingPageSlices,
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

const { NodeEventQuerySlices } = require('./graphql/eventPage.graphql');

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
  HealthCareRegionDetailPageSlices,
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
  ...NodePageSlices,
  GetNodeLandingPages,
  ...VaFormQuerySlices,
  ...NodeHealthCareRegionPageSlices,
  ...NodePersonProfilesSlices,
  GetNodeOffices,
  ...NodeHealthCareLocalFacilityPageSlices,
  ...NodeHealthServicesListingPageSlices,
  GetNodeNewsStoryPages,
  GetNodePressReleasePages,
  GetNodePressReleaseListingPages,
  GetNodeEventListingPage,
  ...NodeEventQuerySlices,
  GetNodeStoryListingPages,
  GetNodeLocationsListingPages,
  GetNodeLeadershipListingPages,
  GetNodeVamcOperatingStatusAndAlerts,
  GetNodePublicationListingPages,
  ...HealthCareRegionDetailPageSlices,
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

  const { GetIcsFiles } = require('./graphql/file-fragments/ics.file.graphql');

  const {
    GetSidebars,
  } = require('./graphql/navigation-fragments/sidebar.nav.graphql');

  const {
    VaFacilitySidebars,
  } = require('./graphql/navigation-fragments/facilitySidebar.nav.graphql');

  const {
    GetOutreachSidebar,
  } = require('./graphql/navigation-fragments/outreachSidebar.nav.graphql');

  const { GetAlerts } = require('./graphql/alerts.graphql');
  const { GetBannnerAlerts } = require('./graphql/bannerAlerts.graphql');
  const {
    GetOutreachAssets,
  } = require('./graphql/file-fragments/outreachAssets.graphql');
  const { GetHomepage } = require('./graphql/homePage.graphql');
  const {
    GetMenuLinks,
  } = require('./graphql/navigation-fragments/menuLinks.nav.graphql');
  const {
    GetTaxonomies,
  } = require('./graphql/taxonomy-fragments/GetTaxonomies.graphql');

  const componentQueries = {
    GetIcsFiles,
    GetSidebars,
    ...VaFacilitySidebars,
    GetOutreachSidebar,
    GetAlerts,
    GetBannnerAlerts,
    GetOutreachAssets,
    GetHomepage,
    GetMenuLinks,
    GetTaxonomies,
  };

  if (cmsFeatureFlags.FEATURE_ALL_HUB_SIDE_NAVS) {
    const {
      GetAllSideNavMachineNames,
    } = require('./graphql/navigation-fragments/allSideNavMachineNames.nav.graphql');

    componentQueries.GetAllSideNavMachineNames = GetAllSideNavMachineNames;
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
  getIndividualizedQueries,
};
