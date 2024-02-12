import { expect } from 'chai';
import { paginationReducer } from '../../reducers/pagination';
import { Actions } from '../../util/actionTypes';

const initialState = {
  /**
   * The initial pagination page being displayed to the user.
   */
  page: [
    {
      domain: 'allergies',
      value: 2,
    },
  ],
};

describe('paginationReducer', () => {
  it('should handle SET_PAGINATION action', () => {
    const action = {
      type: Actions.Pagination.SET_PAGINATION,
      payload: {
        domain: 'allergies',
        value: 1,
      },
    };
    const newState = paginationReducer(initialState, action);
    expect(newState).to.eql({
      page: [
        {
          domain: 'allergies',
          value: 1,
        },
      ],
    });
  });

  it('should handle RESET_PAGINATION action', () => {
    const action = {
      type: Actions.Pagination.RESET_PAGINATION,
      payload: {
        domain: 'vitals',
        value: 1,
      },
    };
    const newState = paginationReducer(initialState, action);
    expect(newState).to.eql({
      page: [
        {
          domain: 'allergies',
          value: 1,
        },
      ],
    });
  });
});
