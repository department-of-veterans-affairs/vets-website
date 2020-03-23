// Node modules.
import map from 'lodash/map';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';

export const capitalize = str => startCase(toLower(str));

export const normalizeResponse = response => ({
  results: map(response?.data, school => ({
    ...school?.attributes,
    id: school?.id,
    type: school?.type,
  })),
  totalResults: response?.meta?.count,
});
