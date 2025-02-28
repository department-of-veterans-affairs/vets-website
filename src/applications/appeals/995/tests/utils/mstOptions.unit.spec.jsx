import { expect } from 'chai';

import { hasMstOption } from '../../utils/mstOption';

import { SC_NEW_FORM_DATA, MST_OPTION } from '../../constants';

describe('hasMstOption', () => {
  it('should return expected value', () => {
    expect(
      hasMstOption({ [SC_NEW_FORM_DATA]: undefined, [MST_OPTION]: undefined }),
    ).to.be.undefined;
    expect(hasMstOption({ [SC_NEW_FORM_DATA]: undefined, [MST_OPTION]: false }))
      .to.be.undefined;
    expect(hasMstOption({ [SC_NEW_FORM_DATA]: undefined, [MST_OPTION]: true }))
      .to.be.undefined;
    expect(hasMstOption({ [SC_NEW_FORM_DATA]: false, [MST_OPTION]: undefined }))
      .to.be.false;
    expect(hasMstOption({ [SC_NEW_FORM_DATA]: false, [MST_OPTION]: false })).to
      .be.false;
    expect(hasMstOption({ [SC_NEW_FORM_DATA]: false, [MST_OPTION]: true })).to
      .be.false;
    expect(hasMstOption({ [SC_NEW_FORM_DATA]: true, [MST_OPTION]: undefined }))
      .to.be.undefined;
    expect(hasMstOption({ [SC_NEW_FORM_DATA]: true, [MST_OPTION]: false })).to
      .be.false;
    expect(hasMstOption({ [SC_NEW_FORM_DATA]: true, [MST_OPTION]: true })).to.be
      .true;
  });
});
