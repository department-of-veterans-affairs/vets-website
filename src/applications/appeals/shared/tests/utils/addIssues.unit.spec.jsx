import { expect } from 'chai';
import sinon from 'sinon';

import { setStorage, getStorage, removeStorage } from '../../utils/addIssue';

import { LAST_ISSUE, REVIEW_ISSUES } from '../../constants';

describe('setStorage', () => {
  it('should call setItem using index & type', () => {
    const setItem = sinon.spy();
    const removeItem = sinon.spy();
    setStorage(2, 'cancel', '', { setItem, removeItem });
    expect(setItem.args[0]).to.deep.equal([LAST_ISSUE, '2,cancel']);
    expect(removeItem.calledWith(REVIEW_ISSUES)).to.be.true;
  });
});

describe('getStorage', () => {
  it('should call sessionStorage.getItem with LAST_ISSUE', () => {
    const getItem = sinon.spy();
    getStorage({ getItem });
    expect(getItem.calledWith(LAST_ISSUE)).to.be.true;
  });
});

describe('removeStorage', () => {
  it('should call sessionStorage.getItem with LAST_ISSUE', () => {
    const removeItem = sinon.spy();
    removeStorage({ removeItem });
    expect(removeItem.calledWith(LAST_ISSUE)).to.be.true;
  });
});
