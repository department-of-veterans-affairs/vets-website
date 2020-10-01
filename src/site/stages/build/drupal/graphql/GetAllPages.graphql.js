const landingPage = require('./landingPage.graphql');
const page = require('./page.graphql');
const healthCareRegionPage = require('./healthCareRegionPage.graphql');

const alertsQuery = require('./alerts.graphql');
const allSideNavMachineNamesQuery = require('./navigation-fragments/allSideNavMachineNames.nav.graphql');
const bannerAlertsQuery = require('./bannerAlerts.graphql');
const benefitListingPage = require('./benefitListingPage.graphql');
const bioPage = require('./bioPage.graphql');
const checklistPage = require('./nodeChecklist.graphql');
const eventListingPage = require('./eventListingPage.graphql');
const eventPage = require('./eventPage.graphql');
const facilitySidebarQuery = require('./navigation-fragments/facilitySidebar.nav.graphql');
const faqMultipleQaPage = require('./faqMultipleQa.graphql');
const fragments = require('./fragments.graphql');
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
  ${officePage}
  ${bioPage}
  ${vaFormPage}
  ${benefitListingPage}
  ${eventListingPage}
  ${storyListingPage}
  ${leadershipListingPage}
  ${healthServicesListingPage}
  ${pressReleasesListingPage}
  ${locationListingPage}
  ${qaPage}
  ${faqMultipleQaPage}
  ${stepByStepPage}
  ${mediaListImages}
  ${checklistPage}
  ${mediaListVideos}
`;

  const todayQueryVar = useTomeSync ? '' : '$today: String!,';

  const nodeQuery = useTomeSync
    ? ''
    : `
    nodeQuery(limit: 2000, filter: {
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
`;

  return query.replace(regex, updateQueryString);
};

module.exports = buildQuery;
