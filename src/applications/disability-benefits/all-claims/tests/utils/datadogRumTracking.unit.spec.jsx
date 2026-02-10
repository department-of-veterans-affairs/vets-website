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
  TRACKING_526EZ_SIDENAV_FORM_RESUMPTION,
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
    trackBackButtonClick({
      featureToggles: { sidenav526ezEnabled: true },
      pathname: '/test-path',
    });

    expect(
      sessionStorage.getItem(TRACKING_526EZ_SIDENAV_BACK_BUTTON_CLICKS),
    ).to.equal('1');
    expect(addActionStub.calledOnce).to.be.true;

    const [actionName, properties] = addActionStub.firstCall.args;
    expect(actionName).to.equal('Form navigation - Back button clicked');
    expect(properties).to.include({
      sourcePath: '/test-path',
      clickCount: 1,
      sidenav526ezEnabled: true,
    });
  });

  it('clears resumption flag and tracks save form click', () => {
    sessionStorage.setItem(TRACKING_526EZ_SIDENAV_FORM_RESUMPTION, 'true');
    trackSaveFormClick({
      featureToggles: { sidenav526ezEnabled: false },
      pathname: '/save-path',
    });

    expect(
      sessionStorage.getItem(TRACKING_526EZ_SIDENAV_FORM_RESUMPTION),
    ).to.equal(null);
    expect(addActionStub.calledOnce).to.be.true;

    const [actionName, properties] = addActionStub.firstCall.args;
    expect(actionName).to.equal(
      'Form save in progress - Finish this application later clicked',
    );
    expect(properties).to.include({
      sourcePath: '/save-path',
      sidenav526ezEnabled: false,
    });
  });

  it('swallows errors from datadogRum.addAction', () => {
    addActionStub.restore();
    addActionStub = sinon
      .stub(datadogBrowserRum.datadogRum, 'addAction')
      .throws(new Error('fail'));

    expect(() =>
      trackFormStarted({
        featureToggles: { sidenav526ezEnabled: true },
        pathname: '/start',
      }),
    ).to.not.throw();
  });
});
