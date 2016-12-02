import { expect } from 'chai';

import prescriptionsReducer from '../../../src/js/rx/reducers/prescriptions.js';

describe('prescriptions reducer', () => {
  it('should show a loading screen for active', () => {
    const state = prescriptionsReducer(undefined, { type: 'LOADING_ACTIVE' });
    expect(state.active.loading).to.be.true;
  });

  it('should show a loading screen for history', () => {
    const state = prescriptionsReducer(undefined, { type: 'LOADING_HISTORY' });
    expect(state.history.loading).to.be.true;
  });

  it('should show a loading screen for detail', () => {
    const state = prescriptionsReducer(undefined, { type: 'LOADING_DETAIL' });
    expect(state.detail.loading).to.be.true;
  });

  it('should handle failure to fetch a prescription', () => {
    const state = prescriptionsReducer(undefined, { type: 'LOAD_PRESCRIPTION_FAILURE' });
    expect(state.currentItem).to.be.null;
    expect(state.detail.loading).to.be.false;
  });

  it('should handle failure to fetch active prescriptions', () => {
    const state = prescriptionsReducer(undefined, {
      type: 'LOAD_PRESCRIPTIONS_FAILURE',
      active: true
    });
    expect(state.items).to.be.null;
    expect(state.active.loading).to.be.false;
  });

  it('should handle failure to fetch prescriptions history', () => {
    const state = prescriptionsReducer(undefined, {
      type: 'LOAD_PRESCRIPTIONS_FAILURE'
    });
    expect(state.items).to.be.null;
    expect(state.history.loading).to.be.false;
  });

  it('should handle a successful request for active prescriptions', () => {
    const state = prescriptionsReducer(undefined, {
      type: 'LOAD_PRESCRIPTIONS_SUCCESS',
      active: true,
      data: {
        data: [ 'item1', 'item2' ],
        meta: {
          sort: { prescriptionName: 'ASC' }
        }
      }
    });
    expect(state.items).to.eql(['item1', 'item2']);
    expect(state.active.sort).to.eql('prescriptionName');
    expect(state.active.loading).to.be.false;
  });

  it('should handle a successful request for prescriptions history', () => {
    const state = prescriptionsReducer(undefined, {
      type: 'LOAD_PRESCRIPTIONS_SUCCESS',
      data: {
        data: [ 'item1', 'item2' ],
        meta: {
          pagination: {
            currentPage: 1,
            totalPages: 1
          },
          sort: { prescriptionName: 'ASC' }
        }
      }
    });
    expect(state.items).to.eql(['item1', 'item2']);
    expect(state.history.sort.value).to.eql('prescriptionName');
    expect(state.history.sort.order).to.eql('ASC');
    expect(state.history.page).to.eql(1);
    expect(state.history.pages).to.eql(1);
    expect(state.history.loading).to.be.false;
  });

  it('should handle a successful refill', () => {
    const state = {
      items: [
        {
          id: 1,
          attributes: {
            refillStatus: 'active',
            isRefillable: true
          }
        },
        {
          id: 2,
          attributes: {
            refillStatus: 'active',
            isRefillable: true
          }
        },
        {
          id: 3,
          attributes: {
            refillStatus: 'active',
            isRefillable: true
          }
        },
      ]
    };

    const newState = prescriptionsReducer(state, {
      type: 'REFILL_SUCCESS',
      prescription: { prescriptionId: 2 }
    });

    expect(newState.items[1].attributes.isRefillable).to.be.false;
    expect(newState.items[1].attributes.refillStatus).to.eql('submitted');
  });
});
