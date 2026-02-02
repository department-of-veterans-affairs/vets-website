import { SEARCH_QUERY_COMMITED } from '../../utils/actionTypes';

/**
 * Commit current Search form state for pagination navigation.
 *
 * @param {Object} query The current state of the Search form
 */

export const commitSearchQuery = ({ committedSearchQuery: _, ...query }) => ({
  type: SEARCH_QUERY_COMMITED,
  payload: query,
});
