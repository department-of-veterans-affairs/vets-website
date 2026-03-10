import { SESSION_SELECTED_SORT_OPTION } from './session';

export const rxListSortingOptions = {
  alphabeticallyByStatus: {
    API_ENDPOINT: 'sort=alphabetical-status',
    LABEL: 'Alphabetically by status',
  },
  lastFilledFirst: {
    API_ENDPOINT: 'sort=last-fill-date',
    LABEL: 'Last filled first',
  },
  alphabeticalOrder: {
    API_ENDPOINT: 'sort=alphabetical-rx-name',
    LABEL: 'Alphabetically by name',
  },
};

// Sort options used when the management improvements flag is enabled
export const rxListSortingOptionsV2 = {
  mostRecentlyFilled: {
    API_ENDPOINT: 'sort[]=-dispensed_date',
    LABEL: 'Most recently filled',
  },
  alphabeticalByName: {
    API_ENDPOINT: 'sort[]=alphabetical-rx-name',
    LABEL: 'Alphabetical by medication name',
  },
};

// Safe sessionStorage access for Node.js test environment
const getStoredSortOption = () => {
  try {
    const stored = sessionStorage.getItem(SESSION_SELECTED_SORT_OPTION);
    if (
      stored &&
      (rxListSortingOptions[stored] || rxListSortingOptionsV2[stored])
    ) {
      return stored;
    }
    return null;
  } catch {
    return null;
  }
};

export const defaultSelectedSortOption =
  getStoredSortOption() ?? Object.keys(rxListSortingOptions)[0];
