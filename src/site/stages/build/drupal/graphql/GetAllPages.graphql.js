const landingPage = require('./landingPage.graphql');
const page = require('./page.graphql');
const healthCareRegionPage = require('./healthCareRegionPage.graphql');

const alertsQuery = require('./alerts.graphql');
const allSideNavMachineNamesQuery = require('./navigation-fragments/allSideNavMachineNames.nav.graphql');
const bannerAlertsQuery = require('./bannerAlerts.graphql');
const basicLandingPage = require('./nodeBasicLandingPage.graphql');
const benefitListingPage = require('./benefitListingPage.graphql');
const bioPage = require('./bioPage.graphql');
const nodeCampaignLandingPage = require('./nodeCampaignLandingPage.graphql');
const checklistPage = require('./nodeChecklist.graphql');
const eventListingPage = require('./eventListingPage.graphql');
const eventPage = require('./eventPage.graphql');
const facilitySidebarQuery = require('./navigation-fragments/facilitySidebar.nav.graphql');
const faqMultipleQaPage = require('./faqMultipleQa.graphql');
const { ALL_FRAGMENTS } = require('./fragments.graphql');
const healthCareLocalFacilityPage = require('./healthCareLocalFacilityPage.graphql');
const healthCareRegionDetailPage = require('./healthCareRegionDetailPage.graphql');
const healthServicesListingPage = require('./healthServicesListingPage.graphql');
const homePageQuery = require('./homePage.graphql');
const icsFileQuery = require('./file-fragments/ics.file.graphql');
const leadershipListingPage = require('./leadershipListingPage.graphql');
const locationListingPage = require('./locationsListingPage.graphql');
const mediaListImages = require('./nodeMediaListImages.graphql');
const mediaListVideos = require('./nodeMediaListVideos.graphql');
const menuLinksQuery = require('./navigation-fragments/menuLinks.nav.graphql');
const newsStoryPage = require('./newStoryPage.graphql');
const outreachAssetsQuery = require('./file-fragments/outreachAssets.graphql');
const outreachSidebarQuery = require('./navigation-fragments/outreachSidebar.nav.graphql');
const pressReleasePage = require('./pressReleasePage.graphql');
const pressReleasesListingPage = require('./pressReleasesListingPage.graphql');
const qaPage = require('./nodeQa.graphql');
const sidebarQuery = require('./navigation-fragments/sidebar.nav.graphql');
const stepByStepPage = require('./nodeStepByStep.graphql');
const storyListingPage = require('./storyListingPage.graphql');
const taxonomiesQuery = require('./taxonomy-fragments/GetTaxonomies.graphql');
const supportResourcesDetailPage = require('./nodeSupportResourcesDetailPage.graphql');
const vaFormPage = require('./vaFormPage.graphql');
const vamcOperatingStatusAndAlerts = require('./vamcOperatingStatusAndAlerts.graphql');

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
  const nodeContentFragments = useTomeSync
    ? ''
    : `
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
  ${officePage.fragment}
  ${bioPage.fragment}
  ${vaFormPage.fragment}
  ${benefitListingPage.fragment}
  ${eventListingPage.fragment}
  ${storyListingPage.fragment}
  ${leadershipListingPage.fragment}
  ${healthServicesListingPage.fragment}
  ${pressReleasesListingPage.fragment}
  ${locationListingPage.fragment}
  ${qaPage.fragment}
  ${faqMultipleQaPage.fragment}
  ${stepByStepPage.fragment}
  ${mediaListImages.fragment}
  ${checklistPage.fragment}
  ${mediaListVideos.fragment}
  ${supportResourcesDetailPage.fragment}
  ${basicLandingPage.fragment}
  ${nodeCampaignLandingPage.fragment}
`;

  const todayQueryVar = useTomeSync ? '' : '$today: String!,';

  const nodeQuery = useTomeSync
    ? ''
    : `
    nodeQuery(limit: 5000, filter: {
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
        ... vamcOperatingStatusAndAlerts
        ... newsStoryPage
        ... eventPage
        ... officePage
        ... bioPage
        ... benefitListingPage
        ... eventListingPage
        ... storyListingPage
        ... leadershipListingPage
        ... pressReleasesListingPage
        ... healthServicesListingPage
        ... locationListingPage
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
    }`;

  /**
   * Queries for all of the pages out of Drupal
   * To execute, run this query at http://staging.va.agile6.com/graphql/explorer.
   */
  const query = `

  ${nodeContentFragments}

  query GetAllPages(${todayQueryVar} $onlyPublishedContent: Boolean!) {
    ${nodeQuery}
    ${icsFileQuery.partialQuery}
    ${sidebarQuery.partialQuery}
    ${facilitySidebarQuery.partialQuery}
    ${outreachSidebarQuery.partialQuery}
    ${alertsQuery.partialQuery}
    ${bannerAlertsQuery.partialQuery}
    ${outreachAssetsQuery.partialQuery}
    ${homePageQuery.partialQuery}
    ${
      cmsFeatureFlags.FEATURE_ALL_HUB_SIDE_NAVS
        ? `${allSideNavMachineNamesQuery.partialQuery}`
        : ''
    }
    ${menuLinksQuery.partialQuery}
    ${taxonomiesQuery.partialQuery}
  }
`;

  return query.replace(regex, updateQueryString);
};

module.exports = buildQuery;
