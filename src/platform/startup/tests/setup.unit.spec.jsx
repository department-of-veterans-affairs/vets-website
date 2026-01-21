import { expect } from 'chai';
import sinon from 'sinon';
import * as Sentry from '@sentry/browser';
import * as featureToggles from 'platform/utilities/feature-toggles';
import * as downtimeNotificationActions from 'platform/monitoring/DowntimeNotification/actions';
import * as storeModule from '../store';
import * as sitewideComponents from '../../site-wide';
import setUpCommonFunctionality from '../setup';

describe('setUpCommonFunctionality', () => {
  let sandbox;
  let storeStub;
  let storeModuleStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    storeStub = {
      dispatch: sinon.stub(),
      getState: sinon.stub(),
    };
    sandbox.stub(featureToggles, 'connectFeatureToggle');
    sandbox
      .stub(downtimeNotificationActions, 'getScheduledDowntime')
      .returns(sinon.stub());
    sandbox.stub(sitewideComponents, 'default');
    storeModuleStub = sandbox.stub(storeModule, 'default').returns(storeStub);
    sandbox.stub(Sentry, 'setTag');
    // Must call the callback to preserve Sentry behavior for other tests using testkit
    sandbox.stub(Sentry, 'withScope').callsFake(callback => {
      callback({
        setFingerprint: sinon.stub(),
        setExtra: sinon.stub(),
        setTag: sinon.stub(),
      });
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should set Sentry tag with entryName', () => {
    setUpCommonFunctionality({ entryName: 'testApp' });
    expect(Sentry.setTag.calledWith('source', 'testApp')).to.be.true;
  });

  it('should set window.appName with entryName', () => {
    setUpCommonFunctionality({ entryName: 'testApp' });
    expect(window.appName).to.equal('testApp');
  });

  it('should create a store with reducer and analyticsEvents', () => {
    const reducer = {};
    const analyticsEvents = [];
    setUpCommonFunctionality({
      entryName: 'testApp',
      reducer,
      analyticsEvents,
    });
    expect(storeModuleStub.calledWith(reducer, analyticsEvents)).to.be.true;
  });

  it('should connect feature toggle', () => {
    setUpCommonFunctionality({ entryName: 'testApp' });
    expect(featureToggles.connectFeatureToggle.calledWith(storeStub.dispatch))
      .to.be.true;
  });

  it('should not fetch scheduled downtimes by default', () => {
    setUpCommonFunctionality({
      entryName: 'testApp',
    });
    expect(downtimeNotificationActions.getScheduledDowntime.called).to.be.false;
  });

  it('should fetch scheduled downtimes if preloadScheduledDowntimes is true', () => {
    setUpCommonFunctionality({
      entryName: 'testApp',
      preloadScheduledDowntimes: true,
    });
    expect(downtimeNotificationActions.getScheduledDowntime.called).to.be.true;
  });

  it('should throw an error if url ends with a slash', () => {
    expect(() =>
      setUpCommonFunctionality({
        entryName: 'testApp',
        url: '/foo/',
      }),
    ).to.throw(
      'Root urls should not end with a slash. Check your manifest.json file and application entry file.',
    );
  });

  it('should initialize sitewide components', () => {
    setUpCommonFunctionality({ entryName: 'testApp' });
    expect(Sentry.withScope.called).to.be.true;
  });
});
