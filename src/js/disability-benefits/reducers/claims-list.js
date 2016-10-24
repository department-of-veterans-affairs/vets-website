import _ from 'lodash/fp';

import { SET_CLAIMS, CHANGE_CLAIMS_PAGE, SHOW_CONSOLIDATED_MODAL } from '../actions';

const ROWS_PER_PAGE = 10;

const initialState = {
  list: null,
  visibleRows: [],
  page: 1,
  pages: 1,
  consolidatedModal: false
};

export default function claimsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CLAIMS: {
      const current = (state.page - 1) * ROWS_PER_PAGE;
      return _.merge(state, {
        list: action.claims,
        visibleRows: action.claims.slice(current, current + ROWS_PER_PAGE),
        pages: Math.ceil(action.claims.length / ROWS_PER_PAGE)
      });
    }
    case CHANGE_CLAIMS_PAGE: {
      const current = (action.page - 1) * ROWS_PER_PAGE;
      return _.assign(state, {
        page: action.page,
        visibleRows: state.list.slice(current, current + ROWS_PER_PAGE)
      });
    }
    case SHOW_CONSOLIDATED_MODAL: {
      return _.set('consolidatedModal', action.visible, state);
    }
    default:
      return state;
  }
}
