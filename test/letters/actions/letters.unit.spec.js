import { expect } from 'chai';
import sinon from 'sinon';

import { ADDRESS_TYPES, SAVE_ADDRESS_SUCCESS } from '../../../src/js/letters/utils/constants';
import { mockApiRequest, resetFetch } from '../../util/unit-helpers';

import {
  getMailingAddress,
  saveAddress
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

