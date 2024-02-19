import * as Sentry from '@sentry/browser';
import { isArray } from 'lodash';
import recordEvent from '~/platform/monitoring/record-event';
import { apiRequest } from '~/platform/utilities/api';
import { replaceWithStagingDomain } from '~/platform/utilities/environment/stagingDomains';

export const hideDesktopHeader = () => {
  const desktopHeader = document.getElementById('desktop-header');

  if (!desktopHeader) {
    return;
  }

  if (!desktopHeader.classList.contains('vads-u-display--none')) {
    desktopHeader.classList.add('vads-u-display--none');
  }
};

export const showDesktopHeader = () => {
  const desktopHeader = document.getElementById('desktop-header');

  if (!desktopHeader) {
    return;
  }

  if (desktopHeader.classList.contains('vads-u-display--none')) {
    desktopHeader.classList.remove('vads-u-display--none');
  }
};

export const fetchSearchSuggestions = async searchTerm => {
  try {
    // Attempt to fetch suggestions.
    const suggestions = await apiRequest(
      `/search_typeahead?query=${encodeURIComponent(searchTerm)}`,
    );

    // Return empty array if no suggestions are returned.
    if (!suggestions.length) {
      return [];
    }

    // Sort and return suggestions.
    return suggestions.sort((a, b) => a.length - b.length);
  } catch (error) {
    // Custom log rate limit error.
    if (error?.error?.code === 'OVER_RATE_LIMIT') {
      Sentry.captureException(
        new Error(`"OVER_RATE_LIMIT" - Search Typeahead in header v2`),
      );
    }

    // Capture all other errors.
    Sentry.captureException(error);

    // Return empty array if we hit an error.
    return [];
  }
};

export const onSearch = componentState => {
  const savedSuggestions = componentState?.savedSuggestions || [];
  const suggestions = componentState?.suggestions || [];
  const searchTerm = componentState?.inputValue;
  const validSuggestions =
    savedSuggestions?.length > 0 ? savedSuggestions : suggestions;

  // event logging, note suggestion will be undefined during a userInput search
  recordEvent({
    event: 'view_search_results',
    'search-page-path': document.location.pathname,
    'search-query': searchTerm,
    'search-results-total-count': undefined,
    'search-results-total-pages': undefined,
    'search-selection': 'All VA.gov',
    'search-typeahead-enabled': true,
    'search-location': 'Mobile Header',
    'sitewide-search-app-used': true,
    'type-ahead-option-keyword-selected': undefined,
    'type-ahead-option-position': undefined,
    'type-ahead-options-list': validSuggestions,
    'type-ahead-options-count': validSuggestions?.length,
  });

  const searchUrl = replaceWithStagingDomain(
    `https://www.va.gov/search/?query=${encodeURIComponent(
      searchTerm,
    )}&t=${false}`,
  );

  // relocate to search results, preserving history
  window.location.assign(searchUrl);
};

export const onSuggestionSubmit = (index, componentState) => {
  const savedSuggestions = componentState?.savedSuggestions || [];
  const suggestions = componentState?.suggestions || [];
  const searchTerm = componentState?.inputValue;

  const validSuggestions =
    savedSuggestions?.length > 0 ? savedSuggestions : suggestions;

  // event logging, note suggestion will be undefined during a userInput search
  recordEvent({
    event: 'view_search_results',
    'search-page-path': document.location.pathname,
    'search-query': searchTerm,
    'search-results-total-count': undefined,
    'search-results-total-pages': undefined,
    'search-selection': 'All VA.gov',
    'search-typeahead-enabled': true,
    'search-location': 'Mobile Header',
    'sitewide-search-app-used': true,
    'type-ahead-option-keyword-selected': validSuggestions?.[index],
    'type-ahead-option-position': index + 1,
    'type-ahead-options-list': validSuggestions,
    'type-ahead-options-count': validSuggestions?.length,
  });

  const searchUrl = replaceWithStagingDomain(
    `https://www.va.gov/search/?query=${encodeURIComponent(
      validSuggestions?.[index],
    )}&t=${true}`,
  );

  // relocate to search results, preserving history
  window.location.assign(searchUrl);
};

export const formatMenuItems = menuItems => {
  const formattedMenuItems = [];

  if (menuItems && isArray(menuItems)) {
    return menuItems;
  }

  if (menuItems?.seeAllLink) {
    formattedMenuItems.push({
      title: menuItems?.seeAllLink?.text,
      href: menuItems?.seeAllLink?.href,
    });
  }

  if (menuItems?.mainColumn) {
    formattedMenuItems.push({
      title: menuItems?.mainColumn?.title,
      links: menuItems?.mainColumn?.links,
    });
  }

  if (menuItems?.columnOne) {
    formattedMenuItems.push({
      title: menuItems?.columnOne?.title,
      links: menuItems?.columnOne?.links,
    });
  }

  if (menuItems?.columnTwo) {
    formattedMenuItems.push({
      title: menuItems?.columnTwo?.title,
      links: menuItems?.columnTwo?.links,
    });
  }

  // Do not do anything for column three according to current code in production.
  if (menuItems?.columnThree) {
    // formattedMenuItems.push({
    //   title: menuItems?.columnThree?.title,
    //   links: menuItems?.columnThree?.links,
    // });
  }

  return formattedMenuItems;
};

export const formatSubMenuSections = subMenuSections => {
  return subMenuSections?.reduce((allSubMenuSections, item) => {
    if (!item?.links) {
      allSubMenuSections.push({
        href: item?.href,
        links: item?.links,
        text: item?.title || item?.text,
      });
      return allSubMenuSections;
    }

    allSubMenuSections = [...allSubMenuSections, ...item?.links]; // eslint-disable-line no-param-reassign
    return allSubMenuSections;
  }, []);
};

export const deriveMenuItemID = (item, level) => {
  const formattedTitle = item?.title || item?.text || '';
  const formattedHref = item?.href || '';
  const formattedLevel = level || '';
  return `${formattedTitle}-${formattedHref}-${formattedLevel}`;
};
