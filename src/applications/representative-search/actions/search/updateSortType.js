import { SORT_TYPE_UPDATED } from '../../utils/actionTypes';

export const updateSortType = query => ({
  type: SORT_TYPE_UPDATED,
  payload: { ...query },
});
