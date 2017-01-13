import { expect } from 'chai';

import claimsList from '../../../src/js/disability-benefits/reducers/claims-list';
import { SET_CLAIMS, FILTER_CLAIMS, CHANGE_CLAIMS_PAGE, SHOW_CONSOLIDATED_MODAL, HIDE_30_DAY_NOTICE } from '../../../src/js/disability-benefits/actions';

describe('Claims list reducer', () => {
  it('should populate the claims list', () => {
    const claims = Array(12).fill({
      attributes: {
        phaseChangeDate: '2010-01-01'
      }
    });
    claims[11] = {
      attributes: {
        phaseChangeDate: '2011-01-05'
      }
    };
    claims[10] = {
      attributes: {
      }
    };
    const state = claimsList(undefined, {
      type: SET_CLAIMS,
      claims
    });
    expect(state.list).to.deep.equal(claims);
  });
  it('should sort and populate the visible claims list', () => {
    const claims = Array(12).fill({
      attributes: {
        phaseChangeDate: '2010-01-01'
      }
    });
    claims[11] = {
      attributes: {
        phaseChangeDate: '2011-01-05'
      }
    };
    claims[10] = {
      attributes: {
      }
    };
    const previousState = {
      list: claims,
      page: 1
    };
    const state = claimsList(previousState, {
      type: FILTER_CLAIMS,
      filter: undefined
    });

    expect(state.visibleList.length).to.equal(12);
    expect(state.visibleList[0].attributes.phaseChangeDate).to.equal('2011-01-05');
    expect(state.visibleRows.length).to.equal(10);
    expect(state.visibleRows[0].attributes.phaseChangeDate).to.equal('2011-01-05');
  });
  it('should sort by id secondarily', () => {
    const claims = [
      {
        id: 2,
        attributes: {
          phaseChangeDate: '2010-01-01'
        }
      },
      {
        id: 1,
        attributes: {
          phaseChangeDate: '2010-01-01'
        }
      }
    ];
    const previousState = {
      list: claims,
      page: 1
    };
    const state = claimsList(previousState, {
      type: FILTER_CLAIMS
    });

    expect(state.visibleList[0].id).to.equal(1);
  });
  it('should sort null dates after others', () => {
    const claims = [
      {
        id: 2,
        attributes: {
          phaseChangeDate: '2010-01-01'
        }
      },
      {
        id: 1,
        attributes: {
          phaseChangeDate: null
        }
      }
    ];
    const previousState = {
      list: claims,
      page: 1
    };
    const state = claimsList(previousState, {
      type: FILTER_CLAIMS
    });

    expect(state.visibleList[0].id).to.equal(2);
  });
  it('should filter out closed claims', () => {
    const claims = [
      {
        id: 2,
        attributes: {
          open: true
        }
      },
      {
        id: 1,
        attributes: {
          open: false
        }
      }
    ];
    const previousState = {
      list: claims,
      page: 1
    };
    const state = claimsList(previousState, {
      type: FILTER_CLAIMS,
      filter: 'open'
    });
    expect(state.visibleList.length).to.equal(1);
    expect(state.visibleList[0].id).to.equal(2);
  });

  it('should filter out open claims', () => {
    const claims = [
      {
        id: 2,
        attributes: {
          open: true
        }
      },
      {
        id: 1,
        attributes: {
          open: false
        }
      }
    ];
    const previousState = {
      list: claims
    };
    const state = claimsList(previousState, {
      type: FILTER_CLAIMS,
      filter: 'closed'
    });
    expect(state.visibleList.length).to.equal(1);
    expect(state.visibleList[0].id).to.equal(1);
  });

  it('should change the claims list page', () => {
    const claims = Array(12).fill(4);
    const previousState = {
      visibleList: claims,
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
  it('should turn off 30 day notice flag', () => {
    const state = claimsList({
      show30DayNotice: true
    }, {
      type: HIDE_30_DAY_NOTICE
    });

    expect(state.show30DayNotice).to.be.false;
  });
});
