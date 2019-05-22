import { expect } from 'chai';

import * as utils from '../../util/paymentInformation';

describe('profile utils', () => {
  it('validates routing numbers', () => {
    const badVals = ['123', 'INVALID', '', '-1'];

    for (const bad of badVals) {
      expect(utils.getRoutingNumberErrorMessage(bad)).to.be.string;
    }

    const goodVal = '123456789';
    expect(utils.getRoutingNumberErrorMessage(goodVal)).to.be.null;
  });

  it('validates account numbers', () => {
    const badVals = ['012345678912345678', 'INVALID', '', '-1'];

    for (const bad of badVals) {
      expect(utils.getAccountNumberErrorMessage(bad)).to.be.string;
    }

    const goodVal = '123456789';
    expect(utils.getAccountNumberErrorMessage(goodVal)).to.be.null;
  });
});
