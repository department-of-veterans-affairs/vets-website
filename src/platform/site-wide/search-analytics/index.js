// We want to log a single Google Analytics event when a user lands on /search with a search term
// Since we have multiple entry points for a site-wide search, we need an app-agnostic
// way to capture the search origin for the GA event that fires
export const PAGE_PATH = 'path';
export const SEARCH_APP_USED = 'sitewideSearch';
export const SEARCH_LOCATION = 'searchLocation';
export const SEARCH_SELECTION = 'searchSelection';
export const SEARCH_TYPEAHEAD_ENABLED = 'searchTypeaheadEnabled';
export const TYPEAHEAD_KEYWORD_SELECTED = 'typeaheadKeywordSelected';
export const TYPEAHEAD_LIST = 'typeaheadList';

export const addSearchGADataToStorage = data => {
  console.log('data in the function: ', data);
  localStorage.setItem(PAGE_PATH, data?.[PAGE_PATH]);
  localStorage.setItem(SEARCH_APP_USED, data?.[SEARCH_APP_USED]);
  localStorage.setItem(SEARCH_SELECTION, data?.[SEARCH_SELECTION]);
  localStorage.setItem(SEARCH_LOCATION, data?.[SEARCH_LOCATION]);
  localStorage.setItem(SEARCH_TYPEAHEAD_ENABLED, data?.[SEARCH_TYPEAHEAD_ENABLED]);

  if (data?.[TYPEAHEAD_KEYWORD_SELECTED]) {
    localStorage.setItem(
      TYPEAHEAD_KEYWORD_SELECTED,
      data[TYPEAHEAD_KEYWORD_SELECTED],
    );
  }

  if (data?.[TYPEAHEAD_LIST]) {
    localStorage.setItem(
      TYPEAHEAD_LIST,
      data[TYPEAHEAD_LIST],
    );
  }
};

export const getSearchGADataFromStorage = () => {
  const keyword = localStorage?.getItem(TYPEAHEAD_KEYWORD_SELECTED) !== 'undefined' ?
    localStorage?.getItem(TYPEAHEAD_KEYWORD_SELECTED)
    : undefined;

  const sitewideSearchUsed = localStorage.getItem(SEARCH_APP_USED) === 'true' ? true : false;

  return {
    path: localStorage.getItem(PAGE_PATH),
    searchLocation: localStorage.getItem(SEARCH_LOCATION),
    sitewideSearch: sitewideSearchUsed,
    searchSelection: localStorage.getItem(SEARCH_SELECTION),
    searchTypeaheadEnabled: localStorage.getItem(SEARCH_TYPEAHEAD_ENABLED),
    keywordSelected: keyword,
    suggestionsList: localStorage.getItem(TYPEAHEAD_LIST)
  };
};

export const listenForTypeaheadClick = (
  searchListBoxItems,
  setTypeaheadKeywordSelected
) => {
  searchListBoxItems?.forEach(item => {
    item?.addEventListener('click', event => {
      const nodeName = event?.target?.nodeName;
      let targetElement = event?.target;

      if (nodeName === 'STRONG') {
        targetElement = event?.target?.parentNode;
      }

      const typeaheadClicked = targetElement.outerText;

      if (typeaheadClicked) {
        setTypeaheadKeywordSelected(typeaheadClicked);
      }
    });
  });
};
