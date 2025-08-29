import { expect } from 'chai';

import { hasMstOption } from '../../utils/mstOption';

import { MST_OPTION } from '../../constants';

describe('hasMstOption', () => {
  it('should return expected value', () => {
    expect(hasMstOption({ [MST_OPTION]: undefined })).to.be.undefined;
    expect(hasMstOption({ [MST_OPTION]: false })).to.be.false;
    expect(hasMstOption({ [MST_OPTION]: true })).to.be.true;
    expect(hasMstOption({})).to.be.undefined;
  });
});
