/* eslint-disable no-param-reassign, no-continue */
const {
  createEntityUrlObj,
  createFileObj,
  paginatePages,
  updateEntityUrlObj,
  generateBreadCrumbs,
} = require('./page');

const _ = require('lodash');
const moment = require('moment');

/**
 * Sort services.
 *
 * @param sortItem The services array.
 * @return []
 */
function sortServices(sortItem) {
  return _(sortItem)
    .sortBy('fieldServiceNameAndDescripti.entity.weight')
    .sortBy('fieldServiceNameAndDescripti.entity.parent[0].entity.weight')
    .groupBy('fieldServiceNameAndDescripti.entity.parent[0].entity.name')
    .value();
}

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
  if (page.fieldClinicalHealthServices && page.fieldClinicalHealthServices) {
    const clinicalHealthServices = sortServices(
      page.fieldClinicalHealthServices.entities,
    );

    const hsEntityUrl = createEntityUrlObj(drupalPagePath);
    const hsObj = {
      fieldClinicalHealthServi: page.fieldClinicalHealthCareServi,
      featuredContentHealthServices: page.fieldFeaturedContentHealthser,
      facilitySidebar: sidebar,
      entityUrl: hsEntityUrl,
      alert: page.alert,
      title: page.title,
      regionNickname: page.fieldNicknameForThisFacility,
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
  }

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
  const prPage = updateEntityUrlObj(prObj, drupalPagePath, 'News Releases');
  const prPath = prPage.entityUrl.path;
  prPage.regionOrOffice = page.title;
  prPage.entityUrl = generateBreadCrumbs(prPath);

  paginatePages(
    prPage,
    files,
    'allPressReleaseTeasers',
    'press_releases_page.drupal.liquid',
    'news releases',
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
  const allEvents = page.allEventTeasers;

  // store past & current events
  const pastEventTeasers = {
    entities: [],
  };
  const currentEventTeasers = {
    entities: [],
  };

  // separate current events from past events;
  _.forEach(allEvents.entities, value => {
    const eventTeaser = value;
    const startDate = eventTeaser.fieldDate.startDate;
    const isPast = moment().diff(startDate, 'days');
    if (isPast >= 1) {
      pastEventTeasers.entities.push(eventTeaser);
    } else {
      currentEventTeasers.entities.push(eventTeaser);
    }
  });

  // sort past events into reverse chronological order by start date
  pastEventTeasers.entities = _.orderBy(
    pastEventTeasers.entities,
    ['fieldDate.startDate'],
    ['asc'],
  );

  const eventEntityUrl = createEntityUrlObj(drupalPagePath);
  const eventObj = Object.assign(
    { allEventTeasers: currentEventTeasers },
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
    'event_listing.drupal.liquid',
    'events',
  );

  // Past Events listing page
  const pastEventsEntityUrl = createEntityUrlObj(`${drupalPagePath}/events`);

  const pastEventsObj = Object.assign(
    { allEventTeasers: pastEventTeasers },
    { eventTeasers: page.eventTeasers },
    { fieldIntroTextEventsPage: page.fieldIntroTextEventsPage },
    { facilitySidebar: sidebar },
    { entityUrl: pastEventsEntityUrl },
    { title: page.title },
    { alert: page.alert },
  );
  const pastEventsPage = updateEntityUrlObj(
    pastEventsObj,
    `${drupalPagePath}/events`,
    'Past events',
  );
  const pastEventsPagePath = pastEventsPage.entityUrl.path;
  pastEventsPage.regionOrOffice = page.title;
  pastEventsPage.entityUrl = generateBreadCrumbs(pastEventsPagePath);

  paginatePages(
    pastEventsPage,
    files,
    'allEventTeasers',
    'event_listing.drupal.liquid',
    'past-events',
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
    'leadership_listing.drupal.liquid',
    'bio',
  );
}

/**
 * Modify the page object to add social links.
 *
 * @param {page} page The page object.
 * @param {pages} pages an array of page of objects containing a region page
 * @return nothing
 */
function addGetUpdatesFields(page, pages) {
  const regionPage = pages.find(p =>
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

/**
 * Modify the list pages.
 *
 * @param {page} page The page object.
 * @param {pages} pages an array of page of objects containing a page
 * @return nothing
 */
function modListPages(page, pages, files, field, template, aria) {
  switch (page.entityBundle) {
    case 'event_listing':
      page.allEventTeasers = page.fieldOffice.entity.reverseFieldOfficeNode
        .entities.length
        ? page.fieldOffice.entity.reverseFieldOfficeNode
        : page.reverseFieldOfficeNode;
      break;
    case 'story_listing':
      page.allNewsStoryTeasers = page.fieldOffice.entity.reverseFieldOfficeNode;
      break;
    case 'press_releases_listing':
      page.allPressReleaseTeasers =
        page.fieldOffice.entity.reverseFieldOfficeNode;
      break;
    case 'health_services_listing':
      page.clinicalHealthServices = sortServices(
        page.fieldOffice.entity.reverseFieldRegionPageNode.entities,
      );
      break;
    case 'leadership_listing':
      page.allStaffProfiles = page.fieldLeadership;
      break;
    default:
  }
  // Add our pager to the Drupal page.
  if (page.entityBundle !== 'health_services_listing') {
    const pagingObject = paginatePages(page, files, field, template, aria);
    if (pagingObject[0]) {
      page.pagedItems = pagingObject[0].pagedItems;
      page.paginator = pagingObject[0].paginator;
    }
  }
}

module.exports = {
  createHealthCareRegionListPages,
  addGetUpdatesFields,
  modListPages,
};
