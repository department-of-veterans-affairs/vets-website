import { expect } from 'chai';

import claimsList from '../../reducers/claims-list';
import { SORT_CLAIMS, HIDE_30_DAY_NOTICE } from '../../actions';

describe('Claims list reducer', () => {
  it('should set the sort property', () => {
    const previousState = {
      sortProperty: 'dateFiled',
    };
    const state = claimsList(previousState, {
      type: SORT_CLAIMS,
      sortProperty: 'phaseChangeDate',
    });
    expect(state.sortProperty).to.equal('phaseChangeDate');
  });
  it('should sort by id secondarily', () => {
    const claims = [
      {
        id: 2,
        attributes: {
          phaseChangeDate: '2010-01-01',
        },
      },
      {
        id: 1,
        attributes: {
          phaseChangeDate: '2010-01-01',
        },
      },
    ];
    const previousState = {
      visibleList: claims,
    };
    const state = claimsList(previousState, {
      type: SORT_CLAIMS,
      sortProperty: 'phaseChangeDate',
    });

    expect(state.visibleList[0].id).to.equal(1);
  });
  it('should sort null dates after others', () => {
    const claims = [
      {
        id: 2,
        attributes: {
          phaseChangeDate: '2010-01-01',
        },
      },
      {
        id: 1,
        attributes: {
          phaseChangeDate: null,
        },
      },
    ];
    const previousState = {
      visibleList: claims,
    };
    const state = claimsList(previousState, {
      type: SORT_CLAIMS,
      sortProperty: 'phaseChangeDate',
    });

    expect(state.visibleList[0].id).to.equal(2);
  });
  it('should sort by date received with null dates after others', () => {
    const claims = [
      {
        id: 1,
        attributes: {
          dateFiled: '2010-04-01',
        },
      },
      {
        id: 2,
        attributes: {
          dateFiled: null,
        },
      },
      {
        id: 3,
        attributes: {
          dateFiled: '2010-05-01',
        },
      },
    ];
    const previousState = {
      visibleList: claims,
    };
    const state = claimsList(previousState, {
      type: SORT_CLAIMS,
      sortProperty: 'dateFiled',
    });
    const sortedClaims = [claims[2], claims[0], claims[1]];
    expect(state.visibleList).to.deep.equal(sortedClaims);
  });
  it('should sort by claim type with null types converted to disability claim', () => {
    const claims = [
      {
        id: 1,
        attributes: {
          claimType: 'Pension',
        },
      },
      {
        id: 2,
        attributes: {
          claimType: null,
        },
      },
      {
        id: 3,
        attributes: {
          claimType: 'Compensation',
        },
      },
    ];
    const previousState = {
      visibleList: claims,
    };
    const state = claimsList(previousState, {
      type: SORT_CLAIMS,
      sortProperty: 'claimType',
    });
    const sortedClaims = [claims[2], claims[1], claims[0]];
    expect(state.visibleList).to.deep.equal(sortedClaims);
  });

  it('should turn off 30 day notice flag', () => {
    const state = claimsList(
      {
        show30DayNotice: true,
      },
      {
        type: HIDE_30_DAY_NOTICE,
      },
    );

    expect(state.show30DayNotice).to.be.false;
  });
});
