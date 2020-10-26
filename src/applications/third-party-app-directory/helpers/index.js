// Node modules.
import map from 'lodash/map';
// Relative imports.
import MOCK_RESULTS from '../api/stub';

export const createMockResults = () => {
  const { data } = MOCK_RESULTS;

  return {
    data,
    meta: {
      count: data.length,
    },
  };
};

export const normalizeResponse = response => ({
  results: map(response?.data, school => ({
    ...school?.attributes,
    id: school?.id,
    type: school?.type,
  })),
  totalResults: response?.meta?.count,
});
