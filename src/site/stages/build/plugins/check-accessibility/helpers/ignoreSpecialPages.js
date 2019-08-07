const COMPLETELY_IGNORED_PATHS = [
  'auth/login/callback/',
  'playbook/',
  'opt-out-information-sharing',
];

const PARTIALLY_IGNORED_PAGES = new Set([
  // 404 page contains 2 search auto-suggest elements with the same element ID,
  // which violates WCAG 2.0 standards. This element id is referenced by
  // https://search.usa.gov/assets/sayt_loader_libs.js, so if we change the ID
  // of one of the elements, search won't work.
  '/404.html',
  // This is here because aXe bug flags the custom select component on this page
  '/find-locations/',
  // This is here because an aXe bug flags the autosuggest component on this page
  '/gi-bill-comparison-tool/',
]);

function ignoreSpecialPages(results) {

  return results;
}

module.exports = ignoreSpecialPages;
