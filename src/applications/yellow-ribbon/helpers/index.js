// Node modules.
import { map, startCase, toLower } from 'lodash';

export const capitalize = str => startCase(toLower(str));

export const normalizeResponse = response => ({
  results: map(response?.data, school => ({
    ...school?.attributes,
    id: school?.id,
    type: school?.type,
  })),
  totalResults: response?.meta?.count,
});
