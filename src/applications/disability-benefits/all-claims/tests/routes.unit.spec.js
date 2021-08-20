import { expect } from 'chai';
import sinon from 'sinon';

import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';

import routes from '../routes';
import { WIZARD_STATUS } from '../constants';

describe('Form 526 routes', () => {
  const { onEnter } = routes[1].indexRoute;
  afterEach(() => {
    sessionStorage.removeItem(WIZARD_STATUS);
  });

  it('should redirect from the root to /introduction', () => {
    const replace = sinon.spy();
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    onEnter(null, replace);
    expect(replace.calledWith('/introduction')).to.be.true;
  });
});
