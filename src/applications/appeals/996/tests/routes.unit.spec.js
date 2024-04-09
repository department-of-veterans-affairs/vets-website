import { expect } from 'chai';
import sinon from 'sinon';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';
import routes from '../routes';
import { setHlrWizardStatus } from '../wizard/utils';

describe('Form 996 routes', () => {
  const { onEnter } = routes[0].indexRoute;
  it('should redirect from the root to /introduction', () => {
    const replace = sinon.spy();
    setHlrWizardStatus(WIZARD_STATUS_COMPLETE);
    onEnter(null, replace);
    expect(replace.calledWith('/introduction')).to.be.true;
  });
});
