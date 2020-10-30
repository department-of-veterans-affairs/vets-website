// Node modules.
import map from 'lodash/map';
// import environment from 'platform/utilities/environment';
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

// TODO: may be ok to delete
export const normalizeResponse = response => ({
  results: map(response?.data, school => ({
    ...school?.attributes,
    id: school?.id,
    type: school?.type,
  })),
  totalResults: response?.meta?.count,
});

// export const appDirectoryRequest = async options => {
//   const response = await fetch(`${environment.API_URL}${options.baseUrl}`);
//   return response;
// };
