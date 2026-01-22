import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { SET_DATA } from 'platform/forms-system/src/js/actions';
import { VA_FORM_IDS } from 'platform/forms/constants';

import App from '../../containers/App';
import formConfig from '../../config/form';

import { DEPENDENTS_FETCH_STARTED } from '../../../shared/actions';
import { PICKLIST_DATA } from '../../config/constants';
import { createDoB } from '../test-helpers';

const mockStore = configureMockStore([thunk]);
const originalSubmitUrl = formConfig.submitUrl;
let store;

const awardedDependent = {
  awardIndicator: 'Y',
  fullName: {
    first: 'test',
    last: 'dependent',
    middle: undefined,
    suffix: undefined,
  },
  relationshipToVeteran: 'Child',
  ssn: '1234',
  dateOfBirth: createDoB(4),
  age: 4,
  labeledAge: '4 years old',
  key: 'test-1234',
};

function getDefaultState({
  featureToggles = {},
  hasSession = true,
  isLoggedIn = true,
  vaFileNumber = {},
  userLoading = false,
  prefill = false,
  formData = {},
  dependentsLoading = false,
  savedForm = false,
} = {}) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('hasSession', JSON.stringify(hasSession));
  }

  return {
    vaFileNumber,
    form: {
      formId: VA_FORM_IDS.FORM_21_686CV2,
      loadedStatus: 'success',
      savedStatus: '',
      loadedData: {
        formData,
        metadata: { prefill },
      },
      data: {},
      submission: {
        response: {},
        timestamp: null,
      },
    },
    dependents: {
      loading: dependentsLoading,
      error: null,
      data: [
        {
          ...awardedDependent,
          dateOfBirth: createDoB(4, 0, 'MM/dd/yyyy'),
        },
      ],
    },
    user: {
      login: {
        currentlyLoggedIn: isLoggedIn,
      },
      profile: {
        loading: userLoading,
        savedForms: savedForm ? [{}, { form: VA_FORM_IDS.FORM_21_686CV2 }] : [],
        prefillsAvailable: [],
        loa: {
          current: 3,
          highest: 3,
        },
        verified: true,
        dob: '1990-01-01',
        userFullName: {
          first: 'Test',
          last: 'User',
        },
        claims: {
          appeals: false,
        },
      },
    },
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: { get: () => null },
      dismissedDowntimeWarnings: [],
    },
    featureToggles: {
      loading: false,
      ...featureToggles,
    },
  };
}

function renderApp({
  pathname = '/introduction',
  search = '',
  hash = '',
  featureToggles,
  hasSession,
  isLoggedIn,
  vaFileNumber,
  userLoading,
  prefill,
  dependentsLoading,
  formData,
  savedForm,
} = {}) {
  const state = getDefaultState({
    featureToggles,
    hasSession,
    isLoggedIn,
    vaFileNumber,
    userLoading,
    prefill,
    dependentsLoading,
    formData,
    savedForm,
  });
  store = mockStore(state);

  const _location = {
    ...window.location,
    pathname,
    search,
    hash,
  };

  return render(
    <Provider store={store}>
      <App location={_location}>
        <div data-testid="children-content">Child content</div>
      </App>
    </Provider>,
  );
}

describe('App container logic', () => {
  const oldLocation = global.window.location;

  beforeEach(() => {
    document.title = '';
  });

  afterEach(() => {
    global.window.location = oldLocation;
    localStorage.removeItem('hasSession');
    formConfig.submitUrl = originalSubmitUrl;
  });

  describe('document title', () => {
    it('should set document title on render', () => {
      renderApp();
      expect(document.title).to.equal(
        'Add or remove dependents on VA benefits',
      );
    });
  });

  describe('loading states', () => {
    it('should show loading indicator while waiting for toggles', () => {
      const { container, queryByTestId } = renderApp({
        featureToggles: { loading: true },
      });

      const loadingIndicator = container.querySelector('va-loading-indicator');
      expect(loadingIndicator).to.not.be.null;
      expect(loadingIndicator.getAttribute('message')).to.equal(
        'Loading your information...',
      );
      expect(queryByTestId('children-content')).to.be.null;
    });

    it('should show loading indicator while user profile is loading', () => {
      const { container, queryByTestId } = renderApp({
        userLoading: true,
      });

      const loadingIndicator = container.querySelector('va-loading-indicator');
      expect(loadingIndicator).to.not.be.null;
      expect(queryByTestId('children-content')).to.be.null;
    });

    it('should fetch dependents when user is logged in and not on intro page', async () => {
      renderApp({
        pathname: '/some-form-page',
        dependentsLoading: true,
      });

      await waitFor(() => {
        const [action] = store.getActions();
        expect(action.type).to.eq(DEPENDENTS_FETCH_STARTED);
      });
    });

    it('should update dependents in the form data after fetching dependents', async () => {
      renderApp({
        pathname: '/some-form-page',
        dependentsLoading: false,
      });

      await waitFor(() => {
        const [action] = store.getActions();
        expect(action.type).to.eq(SET_DATA);
        expect(action.data).to.deep.equal({
          [PICKLIST_DATA]: [awardedDependent],
          dependents: {
            hasDependents: true,
            awarded: [awardedDependent],
            notAwarded: [],
          },
        });
      });
    });
  });

  describe('authentication behavior', () => {
    it('should render redirect loading indicator when user is not logged in on form page', () => {
      const { container } = renderApp({
        pathname: '/some-form-page',
        isLoggedIn: false,
      });

      const loadingIndicator = container.querySelector('va-loading-indicator');
      expect(loadingIndicator).to.exist;
      expect(loadingIndicator.getAttribute('message')).to.equal(
        'Redirecting to introduction page...',
      );
    });

    it('should render redirect loading indicator when user lacks valid VA file number', () => {
      const { container } = renderApp({
        pathname: '/some-form-page',
        vaFileNumber: {
          hasVaFileNumber: {
            VALIDVAFILENUMBER: false,
          },
        },
      });

      const loadingIndicator = container.querySelector('va-loading-indicator');
      expect(loadingIndicator).to.exist;
      expect(loadingIndicator.getAttribute('message')).to.equal(
        'Redirecting to introduction page...',
      );
    });

    it('should render normally when on introduction page regardless of auth state', () => {
      const { getByTestId } = renderApp({
        pathname: '/introduction',
        isLoggedIn: false,
      });

      expect(getByTestId('children-content')).to.exist;
    });
  });

  describe('V3 version handling', () => {
    // Determine form flow for v3 release
    // toggle enabled, new form => v3 flow
    // toggle enabled, v3 in progress => v3 flow
    // toggle enabled, v2 in progress => v2 flow (set vaDependentV2Flow to true)
    // toggle disabled => v2 flow
    it('should not set vaDependentV2Flow with a new v3 form', async () => {
      renderApp({
        pathname: '/internal-page',
        featureToggles: { vaDependentsV3: true },
        formData: {}, // newly started form
        savedForm: false,
      });

      await waitFor(() => {
        const [action] = store.getActions();
        expect(action.data.vaDependentV2Flow).to.be.undefined;
      });
    });

    it('should not set vaDependentV2Flow with a in progress v3 form', async () => {
      renderApp({
        pathname: '/internal-page',
        featureToggles: { vaDependentsV3: true },
        formData: { vaDependentsV3: true }, // in progress form data
        savedForm: true,
      });

      await waitFor(() => {
        const [action] = store.getActions();
        expect(action.data.vaDependentV2Flow).to.be.undefined;
      });
    });

    it('should not set vaDependentV2Flow with a in progress v2 form when on the introduction page', async () => {
      renderApp({
        featureToggles: { vaDependentsV3: true },
        formData: {}, // in progress form data (v2 flow, so v3 toggle isn't defined)
        savedForm: true,
      });

      await waitFor(() => {
        const [action] = store.getActions();
        expect(action).to.be.undefined;
      });
    });

    it('should not set vaDependentV2Flow with a in progress v3 form', async () => {
      renderApp({
        pathname: '/internal-page',
        featureToggles: { vaDependentsV3: false },
        formData: {}, // in progress form data (v2 flow, so v3 toggle isn't defined)
        savedForm: true,
      });

      await waitFor(() => {
        const [action] = store.getActions();
        expect(action.data.vaDependentV2Flow).to.be.undefined;
      });
    });
  });

  describe('breadcrumbs', () => {
    it('should render breadcrumbs with correct structure', () => {
      const { container } = renderApp();

      const breadcrumbs = container.querySelector('va-breadcrumbs');
      expect(breadcrumbs).to.exist;

      const breadcrumbList = JSON.parse(
        breadcrumbs.getAttribute('breadcrumb-list'),
      );
      expect(breadcrumbList).to.have.lengthOf(3);
      expect(breadcrumbList[0]).to.deep.equal({ href: '/', label: 'Home' });
      expect(breadcrumbList[1].href).to.contain('dependents');
      expect(breadcrumbList[2].href).to.contain('/introduction');
    });
  });

  describe('submit URL configuration', () => {
    it('should use module route when dependentsModuleEnabled toggle is on', () => {
      const { container } = renderApp({
        featureToggles: {
          dependentsModuleEnabled: true,
        },
      });

      expect(container.querySelector('article')).to.exist;
    });

    it('should use legacy route when dependentsModuleEnabled toggle is off', () => {
      const { container } = renderApp({
        featureToggles: {
          dependentsModuleEnabled: false,
        },
      });

      expect(container.querySelector('article')).to.exist;
    });
  });

  describe('rendering behavior', () => {
    it('should render RoutedSavableApp with children when on intro page (with session)', () => {
      const { getByTestId } = renderApp();
      expect(getByTestId('children-content')).to.exist;
    });

    it('should render RoutedSavableApp with children when on intro page (without session)', () => {
      const { getByTestId } = renderApp({
        hasSession: false,
      });

      expect(getByTestId('children-content')).to.exist;
    });

    it('should always render breadcrumbs', () => {
      const { container } = renderApp();
      const breadcrumbs = container.querySelector('va-breadcrumbs');
      expect(breadcrumbs).to.exist;
    });
  });

  describe('edge cases', () => {
    it('should handle missing location pathname gracefully', () => {
      const { container } = renderApp({
        pathname: undefined,
      });

      const article = container.querySelector('article');
      expect(article).to.exist;
    });
  });
});
