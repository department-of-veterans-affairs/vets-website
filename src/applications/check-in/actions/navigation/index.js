export const INIT_FORM = 'INIT_FORM';

export const createInitFormAction = ({ pages }) => {
  return {
    type: INIT_FORM,
    payload: {
      pages,
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
