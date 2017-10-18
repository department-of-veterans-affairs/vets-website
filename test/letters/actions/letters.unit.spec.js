import { expect } from 'chai';
import sinon from 'sinon';

import { mockApiRequest, resetFetch } from '../../util/unit-helpers';

import {
  ADDRESS_TYPES,
  SAVE_ADDRESS_SUCCESS,
  SAVE_ADDRESS_PENDING,
  SAVE_ADDRESS_FAILURE,
  GET_LETTERS_SUCCESS
} from '../../../src/js/letters/utils/constants';

import {
  getLetterList,
  getMailingAddress,
  getBenefitSummaryOptions,
  getLetterPdf,
  saveAddressPending,
  saveAddress,
  getAddressCountries,
  getAddressStates,
} from '../../../src/js/letters/actions/letters';

const backendAddress = {
  type: ADDRESS_TYPES.military,
  militaryPostOfficeTypeCode: 'apo',
  militaryStateCode: 'secret'
};

const frontEndAddress = {
  type: ADDRESS_TYPES.military,
  city: 'apo',
  state: 'secret'
};

const addressResponse = {
  data: {
    attributes: {
      address: {
        type: 'DOMESTIC',
        addressEffectiveDate: '1973-01-01T05:00:00.000+00:00',
        addressOne: '140 Rock Creek Church Rd NW',
        addressTwo: '',
        addressThree: '',
        city: 'Washington',
        stateCode: 'DC',
        zipCode: '20011',
        zipSuffix: '1865'
      },
      controlInformation: {
        canUpdate: true,
        corpAvailIndicator: true,
        corpRecFoundIndicator: true,
        hasNoBdnPaymentsIndicator: true,
        isCompetentIndicator: true,
        indentityIndicator: true,
        indexIndicator: true,
        noFiduciaryAssignedIndicator: true,
        notDeceasedIndicator: true
      }
    }
  }
};

/**
 * Setup() for each test requires stubbing global fetch() and setting userToken
 * in global sessionStorage. Teardown() resets everything back to normal
 */
let oldFetch;
let oldSessionStorage;
const setup = () => {
  oldSessionStorage = global.sessionStorage;
  oldFetch = global.fetch;
  global.sessionStorage = {
    userToken: '123abc'
  };
  global.fetch = sinon.stub();
  global.fetch.returns(Promise.resolve({ ok: true }));
};
const teardown = () => {
  global.fetch = oldFetch;
  global.sessionStorage = oldSessionStorage;
};

const getState = () => ({});

describe.only('saveAddress', () => {
  beforeEach(setup);
  afterEach(teardown);

  it('dispatches SAVE_ADDRESS_PENDING first', (done) => {
    let callCount = 0;
    const thunk = saveAddress(frontEndAddress);
    const dispatch = sinon.spy((action) => {
      callCount += 1;
      const { type } = action;
      if (callCount === 1) {
        try {
          expect(type).to.equal(SAVE_ADDRESS_PENDING);
          done();
        } catch (error) {
          done(error);
        }
      }
    });

    thunk(dispatch, getState);
  });

  it('dispatches SAVE_ADDRESS_SUCCESS on update success', (done) => {
    const thunk = saveAddress(frontEndAddress);
    global.fetch.returns(Promise.resolve({
      headers: {
        get: () => 'application/json'
      },
      ok: true,
      json: () => Promise.resolve({})
    }));

    const dispatch = sinon.spy((action) => {
      const { type, address } = action;
      if (type === SAVE_ADDRESS_SUCCESS) {
        try {
          expect(type).to.equal(SAVE_ADDRESS_SUCCESS);
          expect(address).to.eql(frontEndAddress);
          done();
        } catch (error) {
          done(error);
        }
      }
    });

    thunk(dispatch, getState);
  });

  it('dispatches SAVE_ADDRESS_FAILURE on update failure', (done) => {
    let callCount = 0;
    const thunk = saveAddress(frontEndAddress);
    global.fetch.returns(Promise.reject(new Error('Oops, something went wrong')));
    const dispatch = sinon.spy((action) => {
      const { type } = action;
      callCount += 1;
      if (callCount === 2) {
        try {
          expect(type).to.equal(SAVE_ADDRESS_FAILURE);
          done();
        } catch (error) {
          done(error);
        }
      }
    });

    thunk(dispatch, getState);
  });
});


// Skipping these for now because we're having trouble with making a global way to "mock"
//  apiRequest(). The answer to this might just be more copy pasta right here to setup
//  like we've done elsewhere (schemaform save-load-actions, if I recall correctly).
describe.skip('getMailingAddress', () => {
  after(() => {
    resetFetch();
  });

  it('should transform military address fields to generic ones', (done) => {
    mockApiRequest(backendAddress);

    // Had to do the expect()s inside the spy's function because it's asynchronous
    const dispatchSpy = sinon.spy((action) => {
      const address = action.data;
      try {
        expect(address.city).to.equal(backendAddress.militaryPostOfficeTypeCode);
        expect(address.state).to.equal(backendAddress.militaryStateCode);
        expect(address.militaryPostOfficeTypeCode).to.be.undefined;
        expect(address.militaryStateCode).to.be.undefined;

        done();
      } catch (error) {
        done(error);
      }
    });
    const thunk = getMailingAddress();

    thunk(dispatchSpy);
  });
});

describe.skip('saveAddress', () => {
  after(() => {
    resetFetch();
  });

  it('should transform generic address fields to military ones', (done) => {
    mockApiRequest({}); // We don't really need it to return anything, just resolve the promise
    const thunk = saveAddress(frontEndAddress);

    // Only test on the call to save the address, not to set the pending state
    // If the function isn't called with the success action, it'll fail because done() isn't called
    const dispatchSpy = sinon.spy((action) => {
      if (action.type === SAVE_ADDRESS_SUCCESS) {
        const address = action.address;

        try {
          expect(address.militaryPostOfficeTypeCode).to.equal(frontEndAddress.city);
          expect(address.militaryStateCode).to.equal(frontEndAddress.state);
          expect(address.city).to.be.undefined;
          expect(address.state).to.be.undefined;

          done();
        } catch (error) {
          done(error);
        }
      }
    });
    thunk(dispatchSpy);
  });
});

