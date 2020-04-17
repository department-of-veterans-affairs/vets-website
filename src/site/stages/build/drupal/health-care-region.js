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

// Creates the past-events listing pages
function createPastEventListPages(page, drupalPagePath, files) {
  const sidebar = page.facilitySidebar;
  // Events listing page
  const allEvents = page.pastEvents;

  // store past & current events
  const pastEventTeasers = {
    entities: [],
  };

  // separate current events from past events;
  allEvents.entities.forEach(eventTeaser => {
    const startDate = eventTeaser.fieldDate.startDate;
    const isPast = moment().diff(startDate, 'days');
    if (isPast >= 1) {
      pastEventTeasers.entities.push(eventTeaser);
    }
  });

  // sort past events into reverse chronological order by start date
  pastEventTeasers.entities = _.orderBy(
    pastEventTeasers.entities,
    ['fieldDate.startDate'],
    ['desc'],
  );

  // Past Events listing page
  const pastEventsEntityUrl = createEntityUrlObj(drupalPagePath);

  const pastEventsObj = {
    allEventTeasers: pastEventTeasers,
    eventTeasers: pastEventTeasers,
    fieldIntroText: page.fieldIntroText,
    facilitySidebar: sidebar,
    entityUrl: pastEventsEntityUrl,
    title: page.title,
    alert: page.alert,
  };
  const pastEventsPage = updateEntityUrlObj(
    pastEventsObj,
    drupalPagePath,
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
  if (page.fieldClinicalHealthServices) {
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
  const regionPage = pages.find(
    p =>
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
 * Sorts items from oldest to newest, removing expired items.
 *
 * @param {items} array The items array.
 * @param {field} string The target date field.
 * @param {reverse} bool Sorting order set to default false.
 * @param {stale} bool Remove expired date items set to default false.
 * @return Filtered array of sorted items.
 */
function itemSorter(items = [], field, reverse = false, stale = true) {
  let sorted = items.entities.sort((a, b) => {
    const start1 = moment(a[field].value);
    const start2 = moment(b[field].value);
    return reverse ? start2 - start1 : start1 - start2;
  });

  if (stale) {
    sorted = sorted.filter(item => moment(item[field].value).isAfter(moment()));
  }

  return sorted;
}
/**
 * Add pagers to cms content listing pages.
 *
 * @param {page} page The page object.
 * @param {files} files The generated file.
 * @param {field} field The target field.
 * @param {template} template The template for output formatting.
 * @param {files} files The acessibility aria.
 * @return nothing
 */
function addPager(page, files, field, template, aria) {
  // Sort events and remove stale items.
  if (page.allEventTeasers) {
    page.allEventTeasers.entities = itemSorter(
      page.allEventTeasers,
      'fieldDate',
    );
  }
  // Sort news teasers.
  if (page.allPressReleaseTeasers) {
    page.allPressReleaseTeasers.entities = itemSorter(
      page.allPressReleaseTeasers,
      'fieldReleaseDate',
      true,
      false,
    );
  }
  // Add our pager to page output.
  const pagingObject = paginatePages(page, files, field, template, aria);

  if (pagingObject[0]) {
    page.pagedItems = pagingObject[0].pagedItems;
    page.paginator = pagingObject[0].paginator;
  }
}

module.exports = {
  createHealthCareRegionListPages,
  createPastEventListPages,
  addGetUpdatesFields,
  addPager,
  sortServices,
};
