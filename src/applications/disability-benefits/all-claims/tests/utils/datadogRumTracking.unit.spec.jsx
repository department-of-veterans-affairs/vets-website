import { expect } from 'chai';
import sinon from 'sinon';
import * as datadogBrowserRum from '@datadog/browser-rum';
import {
  trackBackButtonClick,
  trackSaveFormClick,
  trackFormStarted,
} from '../../utils/tracking/datadogRumTracking';
import {
  TRACKING_526EZ_SIDENAV_BACK_BUTTON_CLICKS,
  TRACKING_526EZ_SIDENAV_FEATURE_TOGGLE,
} from '../../constants';

describe('datadogRumTracking', () => {
  let addActionStub;
  let consoleErrorStub;

  beforeEach(() => {
    addActionStub = sinon.stub(datadogBrowserRum.datadogRum, 'addAction');
    consoleErrorStub = sinon.stub(console, 'error');
    sessionStorage.clear();
  });

  afterEach(() => {
    addActionStub.restore();
    consoleErrorStub.restore();
  });

  it('tracks back button clicks and increments the counter', () => {
    sessionStorage.setItem(TRACKING_526EZ_SIDENAV_FEATURE_TOGGLE, 'true');

    trackBackButtonClick();

    expect(
      sessionStorage.getItem(TRACKING_526EZ_SIDENAV_BACK_BUTTON_CLICKS),
    ).to.equal('1');
    expect(addActionStub.calledOnce).to.be.true;

    const [actionName, properties] = addActionStub.firstCall.args;
    expect(actionName).to.equal('Form navigation - Back button clicked');
    expect(properties).to.include({
      clickCount: 1,
      sidenav526ezEnabled: true,
    });
    expect(properties.sourcePath).to.be.a('string');
  });

  it('tracks save form click', () => {
    sessionStorage.setItem(TRACKING_526EZ_SIDENAV_FEATURE_TOGGLE, 'false');

    trackSaveFormClick();

    const [actionName, properties] = addActionStub.firstCall.args;
    expect(actionName).to.equal(
      'Form save in progress - Finish this application later clicked',
    );
    expect(properties).to.include({
      sidenav526ezEnabled: false,
    });
    expect(properties.sourcePath).to.be.a('string');
  });

  it('does not throw when datadogRum.addAction fails', () => {
    addActionStub.restore();
    addActionStub = sinon
      .stub(datadogBrowserRum.datadogRum, 'addAction')
      .throws(new Error('fail'));

    expect(() => trackFormStarted()).to.not.throw();
  });
});
