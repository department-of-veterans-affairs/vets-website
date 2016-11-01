import { expect } from 'chai';

import claimsList from '../../../src/js/disability-benefits/reducers/claims-list';
import { SET_CLAIMS, CHANGE_CLAIMS_PAGE, SHOW_CONSOLIDATED_MODAL } from '../../../src/js/disability-benefits/actions';

describe('Claims list reducer', () => {
  it('should sort and populate the claims list', () => {
    const claims = Array(12).fill({
      attributes: {
        eventsTimeline: [
          {
            date: '2010-01-01'
          }
        ]
      }
    });
    claims[11] = {
      attributes: {
        eventsTimeline: [
          {
            date: '2011-01-05'
          }
        ]
      }
    };
    claims[10] = {
      attributes: {
      }
    };
    claims[9] = {
      attributes: {
        eventsTimeline: []
      }
    };
    const state = claimsList(undefined, {
      type: SET_CLAIMS,
      claims
    });

    expect(state.list.length).to.equal(12);
    expect(state.list[2].attributes.eventsTimeline[0].date).to.equal('2011-01-05');
    expect(state.visibleRows.length).to.equal(10);
    expect(state.visibleRows[2].attributes.eventsTimeline[0].date).to.equal('2011-01-05');
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
