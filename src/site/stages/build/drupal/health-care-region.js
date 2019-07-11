/* eslint-disable no-param-reassign, no-continue */
const {
  createEntityUrlObj,
  createFileObj,
  paginatePages,
  updateEntityUrlObj,
  generateBreadCrumbs,
} = require('./page');

// Creates the facility pages
function createHealthCareRegionListPages(page, drupalPagePath, files) {
  const sidebar = page.facilitySidebar;

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

  // Create A-Z Services Page
  const hsEntityUrl = createEntityUrlObj(drupalPagePath);
  const hsObj = {
    socialProgramsPatientFamilyServices:
      page.socialProgramsPatientFamilyServices,
    healthWellnessPatientFamilyServices:
      page.healthWellnessPatientFamilyServices,
    specialtyCareHealthServices: page.specialtyCareHealthServices,
    primaryCareHealthServices: page.primaryCareHealthServices,
    mentalHealthServices: page.mentalHealthServices,
    featuredHealthServices: page.featuredHealthServices,
    extendedCareHealthServices: page.extendedCareHealthServices,
    homelessHealthServices: page.homelessHealthServices,
    genomicMedicineHealthServices: page.genomicMedicineHealthServices,
    veteranCareHealthServices: page.veteranCareHealthServices,
    otherHealthServices: page.otherHealthServices,
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

module.exports = createHealthCareRegionListPages;
