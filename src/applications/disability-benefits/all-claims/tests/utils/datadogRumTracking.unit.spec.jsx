import { expect } from 'chai';
import sinon from 'sinon';
import * as datadogBrowserRum from '@datadog/browser-rum';
import {
  trackBackButtonClick,
  trackSaveFormClick,
  trackFormStarted,
} from '../../utils/tracking/datadogRumTracking';
import {
  TRACKING_BACK_BUTTON_CLICKS,
  TRACKING_FORM_RESUMPTION,
  SIDENAV_COMPONENT_ID,
} from '../../constants';

describe('datadogRumTracking', () => {
  let addActionStub;
  let getElementByIdStub;
  let consoleErrorStub;

  beforeEach(() => {
    addActionStub = sinon.stub(datadogBrowserRum.datadogRum, 'addAction');
    getElementByIdStub = sinon.stub(document, 'getElementById');
    consoleErrorStub = sinon.stub(console, 'error');
    sessionStorage.clear();
  });

  afterEach(() => {
    addActionStub.restore();
    getElementByIdStub.restore();
    consoleErrorStub.restore();
  });

  it('tracks back button clicks and increments the counter', () => {
    getElementByIdStub.withArgs(SIDENAV_COMPONENT_ID).returns(null);

    trackBackButtonClick({
      featureToggles: { sidenav526ezEnabled: true },
      pathname: '/test-path',
    });

    expect(sessionStorage.getItem(TRACKING_BACK_BUTTON_CLICKS)).to.equal('1');
    expect(addActionStub.calledOnce).to.be.true;

    const [actionName, properties] = addActionStub.firstCall.args;
    expect(actionName).to.equal('Form navigation - Back button clicked');
    expect(properties).to.include({
      sourcePath: '/test-path',
      clickCount: 1,
      sidenav526ezEnabled: true,
      sidenavIsActive: false,
    });
  });

  it('clears resumption flag and tracks save form click', () => {
    sessionStorage.setItem(TRACKING_FORM_RESUMPTION, 'true');
    getElementByIdStub.withArgs(SIDENAV_COMPONENT_ID).returns({});

    trackSaveFormClick({
      featureToggles: { sidenav526ezEnabled: false },
      pathname: '/save-path',
    });

    expect(sessionStorage.getItem(TRACKING_FORM_RESUMPTION)).to.equal(null);
    expect(addActionStub.calledOnce).to.be.true;

    const [actionName, properties] = addActionStub.firstCall.args;
    expect(actionName).to.equal(
      'Form save in progress - Finish this application later clicked',
    );
    expect(properties).to.include({
      sourcePath: '/save-path',
      sidenav526ezEnabled: false,
      sidenavIsActive: true,
    });
  });

  it('swallows errors from datadogRum.addAction', () => {
    addActionStub.restore();
    addActionStub = sinon
      .stub(datadogBrowserRum.datadogRum, 'addAction')
      .throws(new Error('fail'));
    getElementByIdStub.withArgs(SIDENAV_COMPONENT_ID).returns(null);

    expect(() =>
      trackFormStarted({
        featureToggles: { sidenav526ezEnabled: true },
        pathname: '/start',
      }),
    ).to.not.throw();
  });
});
