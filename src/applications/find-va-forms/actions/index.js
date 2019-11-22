export const QUERY_CHANGED = 'QUERY_CHANGED';

export function updateQuery(query) {
  return {
    type: QUERY_CHANGED,
    query,
  };
}
