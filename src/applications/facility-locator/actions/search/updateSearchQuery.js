import { SEARCH_QUERY_UPDATED } from '../../utils/actionTypes';

/**
 * Sync form state with Redux state.
 * (And implicitly cause updates back in VAMap)
 *
 * @param {Object} query The current state of the Search form
 */

export const updateSearchQuery = query => ({
  type: SEARCH_QUERY_UPDATED,
  payload: { ...query },
});
