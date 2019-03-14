/* eslint-disable no-param-reassign, no-continue */
const facilityLocationPath = require('./utilities-drupal');
const {
  createEntityUrlObj,
  createFileObj,
  paginatePages,
  updateEntityUrlObj,
} = require('./page');

// Creates the facility pages
function createHealthCareRegionListPages(page, drupalPagePath, files) {
  const relatedLinks = { fieldRelatedLinks: page.fieldRelatedLinks };
  const sidebar = { facilitySidebar: page.facilitySidebar };
  const alerts = { alert: page.alert };

  // Create the detail page for health care local facilities
  if (page.mainFacilities !== undefined || page.otherFacilities !== undefined) {
    for (const facility of [
      ...page.mainFacilities.entities,
      ...page.otherFacilities.entities,
    ]) {
      if (facility.entityBundle === 'health_care_local_facility') {
        const pagePath = facilityLocationPath(
          drupalPagePath,
          facility.fieldFacilityLocatorApiId,
          facility.fieldNicknameForThisFacility,
        );

        const facilityCompiled = Object.assign(
          facility,
          relatedLinks,
          sidebar,
          alerts,
        );

        files[`drupal${pagePath}/index.html`] = createFileObj(
          facilityCompiled,
          'health_care_local_facility_page.drupal.liquid',
        );
      }
    }
  }

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
  files[`drupal${drupalPagePath}/locations/index.html`] = createFileObj(
    locPage,
    'health_care_region_locations_page.drupal.liquid',
  );

  // Create Health Services Page
  const hsEntityUrl = createEntityUrlObj(drupalPagePath);
  const hsObj = {
    specialtyCareHealthServices: page.specialtyCareHealthServices,
    primaryCareHealthServices: page.primaryCareHealthServices,
    mentalHealthServices: page.mentalHealthServices,
    fieldClinicalHealthServi: page.fieldClinicalHealthCareServi,
    facilitySidebar: sidebar,
    entityUrl: hsEntityUrl,
    alert: page.alert,
    title: page.title,
  };
  const hsPage = updateEntityUrlObj(hsObj, drupalPagePath, 'Health Services');
  files[`drupal${drupalPagePath}/health-services/index.html`] = createFileObj(
    hsPage,
    'health_care_region_health_services_page.drupal.liquid',
  );

  // Create the patient and family services page
  const fsEntityUrl = createEntityUrlObj(drupalPagePath);
  const fsObj = {
    careCoordinatorPatientFamilyServices:
      page.careCoordinatorPatientFamilyServices,
    socialProgramsPatientFamilyServices:
      page.socialProgramsPatientFamilyServices,
    healthWellnessPatientFamilyServices:
      page.healthWellnessPatientFamilyServices,
    fieldPatientFamilyServicesIn: page.fieldPatientFamilyServicesIn,
    facilitySidebar: sidebar,
    entityUrl: fsEntityUrl,
    alert: page.alert,
    title: page.title,
  };
  const fsPage = updateEntityUrlObj(
    fsObj,
    drupalPagePath,
    'Patient & Family Services',
  );
  files[
    `drupal${drupalPagePath}/patient-family-services/index.html`
  ] = createFileObj(
    fsPage,
    'health_care_region_patient_family_services_page.drupal.liquid',
  );

  // Press Release listing page
  const prEntityUrl = createEntityUrlObj(drupalPagePath);
  const prObj = {
    allPressReleaseTeasers: page.allPressReleaseTeasers,
    facilitySidebar: sidebar,
    entityUrl: prEntityUrl,
    title: page.title,
    alert: page.alert,
  };
  const prPage = updateEntityUrlObj(prObj, drupalPagePath, 'Press Releases');
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
  paginatePages(
    bioListingPage,
    files,
    'allStaffProfiles',
    'bios_page.drupal.liquid',
    'bio',
  );
}

module.exports = createHealthCareRegionListPages;
