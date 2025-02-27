import { expect } from 'chai';

import prescriptionsReducer from '../../reducers/prescriptions';

describe('prescriptions reducer', () => {
  it('should show a loading screen for active', () => {
    const state = prescriptionsReducer(
      { active: { loading: false } },
      { type: 'LOADING_ACTIVE' },
    );
    expect(state.active.loading).to.be.true;
  });

  it('should show a loading screen for history', () => {
    const state = prescriptionsReducer(
      { history: { loading: false } },
      { type: 'LOADING_HISTORY' },
    );
    expect(state.history.loading).to.be.true;
  });

  it('should handle failure to fetch active prescriptions', () => {
    const state = prescriptionsReducer(
      {
        items: ['123', '456', '789'],
      },
      {
        type: 'LOAD_PRESCRIPTIONS_FAILURE',
        active: true,
      },
    );
    expect(state.items).to.be.null;
    expect(state.active.loading).to.be.false;
  });

  it('should handle failure to fetch prescriptions history', () => {
    const state = prescriptionsReducer(
      {
        items: ['123', '456', '789'],
      },
      {
        type: 'LOAD_PRESCRIPTIONS_FAILURE',
      },
    );
    expect(state.items).to.be.null;
    expect(state.history.loading).to.be.false;
  });

  it('should handle a successful request for active prescriptions', () => {
    const state = prescriptionsReducer(
      {
        items: null,
      },
      {
        type: 'LOAD_PRESCRIPTIONS_SUCCESS',
        active: true,
        data: {
          data: ['item1', 'item2'],
          meta: {
            pagination: {
              currentPage: 1,
              totalPages: 1,
            },
            sort: { prescriptionName: 'ASC' },
          },
        },
      },
    );
    expect(state.items).to.eql(['item1', 'item2']);
    expect(state.active.sort.value).to.eql('prescriptionName');
    expect(state.active.loading).to.be.false;
  });

  it('should handle a successful request for prescriptions history', () => {
    const state = prescriptionsReducer(
      {
        items: null,
      },
      {
        type: 'LOAD_PRESCRIPTIONS_SUCCESS',
        data: {
          data: ['item1', 'item2'],
          meta: {
            pagination: {
              currentPage: 1,
              totalPages: 1,
            },
            sort: { prescriptionName: 'ASC' },
          },
        },
      },
    );
    expect(state.items).to.eql(['item1', 'item2']);
    expect(state.history.sort.value).to.eql('prescriptionName');
    expect(state.history.sort.order).to.eql('ASC');
    expect(state.history.page).to.equal(1);
    expect(state.history.pages).to.equal(1);
    expect(state.history.loading).to.be.false;
  });
});
