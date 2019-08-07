/* eslint-disable no-param-reassign, no-continue */
const {
  createEntityUrlObj,
  createFileObj,
  paginatePages,
  updateEntityUrlObj,
  generateBreadCrumbs,
} = require('./page');

const _ = require('lodash');

// Creates the facility pages
function createHealthCareRegionListPages(page, drupalPagePath, files) {
  const sidebar = page.facilitySidebar;

  // Create the top-level facilities status page for Health Care Regions
  const statusEntityUrl = createEntityUrlObj(drupalPagePath);
  const statusObj = {
    mainFacilities: page.reverseFieldRegionPageNode,
    facilitySidebar: sidebar,
    entityUrl: statusEntityUrl,
    alert: page.alert,
    title: page.title,
  };

  const statusPage = updateEntityUrlObj(
    statusObj,
    drupalPagePath,
    'Operating status',
  );
  const statusPath = statusPage.entityUrl.path;
  statusPage.regionOrOffice = page.title;
  statusPage.entityUrl = generateBreadCrumbs(statusPath);

  files[`${drupalPagePath}/status/index.html`] = createFileObj(
    statusPage,
    'health_care_facility_status.drupal.liquid',
  );

  // Create the top-level locations page for Health Care Regions
  const locEntityUrl = createEntityUrlObj(drupalPagePath);
  const locObj = {
    mainFacilities: page.mainFacilities,
    otherFacilities: page.otherFacilities,
    fieldOtherVaLocations: page.fieldOtherVaLocations,
    fieldLocationsIntroBlurb: page.fieldLocationsIntroBlurb,
    facilitySidebar: sidebar,
    entityUrl: locEntityUrl,
    alert: page.alert,
    title: page.title,
  };
  const locPage = updateEntityUrlObj(locObj, drupalPagePath, 'Locations');
  const locPath = locPage.entityUrl.path;
  locPage.regionOrOffice = page.title;
  locPage.entityUrl = generateBreadCrumbs(locPath);

  files[`${drupalPagePath}/locations/index.html`] = createFileObj(
    locPage,
    'health_care_region_locations_page.drupal.liquid',
  );

  // Create "A-Z Services" || "Our health services" Page
  // sort and group health services by their weight in drupal
  const clinicalHealthServices = _(page.fieldClinicalHealthServices.entities)
    .sortBy('fieldServiceNameAndDescripti.entity.weight')
    .sortBy('fieldServiceNameAndDescripti.entity.parent[0].entity.weight')
    .groupBy('fieldServiceNameAndDescripti.entity.parent[0].entity.name')
    .value();

  const hsEntityUrl = createEntityUrlObj(drupalPagePath);
  const hsObj = {
    fieldClinicalHealthServi: page.fieldClinicalHealthCareServi,
    featuredContentHealthServices: page.fieldFeaturedContentHealthser,
    facilitySidebar: sidebar,
    entityUrl: hsEntityUrl,
    alert: page.alert,
    title: page.title,
    clinicalHealthServices,
  };
  const hsPage = updateEntityUrlObj(
    hsObj,
    drupalPagePath,
    'Patient and health services',
    'health-services',
  );
  const hsPath = hsPage.entityUrl.path;
  hsPage.regionOrOffice = page.title;
  hsPage.entityUrl = generateBreadCrumbs(hsPath);

  files[`${drupalPagePath}/health-services/index.html`] = createFileObj(
    hsPage,
    'health_care_region_health_services_page.drupal.liquid',
  );

  // Press Release listing page
  const prEntityUrl = createEntityUrlObj(drupalPagePath);
  const prObj = {
    allPressReleaseTeasers: page.allPressReleaseTeasers,
    fieldPressReleaseBlurb: page.fieldPressReleaseBlurb,
    facilitySidebar: sidebar,
    entityUrl: prEntityUrl,
    title: page.title,
    alert: page.alert,
  };
  const prPage = updateEntityUrlObj(prObj, drupalPagePath, 'Press Releases');
  const prPath = prPage.entityUrl.path;
  prPage.regionOrOffice = page.title;
  prPage.entityUrl = generateBreadCrumbs(prPath);

  paginatePages(
    prPage,
    files,
    'allPressReleaseTeasers',
    'press_releases_page.drupal.liquid',
    'press releases',
  );

  // News Story listing page
  const nsEntityUrl = createEntityUrlObj(drupalPagePath);
  const nsObj = {
    allNewsStoryTeasers: page.allNewsStoryTeasers,
    newsStoryTeasers: page.newsStoryTeasers,
    fieldIntroTextNewsStories: page.fieldIntroTextNewsStories,
    facilitySidebar: sidebar,
    entityUrl: nsEntityUrl,
    title: page.title,
    alert: page.alert,
  };
  const nsPage = updateEntityUrlObj(
    nsObj,
    drupalPagePath,
    'Community stories',
    'stories',
  );
  const nsPath = nsPage.entityUrl.path;
  nsPage.regionOrOffice = page.title;
  nsPage.entityUrl = generateBreadCrumbs(nsPath);

  paginatePages(
    nsPage,
    files,
    'allNewsStoryTeasers',
    'news_stories_page.drupal.liquid',
    'news stories',
  );

  // Events listing page
  const eventEntityUrl = createEntityUrlObj(drupalPagePath);
  const eventObj = Object.assign(
    { allEventTeasers: page.allEventTeasers },
    { eventTeasers: page.eventTeasers },
    { fieldIntroTextEventsPage: page.fieldIntroTextEventsPage },
    { facilitySidebar: sidebar },
    { entityUrl: eventEntityUrl },
    { title: page.title },
    { alert: page.alert },
  );
  const eventPage = updateEntityUrlObj(eventObj, drupalPagePath, 'Events');
  const eventPagePath = eventPage.entityUrl.path;
  eventPage.regionOrOffice = page.title;
  eventPage.entityUrl = generateBreadCrumbs(eventPagePath);

  paginatePages(
    eventPage,
    files,
    'allEventTeasers',
    'events_page.drupal.liquid',
    'events',
  );

  // Staff bio listing page
  const bioEntityUrl = createEntityUrlObj(drupalPagePath);
  page.allStaffProfiles = {
    entities: [...page.fieldLeadership],
  };
  const bioObj = {
    allStaffProfiles: page.allStaffProfiles,
    facilitySidebar: sidebar,
    entityUrl: bioEntityUrl,
    title: page.title,
    alert: page.alert,
  };
  const bioListingPage = updateEntityUrlObj(
    bioObj,
    drupalPagePath,
    'Leadership',
  );
  const bioPagePath = bioListingPage.entityUrl.path;
  bioListingPage.regionOrOffice = page.title;
  bioListingPage.entityUrl = generateBreadCrumbs(bioPagePath);

  paginatePages(
    bioListingPage,
    files,
    'allStaffProfiles',
    'bios_page.drupal.liquid',
    'bio',
  );
}

// Adds the social media links and email subscription links
// for local facility page and region detail page entity types from their respective region page
function addGetUpdatesFields(page, pages) {
  const regionPage = pages.find(
    p =>
      // Finds the region page based on the second link url
      // If the url matches the region page's entityUrl.path, it is the base region page for this page
      // Note: this is done this way because a NodeHealthCareRegionDetailPage has no association field to a NodeHealthCareRegionPage
      p.entityUrl
        ? p.entityUrl.path === page.entityUrl.breadcrumb[1].url.path
        : false,
  );

  if (regionPage) {
    page.fieldFacebook = regionPage.fieldFacebook;
    page.fieldTwitter = regionPage.fieldTwitter;
    page.fieldFlickr = regionPage.fieldFlickr;
    page.fieldInstagram = regionPage.fieldInstagram;
    page.fieldLinks = regionPage.fieldLinks;
  }
}

module.exports = { createHealthCareRegionListPages, addGetUpdatesFields };
