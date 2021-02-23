const landingPage = require('./landingPage.graphql');
const page = require('./page.graphql');
const { ALL_FRAGMENTS } = require('./fragments.graphql');
const healthCareRegionPage = require('./healthCareRegionPage.graphql');

const alertsQuery = require('./alerts.graphql');
const allSideNavMachineNamesQuery = require('./navigation-fragments/allSideNavMachineNames.nav.graphql');
const bannerAlertsQuery = require('./bannerAlerts.graphql');
const bioPage = require('./bioPage.graphql');
const eventPage = require('./eventPage.graphql');
const facilitySidebarQuery = require('./navigation-fragments/facilitySidebar.nav.graphql');
const faqMultipleQa = require('./faqMultipleQa.graphql');
const healthCareLocalFacilityPage = require('./healthCareLocalFacilityPage.graphql');
const healthCareRegionDetailPage = require('./healthCareRegionDetailPage.graphql');
const icsFileQuery = require('./file-fragments/ics.file.graphql');
const menuLinksQuery = require('./navigation-fragments/menuLinks.nav.graphql');
const newsStoryPage = require('./newStoryPage.graphql');
const nodeBasicLandingPage = require('./nodeBasicLandingPage.graphql');
const nodeCampaignLandingPage = require('./nodeCampaignLandingPage.graphql');
const nodeChecklist = require('./nodeChecklist.graphql');
const nodeMediaListImages = require('./nodeMediaListImages.graphql');
const nodeMediaListVideos = require('./nodeMediaListVideos.graphql');
const nodeQa = require('./nodeQa.graphql');
const nodeStepByStep = require('./nodeStepByStep.graphql');
const nodeSupportResourcesDetailPage = require('./nodeSupportResourcesDetailPage.graphql');
const pressReleasePage = require('./pressReleasePage.graphql');
const sidebarQuery = require('./navigation-fragments/sidebar.nav.graphql');
const taxonomiesQuery = require('./taxonomy-fragments/GetTaxonomies.graphql');
const vaFormPage = require('./vaFormPage.graphql');
const vamcOperatingStatusAndAlerts = require('./vamcOperatingStatusAndAlerts.graphql');

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

  ${ALL_FRAGMENTS}
  ${landingPage.fragment}
  ${page.fragment}
  ${healthCareRegionPage.fragment}
  ${healthCareLocalFacilityPage.fragment}
  ${healthCareRegionDetailPage.fragment}
  ${pressReleasePage.fragment}
  ${vamcOperatingStatusAndAlerts.fragment}
  ${newsStoryPage.fragment}
  ${eventPage.fragment}
  ${bioPage.fragment}
  ${vaFormPage.fragment}
  ${nodeQa.fragment}
  ${faqMultipleQa.fragment}
  ${nodeStepByStep.fragment}
  ${nodeMediaListImages.fragment}
  ${nodeChecklist.fragment}
  ${nodeMediaListVideos.fragment}
  ${nodeSupportResourcesDetailPage.fragment}
  ${nodeBasicLandingPage.fragment}
  ${nodeCampaignLandingPage.fragment}

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
        ... nodeQa
        ... faqMultipleQA
        ... nodeStepByStep
        ... nodeMediaListImages
        ... nodeChecklist
        ... nodeMediaListVideos
        ... nodeSupportResourcesDetailPage
        ... nodeBasicLandingPage
        ... nodeCampaignLandingPage
      }
    }
    ${icsFileQuery.partialQuery}
    ${sidebarQuery.partialQuery}
    ${facilitySidebarQuery.partialQuery}
    ${alertsQuery.partialQuery}
    ${bannerAlertsQuery.partialQuery}
    ${
      cmsFeatureFlags.FEATURE_ALL_HUB_SIDE_NAVS
        ? `${allSideNavMachineNamesQuery.partialQuery}`
        : ''
    }
    ${menuLinksQuery.partialQuery}
    ${taxonomiesQuery.partialQuery}
  }
`;

const query = module.exports;

let regString = '';
queryParamToBeChanged.forEach(param => {
  regString += `${param}|`;
});

const regex = new RegExp(`${regString}`, 'g');
module.exports = query.replace(regex, updateQueryString);
