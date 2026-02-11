import { expect } from 'chai';
import sinon from 'sinon';
import * as datadogRumTracking from '../../utils/tracking/datadogRumTracking';
import { trackingSaveFormLink } from '../../utils/tracking/trackingSaveFormLink';

describe('trackingSaveFormLink', () => {
  let trackStub;

  afterEach(() => {
    if (trackStub) {
      trackStub.restore();
    }
  });

  it('wraps onFormExit and tracks save', () => {
    trackStub = sinon.stub(datadogRumTracking, 'trackSaveFormClick').returns();
    const onFormExit = sinon.stub().returns({ afterExit: true });

    const wrapped = trackingSaveFormLink(onFormExit);
    const result = wrapped({ beforeExit: true });

    expect(onFormExit.calledOnce).to.be.true;
    expect(trackStub.calledOnce).to.be.true;
    expect(result).to.deep.equal({ afterExit: true });
  });

  it('tracks even when no onFormExit is provided', () => {
    trackStub = sinon.stub(datadogRumTracking, 'trackSaveFormClick').returns();

    const wrapped = trackingSaveFormLink();
    const result = wrapped({ beforeExit: true });

    expect(trackStub.calledOnce).to.be.true;
    expect(result).to.deep.equal({ beforeExit: true });
  });

  it('swallows tracking errors and returns next form data', () => {
    trackStub = sinon
      .stub(datadogRumTracking, 'trackSaveFormClick')
      .throws(new Error('track failed'));
    const onFormExit = sinon.stub().returns({ afterExit: true });

    const wrapped = trackingSaveFormLink(onFormExit);
    const result = wrapped({ beforeExit: true });

    expect(onFormExit.calledOnce).to.be.true;
    expect(trackStub.calledOnce).to.be.true;
    expect(result).to.deep.equal({ afterExit: true });
  });
});
