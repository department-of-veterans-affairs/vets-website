export const UPDATE_HEADER_TYPE = 'UPDATE_HEADER_TYPE';

export function updateLayoutHeaderType(headerType) {
  return {
    type: UPDATE_HEADER_TYPE,
    header: {
      type: headerType,
    },
  };
}
