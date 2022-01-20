export const INIT_FORM = 'INIT_FORM';

export const createInitFormAction = ({ pages }) => {
  return {
    type: INIT_FORM,
    payload: {
      pages,
    },
  };
};
