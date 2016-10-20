
import { expect } from 'chai';

import claimsList from '../../../src/js/disability-benefits/reducers/claims-list';
import { SET_CLAIMS, CHANGE_CLAIMS_PAGE, SHOW_CONSOLIDATED_MODAL } from '../../../src/js/disability-benefits/actions';

describe('Claims list reducer', () => {
  it('should populate the claims list', () => {
    const claims = Array(12).fill(4);
    const state = claimsList(undefined, {
      type: SET_CLAIMS,
      claims
    });

    expect(state.list).to.deep.equal(claims);
    expect(state.visibleRows).to.deep.equal(claims.slice(0, 10));
  });

  it('should change the claims list page', () => {
    const claims = Array(12).fill(4);
    const previousState = {
      list: claims,
      page: 1,
      pages: 2,
      visibleRows: claims.slice(0, 10)
    };
    const state = claimsList(previousState, {
      type: CHANGE_CLAIMS_PAGE,
      page: 2
    });

    expect(state.visibleRows).to.deep.equal(claims.slice(10, 12));
    expect(state.page).to.equal(2);
  });

  it('should toggle modal flag', () => {
    const state = claimsList({}, {
      type: SHOW_CONSOLIDATED_MODAL,
      visible: true
    });

    expect(state.consolidatedModal).to.be.true;
  });
});
