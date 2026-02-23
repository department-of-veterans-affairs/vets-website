import { SESSION_SELECTED_SORT_OPTION } from './session';

export const rxListSortingOptions = {
  alphabeticallyByStatus: {
    API_ENDPOINT: '&sort=alphabetical-status',
    LABEL: 'Alphabetically by status',
  },
  lastFilledFirst: {
    API_ENDPOINT: '&sort=last-fill-date',
    LABEL: 'Last filled first',
  },
  alphabeticalOrder: {
    API_ENDPOINT: '&sort=alphabetical-rx-name',
    LABEL: 'Alphabetically by name',
  },
};

// Safe sessionStorage access for Node.js test environment
const getStoredSortOption = () => {
  try {
    return sessionStorage.getItem(SESSION_SELECTED_SORT_OPTION);
  } catch {
    return null;
  }
};

export const defaultSelectedSortOption =
  getStoredSortOption() ?? Object.keys(rxListSortingOptions)[0];
