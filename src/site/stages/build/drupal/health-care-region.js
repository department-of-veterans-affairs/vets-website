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
    const startDate = eventTeaser.fieldDatetimeRangeTimezone.value;

    // Check if the date is in the past
    const startDateUTC = startDate;
    const currentDateUTC = new Date().getTime() / 1000;

    if (startDateUTC < currentDateUTC) {
      pastEventTeasers.entities.push(eventTeaser);
    }
  });

  // sort past events into reverse chronological order by start date
  pastEventTeasers.entities = _.orderBy(
    pastEventTeasers.entities,
    ['fieldDatetimeRangeTimezone.value'],
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
}

/**
 * Modify the page object to add social links.
 *
 * @param {page} page The page object.
 * @param {pages} pages an array of page of objects containing a region page
 * @return nothing
 */
function addGetUpdatesFields(page, pages) {
  const regionPageUrlPath = page.entityUrl.breadcrumb[1]?.url?.path;

  if (!regionPageUrlPath) {
    throw new Error(
      `CMS error while building breadcrumbs: "${
        page.entityUrl.path
      }" is missing reference to a parent or grandparent.`,
    );
  }

  const regionPage = pages.find(p => p.entityUrl.path === regionPageUrlPath);

  if (regionPage) {
    page.fieldLinks = regionPage.fieldLinks;
  }
}

/**
 * Sorts release dates (fieldReleaseDate) from oldest to newest, removing expired items.
 *
 * @param {releaseDates} array The dates array.
 * @param {reverse} bool Sorting order set to default false.
 * @param {stale} bool Remove expired date items set to default false.
 * @return Filtered array of sorted items.
 */
function releaseDateSorter(legacyDates = [], reverse = false, stale = true) {
  let sorted = legacyDates.entities.sort((a, b) => {
    const start1 = moment(a.fieldReleaseDate.value);
    const start2 = moment(b.fieldReleaseDate.value);
    return reverse ? start2 - start1 : start1 - start2;
  });

  if (stale) {
    sorted = sorted.filter(item =>
      moment(item.fieldReleaseDate.value).isAfter(moment()),
    );
  }

  return sorted;
}

/**
 * Sorts event dates (fieldDatetimeRangeTimezone) from oldest to newest, removing expired items.
 *
 * @param {dates} array The dates array.
 * @param {reverse} bool Sorting order set to default false.
 * @param {stale} bool Remove expired date items set to default false.
 * @return Filtered array of sorted items.
 */
function eventDateSorter(dates = [], reverse = false, stale = true) {
  let sorted = dates.entities.sort((a, b) => {
    const start1 = a.fieldDatetimeRangeTimezone.value;
    const start2 = b.fieldDatetimeRangeTimezone.value;
    return reverse ? start2 - start1 : start1 - start2;
  });

  const currentDateUTC = new Date().getTime() / 1000;

  if (stale) {
    sorted = sorted.filter(
      item => item.fieldDatetimeRangeTimezone.value > currentDateUTC,
    );
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
    page.allEventTeasers.entities = eventDateSorter(page.allEventTeasers);
  }

  // Sort news teasers.
  if (page.allPressReleaseTeasers) {
    page.allPressReleaseTeasers.entities = releaseDateSorter(
      page.allPressReleaseTeasers,
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
