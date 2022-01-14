export const INIT_FORM = 'INIT_FORM';

export const createInitFormAction = ({ pages, firstPage }) => {
  return {
    type: INIT_FORM,
    payload: {
      pages,
      currentPage: firstPage,
    },
  };
};

export const GO_TO_NEXT_PAGE = 'GO_TO_NEXT_PAGE';

export const createGoToNextPageAction = ({ nextPage }) => {
  return {
    type: GO_TO_NEXT_PAGE,
    payload: { nextPage },
  };
};
