export const QUERY_CHANGED = 'QUERY_CHANGED';

export const updateQuery = query => ({
  type: QUERY_CHANGED,
  query,
});
