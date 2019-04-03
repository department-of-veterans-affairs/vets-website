/* eslint-disable no-param-reassign, no-continue */
const {
  createEntityUrlObj,
  createFileObj,
  paginatePages,
  updateEntityUrlObj,
} = require('./page');

// Creates the facility pages
function createHealthCareRegionListPages(page, drupalPagePath, files) {
  const sidebar = { facilitySidebar: page.facilitySidebar };

  // Create the top-level locations page for Health Care Regions
  const locEntityUrl = createEntityUrlObj(drupalPagePath);
  const locObj = {
    mainFacilities: page.mainFacilities,
    otherFacilities: page.otherFacilities,
    fieldLocationsIntroBlurb: page.fieldLocationsIntroBlurb,
    facilitySidebar: sidebar,
    entityUrl: locEntityUrl,
    alert: page.alert,
    title: page.title,
  };
  const locPage = updateEntityUrlObj(locObj, drupalPagePath, 'Locations');
  locPage.regionOrOffice = page.title;

  files[`${drupalPagePath}/locations/index.html`] = createFileObj(
    locPage,
    'health_care_region_locations_page.drupal.liquid',
  );

  // Create A-Z Services Page
  const hsEntityUrl = createEntityUrlObj(drupalPagePath);
  const hsObj = {
    careCoordinatorPatientFamilyServices:
      page.careCoordinatorPatientFamilyServices,
    socialProgramsPatientFamilyServices:
      page.socialProgramsPatientFamilyServices,
    healthWellnessPatientFamilyServices:
      page.healthWellnessPatientFamilyServices,
    specialtyCareHealthServices: page.specialtyCareHealthServices,
    primaryCareHealthServices: page.primaryCareHealthServices,
    mentalHealthServices: page.mentalHealthServices,
    fieldClinicalHealthServi: page.fieldClinicalHealthCareServi,
    facilitySidebar: sidebar,
    entityUrl: hsEntityUrl,
    alert: page.alert,
    title: page.title,
  };
  const hsPage = updateEntityUrlObj(
    hsObj,
    drupalPagePath,
    'Patient and health services',
    'health-services',
  );
  hsPage.regionOrOffice = page.title;

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
  prPage.regionOrOffice = page.title;

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
  nsPage.regionOrOffice = page.title;

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
    { fieldIntroTextEventsPage: page.fieldIntroTextEventsPage },
    { facilitySidebar: sidebar },
    { entityUrl: eventEntityUrl },
    { title: page.title },
    { alert: page.alert },
  );
  const eventPage = updateEntityUrlObj(eventObj, drupalPagePath, 'Events');
  eventPage.regionOrOffice = page.title;

  paginatePages(
    eventPage,
    files,
    'allEventTeasers',
    'events_page.drupal.liquid',
    'events',
  );

  // Staff bio listing page
  const bioEntityUrl = createEntityUrlObj(drupalPagePath);
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
  bioListingPage.regionOrOffice = page.title;

  paginatePages(
    bioListingPage,
    files,
    'allStaffProfiles',
    'bios_page.drupal.liquid',
    'bio',
  );
}

module.exports = createHealthCareRegionListPages;
