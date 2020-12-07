export const SET_PAGE_TITLE = 'SET_PAGE_TITLE';

export function setPageTitle(title) {
  return {
    type: SET_PAGE_TITLE,
    title,
  };
}
