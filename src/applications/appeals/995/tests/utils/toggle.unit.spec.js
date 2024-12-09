import { expect } from 'chai';

import { showScNewForm } from '../../utils/toggle';

import { SC_NEW_FORM_DATA } from '../../constants';

describe('showScNewForm', () => {
  it('should return expected value', () => {
    expect(showScNewForm({ [SC_NEW_FORM_DATA]: undefined })).to.be.undefined;
    expect(showScNewForm({ [SC_NEW_FORM_DATA]: true })).to.be.true;
    expect(showScNewForm({ [SC_NEW_FORM_DATA]: false })).to.be.false;
  });
});
