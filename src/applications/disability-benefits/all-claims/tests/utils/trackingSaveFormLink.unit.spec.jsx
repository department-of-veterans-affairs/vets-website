import { expect } from 'chai';
import sinon from 'sinon';
import * as datadogRumTracking from '../../utils/tracking/datadogRumTracking';
import { trackingSaveFormLink } from '../../utils/tracking/trackingSaveFormLink';

describe('trackingSaveFormLink', () => {
  const trackingContext = {
    featureToggles: { sidenav526ezEnabled: true },
    pathname: '/test-path',
  };

  it('wraps onFormExit and tracks save', () => {
    const trackStub = sinon
      .stub(datadogRumTracking, 'trackSaveFormClick')
      .returns();
    const onFormExit = sinon.stub().returns({ afterExit: true });

    const wrapped = trackingSaveFormLink(() => trackingContext)(onFormExit);
    const result = wrapped({ beforeExit: true });

    expect(onFormExit.calledOnce).to.be.true;
    expect(trackStub.calledOnce).to.be.true;
    expect(trackStub.firstCall.args[0]).to.deep.equal(trackingContext);
    expect(result).to.deep.equal({ afterExit: true });

    trackStub.restore();
  });

  it('tracks even when no onFormExit is provided', () => {
    const trackStub = sinon
      .stub(datadogRumTracking, 'trackSaveFormClick')
      .returns();

    const wrapped = trackingSaveFormLink(() => trackingContext)();
    const result = wrapped({ beforeExit: true });

    expect(trackStub.calledOnce).to.be.true;
    expect(result).to.deep.equal({ beforeExit: true });

    trackStub.restore();
  });

  it('swallows tracking errors and returns next form data', () => {
    const trackStub = sinon
      .stub(datadogRumTracking, 'trackSaveFormClick')
      .throws(new Error('track failed'));
    const onFormExit = sinon.stub().returns({ afterExit: true });

    const wrapped = trackingSaveFormLink(() => trackingContext)(onFormExit);
    const result = wrapped({ beforeExit: true });

    expect(onFormExit.calledOnce).to.be.true;
    expect(trackStub.calledOnce).to.be.true;
    expect(result).to.deep.equal({ afterExit: true });

    trackStub.restore();
  });
});
