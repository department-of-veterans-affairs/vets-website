import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';

import { commonReducer } from 'platform/startup/store';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';
import { mockApiRequest, resetFetch } from 'platform/testing/unit/helpers';

import Form526Entry, {
  serviceRequired,
  idRequired,
  isIntroPage,
} from '../../Form526EZApp';
import reducers from '../../reducers';
import {
  MVI_ADD_INITIATED,
  MVI_ADD_SUCCEEDED,
  MVI_ADD_FAILED,
} from '../../actions';
import { WIZARD_STATUS, SERVICE_BRANCHES } from '../../constants';
import { getBranches, clearBranches } from '../../utils/serviceBranches';
import formConfig from '../../config/form';

const fakeSipsIntro = user => {
  const { profile, login } = user;
  if (!login.currentlyLoggedIn) {
    return 'Log in to continue';
  }
  if (!profile.verified) {
    return 'Need to be verified';
  }
  // 'Not authorized' shouldn't be seen (an alert will show instead)
  return profile.services.length ? 'Start the form' : 'Not authorized';
};

describe('Form 526EZ Entry Page', () => {
  let gaData;
  const getLastEvent = (index = -1) => gaData[gaData.length + index];
  const testPage = ({
    verified = false,
    currentlyLoggedIn = true,
    services = [],
    savedForms = [],
    mvi = '',
    show526Wizard = true,
    dob = '2000-01-01',
    pathname = '/introduction',
    router = [],
    addBranches = true,
    claims = [],
    loadedStatus = 'success',
    savedStatus = '',
    itfMessageDismissed = false,
    sideNavEnabled = false,
  } = {}) => {
    const initialState = {
      form: {
        loadedStatus,
        savedStatus,
        loadedData: {
          metadata: {
            inProgressFormId: '234',
          },
        },
        data: {
          veteranFullName: {
            first: 'John',
            last: 'Doe',
          },
        },
      },
      itf: {
        fetchCallState: 'notCalled',
        creationCallState: 'notCalled',
        currentITF: null,
        previousITF: null,
        messageDismissed: itfMessageDismissed,
      },
      user: {
        login: {
          currentlyLoggedIn,
        },
        profile: {
          verified,
          services,
          loading: false,
          status: '',
          dob,
          accountUuid: 'uuid',
          claims,
        },
      },
      currentLocation: {
        pathname,
        search: '',
      },
      mvi: {
        addPersonState: mvi,
      },
      featureToggles: {
        show526Wizard,
        disability526SidenavEnabled: sideNavEnabled,
      },
    };
    const fakeStore = createStore(
      combineReducers({
        ...commonReducer,
        ...reducers,
      }),
      initialState,
    );
    window.dataLayer = [];
    gaData = global.window.dataLayer;
    if (addBranches && currentlyLoggedIn) {
      // stop fetchBranches call
      sessionStorage.setItem(SERVICE_BRANCHES, '["1","2","3"]');
    }
    return mount(
      <Provider store={fakeStore}>
        <Form526Entry
          location={initialState.currentLocation}
          user={initialState.user}
          showWizard={initialState.showWizard}
          router={router}
          savedForms={savedForms}
        >
          <main>
            <h1>{fakeSipsIntro(initialState.user)}</h1>
          </main>
        </Form526Entry>
      </Provider>,
    );
  };

  const mockBranches = {
    items: [{ description: '1' }, { description: '2' }, { description: '3' }],
  };

  beforeEach(() => {
    sessionStorage.removeItem(WIZARD_STATUS);
    clearBranches();
  });

  // Not logged in
  it('should render content when not logged in', () => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    const tree = testPage({
      currentlyLoggedIn: false,
    });
    expect(tree.find('h1').text()).to.contain('Log in');
    expect(tree.find('RoutedSavableApp')).to.have.lengthOf(1);
    expect(tree.find('main').text()).to.contain('Log in');
    tree.unmount();
  });
  it('should redirect to the intro page when on a different page & not logged in', () => {
    const router = [];
    const tree = testPage({
      currentlyLoggedIn: false,
      pathname: '/something-else',
      router,
    });
    expect(router[0]).to.equal('/introduction');
    tree.unmount();
  });

  describe('Missing user identifiers', () => {
    // claims.form526RequiredIdentifierPresence is included in the profile when the form_526_required_identifiers_in_user_object feature flag is enabled on the back end
    describe('When there is no form526RequiredIdentifierPresence object in the profile claims object', () => {
      // Logged in & verified, but missing ID
      it('should render Missing ID page', () => {
        sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
        const tree = testPage({
          currentlyLoggedIn: true,
          verified: true,
          services: [],
        });

        expect(tree.find('main')).to.have.lengthOf(0);
        expect(tree.find('h1').text()).to.contain('File for disability');
        expect(tree.find('va-alert')).to.have.lengthOf(1);
        expect(tree.find('va-alert').text()).to.contain('BIRLS ID');
        const recordedEvent = getLastEvent();
        expect(recordedEvent.event).to.equal('visible-alert-box');
        expect(recordedEvent['error-key']).to.include('birls_id');
        tree.unmount();
      });

      // Logged in & verified, but missing 526 services
      it('should render Missing services page', () => {
        sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
        const tree = testPage({
          currentlyLoggedIn: true,
          verified: true,
          // only include 'EVSS_CLAIMS' service
          services: [idRequired[0]],
        });

        expect(tree.find('main')).to.have.lengthOf(0);
        expect(tree.find('h1').text()).to.contain('File for disability');
        expect(tree.find('va-alert')).to.have.lengthOf(1);
        expect(tree.find('va-alert').text()).to.contain(
          'need some information',
        );
        const recordedEvent = getLastEvent();
        expect(recordedEvent.event).to.equal('visible-alert-box');
        expect(recordedEvent['error-key']).to.include('missing_526');
        tree.unmount();
      });

      // Logged in & verified, but missing DOB
      it('should render Missing DOB alert', () => {
        sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
        const tree = testPage({
          currentlyLoggedIn: true,
          verified: true,
          // only include 'EVSS_CLAIMS' service
          services: [idRequired[0]],
          dob: '',
        });
        expect(tree.find('main')).to.have.lengthOf(0);
        expect(tree.find('h1').text()).to.contain('File for disability');
        expect(tree.find('va-alert')).to.have.lengthOf(1);
        expect(tree.find('va-alert').text()).to.contain('your date of birth');
        const recordedEvent = getLastEvent();
        expect(recordedEvent.event).to.equal('visible-alert-box');
        expect(recordedEvent['error-key']).to.include('missing_dob');
        tree.unmount();
      });
    });

    // claims.form526RequiredIdentifierPresence is included in the profile when the form_526_required_identifiers_in_user_object feature flag is enabled on the back end
    describe('When a form526RequiredIdentifierPresence object is in the profile claims object', () => {
      it('should render Missing identifers page and log an event in Google Analytics', () => {
        sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
        const tree = testPage({
          verified: true,
          claims: {
            form526RequiredIdentifierPresence: {
              participantId: false,
              birlsId: true,
              ssn: false,
              birthDate: true,
              edipi: false,
            },
          },
        });

        expect(tree.find('va-alert')).to.have.lengthOf(1);
        expect(tree.find('va-alert').text()).to.contain(
          'We’re missing your Participant ID, Social Security Number, and EDIPI',
        );

        const recordedEvent = getLastEvent();
        expect(recordedEvent.event).to.equal('visible-alert-box');
        expect(recordedEvent['error-key']).to.include(
          'missing_526_identifiers_participantId_ssn_edipi',
        );
        tree.unmount();
      });
    });
  });

  it('should render loading indicator when feature is undefined', () => {
    sessionStorage.removeItem(WIZARD_STATUS);
    const initialState = {
      form: {
        loadedStatus: 'success',
        savedStatus: '',
        loadedData: { metadata: {} },
      },
      itf: {
        fetchCallState: 'notCalled',
        creationCallState: 'notCalled',
        currentITF: null,
        previousITF: null,
        messageDismissed: false,
      },
      user: {
        login: { currentlyLoggedIn: false },
        profile: { verified: false, services: [], loading: false, status: '' },
      },
      currentLocation: { pathname: '/introduction', search: '' },
      mvi: { addPersonState: '' },
    };
    const fakeStore = createStore(
      combineReducers({
        ...commonReducer,
        ...reducers,
      }),
      initialState,
    );
    window.dataLayer = [];
    gaData = global.window.dataLayer;
    const tree = mount(
      <Provider store={fakeStore}>
        <Form526Entry
          location={initialState.currentLocation}
          user={initialState.user}
          router={[]}
        >
          <main>
            <h1>{fakeSipsIntro(initialState.user)}</h1>
          </main>
        </Form526Entry>
      </Provider>,
    );
    expect(tree.find('va-loading-indicator')).to.have.lengthOf(1);
    expect(tree.find('WizardContainer')).to.have.lengthOf(0);
    tree.unmount();
  });

  // Logged in & verified & has services
  it('should render form app content', done => {
    mockApiRequest(mockBranches);
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    const tree = testPage({
      currentlyLoggedIn: true,
      verified: true,
      services: serviceRequired,
      addBranches: false,
    });
    expect(tree.find('main')).to.have.lengthOf(1);
    expect(tree.find('h1').text()).to.contain('Start the form');
    setTimeout(() => {
      expect(getBranches().length).to.eq(3);
      resetFetch();
      clearBranches();
      tree.unmount();
      done();
    });
  });

  // Logged in & not verified (has services to allow proceeding)
  it('should render verify your identity page', () => {
    window.localStorage.setItem('hasSession', true);
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    const tree = testPage({
      currentlyLoggedIn: true,
      verified: false,
      services: serviceRequired,
    });
    window.localStorage.removeItem('hasSession');
    // When user is not verified, it should render the content with RequiredLoginView
    expect(tree.find('article#form-526')).to.have.lengthOf(1);
    expect(tree.find('RequiredLoginView')).to.have.lengthOf(1);
    // The verify prop on RequiredLoginView should show verification message
    expect(tree.find('RequiredLoginView').prop('verify')).to.be.true;

    tree.unmount();
  });

  // Logged in but has add-person service (missing BIRLS or participant ID)
  it('should render add-person loader', () => {
    window.localStorage.setItem('hasSession', true);
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    const tree = testPage({
      currentlyLoggedIn: true,
      verified: true,
      services: ['add-person'],
      mvi: MVI_ADD_INITIATED,
    });
    window.localStorage.removeItem('hasSession');

    expect(tree.find('h1').text()).to.contain('File for disability');
    expect(tree.find('main')).to.have.lengthOf(0);
    expect(tree.find('va-loading-indicator')).to.have.lengthOf(1);
    expect(tree.find('va-loading-indicator').html()).to.contain(
      'additional work',
    );
    tree.unmount();
  });

  // Logged in, has add-person service (missing BIRLS or participant ID), but
  // succeeded in adding id
  it('should render intro page after successful add person', () => {
    window.localStorage.setItem('hasSession', true);
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    const tree = testPage({
      currentlyLoggedIn: true,
      verified: true,
      services: ['add-person', ...serviceRequired],
      mvi: MVI_ADD_SUCCEEDED,
    });
    window.localStorage.removeItem('hasSession');
    expect(tree.find('main')).to.have.lengthOf(1);
    expect(tree.find('h1').text()).to.contain('Start the form');
    tree.unmount();
  });

  // Logged in & failed add person call
  it('should render Missing services page after failed add person call', () => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    const tree = testPage({
      currentlyLoggedIn: true,
      verified: true,
      services: ['add-person'],
      mvi: MVI_ADD_FAILED,
    });
    expect(tree.find('h1').text()).to.contain('File for disability');
    expect(tree.find('main')).to.have.lengthOf(0);
    expect(tree.find('va-alert')).to.have.lengthOf(1);
    expect(tree.find('va-alert p').text()).to.contain(
      'We need more information',
    );
    const recordedEvent = getLastEvent();
    expect(recordedEvent.event).to.equal('visible-alert-box');
    expect(recordedEvent['error-key']).to.include(
      'missing_526_or_original_claims_service',
    );
    tree.unmount();
  });

  // Wizard
  it('should not redirect to the wizard when not logged in', () => {
    sessionStorage.removeItem(WIZARD_STATUS);
    const tree = testPage({
      currentlyLoggedIn: false,
    });
    expect(tree.find('h1').text()).to.contain('Log in');
    tree.unmount();
  });
  it('should redirect to the wizard when logged in', () => {
    window.localStorage.setItem('hasSession', true);
    sessionStorage.removeItem(WIZARD_STATUS);
    const router = [];
    const tree = testPage({
      currentlyLoggedIn: true,
      router,
    });
    expect(tree.find('va-loading-indicator').html()).to.contain(
      'restart the app',
    );
    expect(router[0]).to.equal('/start');
    tree.unmount();
  });
  it('should not redirect to the wizard there is a saved form', () => {
    sessionStorage.removeItem(WIZARD_STATUS);
    const tree = testPage({
      currentlyLoggedIn: false,
      show526Wizard: false,
      savedForms: [formConfig.formId],
    });
    expect(tree.find('h1').text()).to.contain('Log in');
    tree.unmount();
  });
  it('should redirect to the wizard when restarting', () => {
    sessionStorage.removeItem(WIZARD_STATUS);
    const tree = testPage({
      currentlyLoggedIn: false,
      show526Wizard: false,
    });
    expect(tree.find('h1').text()).to.contain('Log in');
    tree.unmount();
  });
  it('should render loading indicator when feature is undefined', () => {
    sessionStorage.removeItem(WIZARD_STATUS);
    const initialState = {
      form: {
        loadedStatus: 'success',
        savedStatus: '',
        loadedData: { metadata: {} },
      },
      itf: {
        fetchCallState: 'notCalled',
        creationCallState: 'notCalled',
        currentITF: null,
        previousITF: null,
        messageDismissed: false,
      },
      user: {
        login: { currentlyLoggedIn: false },
        profile: { verified: false, services: [], loading: false, status: '' },
      },
      currentLocation: { pathname: '/introduction', search: '' },
      mvi: { addPersonState: '' },
    };
    const fakeStore = createStore(
      combineReducers({
        ...commonReducer,
        ...reducers,
      }),
      initialState,
    );
    window.dataLayer = [];
    gaData = global.window.dataLayer;
    const tree = mount(
      <Provider store={fakeStore}>
        <Form526Entry
          location={initialState.currentLocation}
          user={initialState.user}
          router={[]}
        >
          <main>
            <h1>{fakeSipsIntro(initialState.user)}</h1>
          </main>
        </Form526Entry>
      </Provider>,
    );
    expect(tree.find('va-loading-indicator')).to.have.lengthOf(1);
    expect(tree.find('WizardContainer')).to.have.lengthOf(0);
    tree.unmount();
  });

  describe('isIntroPage', () => {
    it('should return false when no pathname param', () => {
      expect(isIntroPage()).to.be.false;
    });
  });

  describe('Side navigation feature', () => {
    it('should not render ClaimFormSideNav when feature is disabled', () => {
      sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
      const tree = testPage({
        verified: true,
        services: serviceRequired,
        sideNavEnabled: false,
      });
      expect(tree.find('ClaimFormSideNav')).to.have.lengthOf(0);
      tree.unmount();
    });

    it('should hide ClaimFormSideNav when ITF message not dismissed', () => {
      sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
      const tree = testPage({
        verified: true,
        services: serviceRequired,
        sideNavEnabled: true,
        itfMessageDismissed: false,
        pathname: '/veteran-information',
      });
      expect(tree.find('ClaimFormSideNav')).to.have.lengthOf(0);
      tree.unmount();
    });

    it('should hide ClaimFormSideNav on introduction page', () => {
      sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
      const tree = testPage({
        verified: true,
        services: serviceRequired,
        sideNavEnabled: true,
        itfMessageDismissed: true,
        pathname: '/introduction',
      });
      expect(tree.find('ClaimFormSideNav')).to.have.lengthOf(0);
      tree.unmount();
    });

    it('should hide ClaimFormSideNav on confirmation page', () => {
      sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
      const tree = testPage({
        verified: true,
        services: serviceRequired,
        sideNavEnabled: true,
        itfMessageDismissed: true,
        pathname: '/confirmation',
      });
      expect(tree.find('ClaimFormSideNav')).to.have.lengthOf(0);
      tree.unmount();
    });

    it('should hide ClaimFormSideNav on form-saved page', () => {
      sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
      const tree = testPage({
        verified: true,
        services: serviceRequired,
        sideNavEnabled: true,
        itfMessageDismissed: true,
        pathname: '/form-saved',
      });
      expect(tree.find('ClaimFormSideNav')).to.have.lengthOf(0);
      tree.unmount();
    });
  });
});
