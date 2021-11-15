export const GO_TO_NEXT_PAGE = 'GO_TO_NEXT_PAGE';

export const goToNextPage = payload => {
  return {
    type: GO_TO_NEXT_PAGE,
    payload,
  };
};
