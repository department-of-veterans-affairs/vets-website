import React from 'react';
import { expect } from 'chai';
import { externalServiceStatus } from '~/platform/monitoring/DowntimeNotification';
import { SaveInProgressIntroLink } from '../../containers/SaveInProgressIntroLink';

const baseProps = {
  fetchInProgressForm: () => {},
  removeInProgressForm: () => {},
  toggleLoginModal: () => {},
  formId: 'test-form',
  pageList: [{ path: 'introduction' }, { path: 'start' }],
  formConfig: {
    signInHelpList: null,
    customText: { appType: 'application', appAction: 'applying' },
  },
  prefillEnabled: true,
  headingLevel: 2,
  startText: 'Start application',
  unauthStartText: 'Sign in to start your application',
  messages: {},
  migrations: [],
  resumeOnly: false,
  buttonOnly: false,
  retentionPeriod: '60 days',
  retentionPeriodStart: 'when you start',
  user: {
    profile: {
      loading: false,
      prefillsAvailable: ['test-form'],
      savedForms: [],
    },
    login: {
      currentlyLoggedIn: false,
    },
  },
};

describe('SaveInProgressIntroLink — internal methods coverage', () => {
  it('getAlert: logged-in + expired savedForm sets includesFormControls=false', () => {
    const past = Math.floor(Date.now() / 1000) - 60;
    const savedForm = { metadata: { expiresAt: past }, lastUpdated: past };
    const props = {
      ...baseProps,
      user: {
        profile: { prefillsAvailable: [], loading: false },
        login: { currentlyLoggedIn: true },
      },
    };
    const inst = new SaveInProgressIntroLink(props);
    const { includesFormControls } = inst.getAlert(savedForm);
    expect(includesFormControls).to.be.false;
  });

  it('getAlert: logged-in + no savedForm + prefillAvailable shows info alert', () => {
    const props = {
      ...baseProps,
      user: {
        profile: { prefillsAvailable: ['test-form'], loading: false },
        login: { currentlyLoggedIn: true },
      },
    };
    const inst = new SaveInProgressIntroLink(props);
    const { includesFormControls, alert } = inst.getAlert(null);
    expect(includesFormControls).to.be.false;
    expect(React.isValidElement(alert)).to.be.true;
  });

  it('getAlert: logged-in + verifiedPrefillAlert takes precedence', () => {
    const verifiedAlert = <div data-testid="verified" />;
    const props = {
      ...baseProps,
      verifiedPrefillAlert: verifiedAlert,
      user: {
        profile: { prefillsAvailable: ['test-form'], loading: false },
        login: { currentlyLoggedIn: true },
      },
    };
    const inst = new SaveInProgressIntroLink(props);
    const { alert } = inst.getAlert(null);
    expect(alert).to.equal(verifiedAlert);
  });

  it('getAlert: not logged-in + renderSignInMessage branch', () => {
    let called = false;
    const renderSignInMessage = pref => {
      called = pref;
      return <span data-testid="signin" />;
    };
    const props = {
      ...baseProps,
      renderSignInMessage,
      prefillEnabled: true,
      user: {
        profile: { prefillsAvailable: [], loading: false },
        login: { currentlyLoggedIn: false },
      },
    };
    const inst = new SaveInProgressIntroLink(props);
    const { alert } = inst.getAlert(null);
    expect(called).to.be.true;
    expect(React.isValidElement(alert)).to.be.true;
  });

  it('getStartPage: returns second path when no pathname', () => {
    const props = {
      ...baseProps,
      pageList: [{ path: 'one' }, { path: 'two' }],
    };
    const inst = new SaveInProgressIntroLink(props);
    expect(inst.getStartPage()).to.equal('two');
  });

  it('getStartPage: returns next page when pathname provided', () => {
    const props = {
      ...baseProps,
      pageList: [{ path: 'intro' }, { path: 'next' }],
      pathname: 'intro',
    };
    const inst = new SaveInProgressIntroLink(props);
    expect(inst.getStartPage()).to.equal('next');
  });

  it('openLoginModal: calls toggleLoginModal with (true, "cta-form")', () => {
    let args = null;
    const props = {
      ...baseProps,
      toggleLoginModal: (...a) => {
        args = a;
      },
    };
    const inst = new SaveInProgressIntroLink(props);
    inst.openLoginModal();
    expect(args).to.deep.equal([true, 'cta-form']);
  });

  it('renderDowntime: returns children when service is up', () => {
    const inst = new SaveInProgressIntroLink(baseProps);
    const result = inst.renderDowntime(
      { status: externalServiceStatus.up },
      'KEEP_ME',
    );
    expect(result).to.equal('KEEP_ME');
  });

  it('renderDowntime: returns a React element when service is down', () => {
    const customMsg = () => <div data-testid="down" />;
    const props = { ...baseProps, downtime: { message: customMsg } };
    const inst = new SaveInProgressIntroLink(props);
    const result = inst.renderDowntime(
      { status: externalServiceStatus.down },
      'IGNORED',
    );
    expect(React.isValidElement(result)).to.be.true;
  });
});
