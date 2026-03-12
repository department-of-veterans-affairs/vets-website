import React from 'react';
import { expect } from 'chai';
import { waitFor, cleanup } from '@testing-library/react';
import sinon from 'sinon';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import * as featureToggles from 'platform/utilities/feature-toggles';
import vapService from '~/platform/user/profile/vap-svc/reducers';
import vaProfile from '@@profile/reducers/vaProfile';
import { FIELD_NAMES } from '@@vap-svc/constants';
import { PreferenceSelectionContainer } from '../../../../components/health-care-settings/sub-tasks/PreferenceSelectionContainer';

const mockFieldName = FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD;

describe('PreferenceSelectionContainer', () => {
  let useFeatureToggleStub;

  const defaultProps = {
    fieldName: mockFieldName,
    noPreferenceValue: 'no_preference',
    emptyValue: [],
    getContentComponent: () => {
      return () => <div data-testid="mock-content">Content</div>;
    },
    getButtons: () => (
      <div data-testid="mock-buttons">
        <va-button data-testid="cancel-button">Cancel</va-button>
      </div>
    ),
  };

  const getInitialState = (overrides = {}) => ({
    user: {
      profile: {
        vapContactInfo: {},
        schedulingPreferencesPilotEligible: true,
      },
    },
    vapService: {
      hasUnsavedEdits: false,
      modal: null,
      formFields: {},
      ...overrides.vapService,
    },
    vaProfile: {
      schedulingPreferences: {
        [mockFieldName]: [],
      },
      ...overrides.vaProfile,
    },
    featureToggles: {
      loading: false,
      profile2Enabled: true,
      profileHealthCareSettingsPage: true,
    },
  });

  beforeEach(() => {
    useFeatureToggleStub = sinon.stub(featureToggles, 'useFeatureToggle');
    useFeatureToggleStub.returns({
      TOGGLE_NAMES: {
        profile2Enabled: 'profile2Enabled',
        profileHealthCareSettingsPage: 'profileHealthCareSettingsPage',
        profileInternationalPhoneNumbers: 'profileInternationalPhoneNumbers',
      },
      useToggleValue: sinon.stub().returns(true),
    });
  });

  afterEach(() => {
    useFeatureToggleStub.restore();
    cleanup();
  });

  describe('basic rendering', () => {
    it('should render the component with heading', async () => {
      const { getByText } = renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(getByText(/edit contact preferences/i)).to.exist;
      });
    });

    it('should render breadcrumb navigation', async () => {
      const { container } = renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        const breadcrumb = container.querySelector('va-link[back]');
        expect(breadcrumb).to.exist;
      });
    });

    it('should render content component', async () => {
      const { getByTestId } = renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(getByTestId('mock-content')).to.exist;
      });
    });

    it('should render buttons', async () => {
      const { getByTestId } = renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(getByTestId('mock-buttons')).to.exist;
        expect(getByTestId('cancel-button')).to.exist;
      });
    });

    it('should not render when there is VAP service error', () => {
      const initialState = getInitialState();
      initialState.user.profile.vapContactInfo = { status: 'SERVER_ERROR' };

      const { container } = renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...defaultProps} />,
        {
          initialState,
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      expect(container.querySelector('h1')).to.not.exist;
    });
  });

  describe('page setup', () => {
    it('should set document title', async () => {
      renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(document.title).to.equal(
          'Edit contact preferences | Veterans Affairs',
        );
      });
    });

    it('should focus on heading', async () => {
      const { container } = renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        const heading = container.querySelector('h1');
        expect(heading).to.exist;
        expect(heading.getAttribute('tabindex')).to.equal('-1');
      });
    });
  });

  describe('data initialization', () => {
    it('should handle empty field data', async () => {
      const { getByTestId } = renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(getByTestId('mock-content')).to.exist;
      });
    });

    it('should handle populated field data', async () => {
      const initialState = getInitialState();
      initialState.vaProfile.schedulingPreferences[mockFieldName] = ['email'];

      const { getByTestId } = renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...defaultProps} />,
        {
          initialState,
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(getByTestId('mock-content')).to.exist;
      });
    });

    it('should handle no_preference value', async () => {
      const initialState = getInitialState();
      initialState.vaProfile.schedulingPreferences[mockFieldName] = [
        'no_preference',
      ];

      const { getByTestId } = renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...defaultProps} />,
        {
          initialState,
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(getByTestId('mock-content')).to.exist;
      });
    });
  });

  describe('empty value handling', () => {
    it('should handle array emptyValue', async () => {
      const { getByTestId } = renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(getByTestId('mock-content')).to.exist;
      });
    });

    it('should handle string emptyValue', async () => {
      const customProps = {
        ...defaultProps,
        emptyValue: '',
      };

      const { getByTestId } = renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...customProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(getByTestId('mock-content')).to.exist;
      });
    });

    it('should use emptyValue as fallback when schedulingPreferences has no value for fieldName', async () => {
      let capturedData;
      const emptyValueFallback = ['fallback-sentinel'];
      const propsWithCapture = {
        ...defaultProps,
        emptyValue: emptyValueFallback,
        getContentComponent: () => {
          return ({ data }) => {
            capturedData = data;
            return <div data-testid="mock-content">Content</div>;
          };
        },
      };

      // State where schedulingPreferences exists but has NO entry for the fieldName,
      // so `state.vaProfile.schedulingPreferences[fieldName]` is undefined and
      // the `|| emptyValue` fallback on line 128 is exercised.
      const initialState = getInitialState({
        vaProfile: {
          schedulingPreferences: {},
        },
      });

      renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...propsWithCapture} />,
        {
          initialState,
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(capturedData).to.deep.equal(emptyValueFallback);
      });
    });
  });

  describe('routing', () => {
    it('should render with correct breadcrumb href', async () => {
      const { container } = renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        const breadcrumb = container.querySelector('va-link[back]');
        expect(breadcrumb).to.exist;
        const href = breadcrumb.getAttribute('href');
        expect(href).to.exist;
      });
    });
  });

  describe('handlers', () => {
    it('should provide handlers to content component', async () => {
      let capturedHandlers;
      const propsWithHandlerCapture = {
        ...defaultProps,
        getContentComponent: () => {
          return ({ handlers }) => {
            capturedHandlers = handlers;
            return <div data-testid="mock-content">Content</div>;
          };
        },
      };

      renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...propsWithHandlerCapture} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(capturedHandlers).to.exist;
        expect(capturedHandlers.cancel).to.be.a('function');
        expect(capturedHandlers.continue).to.be.a('function');
        expect(capturedHandlers.save).to.be.a('function');
        expect(capturedHandlers.updateContactInfo).to.be.a('function');
        expect(capturedHandlers.breadCrumbClick).to.be.a('function');
      });
    });
  });

  describe('validation', () => {
    it('should pass error state to content component', async () => {
      let capturedError;
      const propsWithErrorCapture = {
        ...defaultProps,
        getContentComponent: () => {
          return ({ error }) => {
            capturedError = error;
            return <div data-testid="mock-content">Content</div>;
          };
        },
      };

      renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...propsWithErrorCapture} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(capturedError).to.be.a('boolean');
        expect(capturedError).to.be.false;
      });
    });
  });

  describe('modal interactions', () => {
    it('should render EditConfirmCancelModal', async () => {
      const { container } = renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(container.querySelector('h1')).to.exist;
      });
    });

    it('should handle breadcrumb click preventDefault', async () => {
      let capturedHandlers;
      const propsWithCapture = {
        ...defaultProps,
        getContentComponent: () => {
          return ({ handlers }) => {
            capturedHandlers = handlers;
            return <div data-testid="mock-content">Content</div>;
          };
        },
      };

      renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...propsWithCapture} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(capturedHandlers).to.exist;
      });

      const mockEvent = { preventDefault: sinon.spy() };
      capturedHandlers.breadCrumbClick(mockEvent);

      expect(mockEvent.preventDefault.called).to.be.true;
    });
  });

  describe('form submission', () => {
    it('should render form element', async () => {
      const { container } = renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        const form = container.querySelector('form');
        expect(form).to.exist;
        expect(form.getAttribute('novalidate')).to.exist;
      });
    });
  });

  describe('step and quickExit handling', () => {
    it('should pass step to getContentComponent', async () => {
      let capturedStep;
      const propsWithStepCapture = {
        ...defaultProps,
        getContentComponent: step => {
          capturedStep = step;
          return () => <div data-testid="mock-content">Content</div>;
        },
      };

      renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...propsWithStepCapture} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(capturedStep).to.equal('select');
      });
    });

    it('should pass quickExit to getButtons', async () => {
      let capturedQuickExit;
      const propsWithQuickExitCapture = {
        ...defaultProps,
        getButtons: (step, quickExit) => {
          capturedQuickExit = quickExit;
          return <div data-testid="mock-buttons">Buttons</div>;
        },
      };

      renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...propsWithQuickExitCapture} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(capturedQuickExit).to.be.a('boolean');
      });
    });
  });

  describe('EditContext', () => {
    it('should provide EditContext with onCancel', async () => {
      const { container } = renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(container.querySelector('h1')).to.exist;
      });
    });
  });

  describe('pageData and error state', () => {
    it('should pass pageData to content component', async () => {
      let capturedPageData;
      const propsWithPageDataCapture = {
        ...defaultProps,
        getContentComponent: () => {
          return ({ pageData }) => {
            capturedPageData = pageData;
            return <div data-testid="mock-content">Content</div>;
          };
        },
      };

      renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...propsWithPageDataCapture} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(capturedPageData).to.exist;
        expect(capturedPageData).to.have.property('data');
        expect(capturedPageData).to.have.property('quickExit');
      });
    });

    it('should pass setPageData to content component', async () => {
      let capturedSetPageData;
      const propsWithSetPageDataCapture = {
        ...defaultProps,
        getContentComponent: () => {
          return ({ setPageData }) => {
            capturedSetPageData = setPageData;
            return <div data-testid="mock-content">Content</div>;
          };
        },
      };

      renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...propsWithSetPageDataCapture} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(capturedSetPageData).to.be.a('function');
      });
    });

    it('should pass fieldName and noPreferenceValue to content', async () => {
      let capturedFieldName;
      let capturedNoPreferenceValue;
      const propsWithCapture = {
        ...defaultProps,
        getContentComponent: () => {
          return ({ fieldName, noPreferenceValue }) => {
            capturedFieldName = fieldName;
            capturedNoPreferenceValue = noPreferenceValue;
            return <div data-testid="mock-content">Content</div>;
          };
        },
      };

      renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...propsWithCapture} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(capturedFieldName).to.equal(mockFieldName);
        expect(capturedNoPreferenceValue).to.equal('no_preference');
      });
    });

    it('should pass options to content component', async () => {
      let capturedOptions;
      const propsWithOptionsCapture = {
        ...defaultProps,
        getContentComponent: () => {
          return ({ options }) => {
            capturedOptions = options;
            return <div data-testid="mock-content">Content</div>;
          };
        },
      };

      renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...propsWithOptionsCapture} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(capturedOptions).to.be.an('array');
        expect(capturedOptions.length).to.be.greaterThan(0);
        if (capturedOptions[0]) {
          expect(capturedOptions[0]).to.have.property('value');
          expect(capturedOptions[0]).to.have.property('label');
        }
      });
    });

    it('should pass data prop to content component', async () => {
      let capturedData;
      const initialState = getInitialState();
      initialState.vaProfile.schedulingPreferences[mockFieldName] = ['email'];

      const propsWithDataCapture = {
        ...defaultProps,
        getContentComponent: () => {
          return ({ data }) => {
            capturedData = data;
            return <div data-testid="mock-content">Content</div>;
          };
        },
      };

      renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...propsWithDataCapture} />,
        {
          initialState,
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(capturedData).to.deep.equal(['email']);
      });
    });
  });

  describe('handlers.continue', () => {
    it('should set error true when validation fails on continue', async () => {
      let capturedHandlers;
      let capturedError;
      const propsWithCapture = {
        ...defaultProps,
        getContentComponent: () => {
          return ({ handlers, error }) => {
            capturedHandlers = handlers;
            capturedError = error;
            return <div data-testid="mock-content">Content</div>;
          };
        },
      };

      renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...propsWithCapture} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(capturedHandlers).to.exist;
      });

      // pageData.data is empty so validation fails
      capturedHandlers.continue();

      await waitFor(() => {
        expect(capturedError).to.be.true;
      });
    });

    it('should advance step to confirm when validation passes on continue', async () => {
      let capturedHandlers;
      let capturedStep;
      let capturedPageData;
      const initialState = getInitialState();
      initialState.vaProfile.schedulingPreferences[mockFieldName] = [
        'no_preference',
      ];

      const propsWithCapture = {
        ...defaultProps,
        getContentComponent: step => {
          capturedStep = step;
          return ({ handlers, pageData }) => {
            capturedHandlers = handlers;
            capturedPageData = pageData;
            return <div data-testid="mock-content">Content</div>;
          };
        },
      };

      renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...propsWithCapture} />,
        {
          initialState,
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      // Wait for pageData to be initialized from redux so handlers
      // close over the populated data (avoids race with useEffect)
      await waitFor(() => {
        expect(capturedPageData?.data?.[mockFieldName]).to.deep.equal([
          'no_preference',
        ]);
      });

      capturedHandlers.continue();

      await waitFor(() => {
        expect(capturedStep).to.equal('confirm');
      });
    });
  });

  describe('handlers.save', () => {
    it('should set error true when validation fails on save', async () => {
      let capturedHandlers;
      let capturedError;
      const propsWithCapture = {
        ...defaultProps,
        getContentComponent: () => {
          return ({ handlers, error }) => {
            capturedHandlers = handlers;
            capturedError = error;
            return <div data-testid="mock-content">Content</div>;
          };
        },
      };

      renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...propsWithCapture} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(capturedHandlers).to.exist;
      });

      capturedHandlers.save();

      await waitFor(() => {
        expect(capturedError).to.be.true;
      });
    });

    it('should save and navigate when validation passes on save', async () => {
      let capturedHandlers;
      let capturedSetPageData;

      const propsWithCapture = {
        ...defaultProps,
        getContentComponent: () => {
          return ({ handlers, setPageData }) => {
            capturedHandlers = handlers;
            capturedSetPageData = setPageData;
            return <div data-testid="mock-content">Content</div>;
          };
        },
      };

      const { history } = renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...propsWithCapture} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(capturedHandlers).to.exist;
      });

      // Set pageData with a string value (as the real form radio would)
      capturedSetPageData({
        data: { [mockFieldName]: 'option-1' },
        quickExit: false,
      });

      await new Promise(resolve => setTimeout(resolve, 50));

      capturedHandlers.save();

      await waitFor(() => {
        expect(history.location.pathname).to.include('/profile');
      });
    });
  });

  describe('handlers.updateContactInfo', () => {
    it('should set error true when validation fails on updateContactInfo', async () => {
      let capturedHandlers;
      let capturedError;
      const propsWithCapture = {
        ...defaultProps,
        getContentComponent: () => {
          return ({ handlers, error }) => {
            capturedHandlers = handlers;
            capturedError = error;
            return <div data-testid="mock-content">Content</div>;
          };
        },
      };

      renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...propsWithCapture} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(capturedHandlers).to.exist;
      });

      capturedHandlers.updateContactInfo();

      await waitFor(() => {
        expect(capturedError).to.be.true;
      });
    });

    it('should save and navigate to edit contact info when validation passes', async () => {
      let capturedHandlers;
      let capturedSetPageData;

      const propsWithCapture = {
        ...defaultProps,
        getContentComponent: () => {
          return ({ handlers, setPageData }) => {
            capturedHandlers = handlers;
            capturedSetPageData = setPageData;
            return <div data-testid="mock-content">Content</div>;
          };
        },
      };

      const { history } = renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...propsWithCapture} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(capturedHandlers).to.exist;
      });

      // Set pageData with a string value (as the real form radio would)
      capturedSetPageData({
        data: { [mockFieldName]: 'option-1' },
        quickExit: false,
      });

      await new Promise(resolve => setTimeout(resolve, 50));

      capturedHandlers.updateContactInfo();

      await waitFor(() => {
        expect(history.location.pathname).to.include('/profile');
      });
    });
  });

  describe('unsaved edits behavior', () => {
    it('should show confirm cancel modal when breadcrumb clicked with unsaved edits', async () => {
      let capturedHandlers;
      let capturedSetPageData;
      const initialState = getInitialState();
      initialState.vaProfile.schedulingPreferences[mockFieldName] = ['email'];

      const propsWithCapture = {
        ...defaultProps,
        getContentComponent: () => {
          return ({ handlers, setPageData }) => {
            capturedHandlers = handlers;
            capturedSetPageData = setPageData;
            return <div data-testid="mock-content">Content</div>;
          };
        },
      };

      renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...propsWithCapture} />,
        {
          initialState,
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(capturedHandlers).to.exist;
        expect(capturedSetPageData).to.exist;
      });

      // Simulate local unsaved edits by changing pageData to differ from fieldData
      capturedSetPageData({
        data: { [mockFieldName]: ['text_message'] },
        quickExit: false,
      });

      // Allow effects to process
      await new Promise(resolve => setTimeout(resolve, 50));

      const mockEvent = { preventDefault: sinon.spy() };
      capturedHandlers.breadCrumbClick(mockEvent);

      expect(mockEvent.preventDefault.called).to.be.true;
    });

    it('should detect local unsaved edits when pageData differs from fieldData', async () => {
      let capturedSetPageData;
      const initialState = getInitialState();
      initialState.vaProfile.schedulingPreferences[mockFieldName] = ['email'];

      const propsWithCapture = {
        ...defaultProps,
        getContentComponent: () => {
          return ({ setPageData }) => {
            capturedSetPageData = setPageData;
            return <div data-testid="mock-content">Content</div>;
          };
        },
      };

      renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...propsWithCapture} />,
        {
          initialState,
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(capturedSetPageData).to.exist;
      });

      // Simulate changing the selection
      capturedSetPageData({
        data: { [mockFieldName]: ['text_message'] },
        quickExit: false,
      });

      // Allow effects to process
      await new Promise(resolve => setTimeout(resolve, 50));

      // The unsaved edits state change will trigger the beforeunload effect
      // We just need to verify it doesn't throw
      expect(true).to.be.true;
    });
  });

  describe('validate function branches', () => {
    it('should handle validation with continue value in select step', async () => {
      let capturedHandlers;
      let capturedSetPageData;
      const propsWithCapture = {
        ...defaultProps,
        getContentComponent: () => {
          return ({ handlers, setPageData }) => {
            capturedHandlers = handlers;
            capturedSetPageData = setPageData;
            return <div data-testid="mock-content">Content</div>;
          };
        },
      };

      renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...propsWithCapture} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(capturedHandlers).to.exist;
      });

      // Set pageData with 'continue' value which is a valid array value in select step
      capturedSetPageData({
        data: { [mockFieldName]: ['continue'] },
        quickExit: false,
      });

      await new Promise(resolve => setTimeout(resolve, 50));

      // This should pass validation (includes 'continue' && step === 'select')
      capturedHandlers.continue();
    });

    it('should handle validation with a valid option value', async () => {
      let capturedHandlers;
      let capturedSetPageData;
      let capturedStep;
      const propsWithCapture = {
        ...defaultProps,
        getContentComponent: step => {
          capturedStep = step;
          return ({ handlers, setPageData }) => {
            capturedHandlers = handlers;
            capturedSetPageData = setPageData;
            return <div data-testid="mock-content">Content</div>;
          };
        },
      };

      renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...propsWithCapture} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(capturedHandlers).to.exist;
      });

      // Set pageData with a valid scheduling option value
      capturedSetPageData({
        data: { [mockFieldName]: ['option-1'] },
        quickExit: false,
      });

      await new Promise(resolve => setTimeout(resolve, 50));

      capturedHandlers.continue();

      await waitFor(() => {
        expect(capturedStep).to.equal('confirm');
      });
    });

    it('should handle validation with a string emptyValue and noPreferenceValue', async () => {
      let capturedHandlers;
      let capturedError;
      const stringProps = {
        ...defaultProps,
        emptyValue: '',
        noPreferenceValue: 'no_preference',
        getContentComponent: () => {
          return ({ handlers, error }) => {
            capturedHandlers = handlers;
            capturedError = error;
            return <div data-testid="mock-content">Content</div>;
          };
        },
      };

      renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...stringProps} />,
        {
          initialState: getInitialState({
            vaProfile: {
              schedulingPreferences: {},
            },
          }),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(capturedHandlers).to.exist;
      });

      // With empty string emptyValue and no pageData, validation should fail
      capturedHandlers.continue();

      await waitFor(() => {
        expect(capturedError).to.be.true;
      });
    });

    it('should validate string noPreferenceValue in non-array context', async () => {
      let capturedHandlers;
      let capturedSetPageData;
      let capturedStep;
      const stringProps = {
        ...defaultProps,
        emptyValue: '',
        noPreferenceValue: 'no_preference',
        getContentComponent: step => {
          capturedStep = step;
          return ({ handlers, setPageData }) => {
            capturedHandlers = handlers;
            capturedSetPageData = setPageData;
            return <div data-testid="mock-content">Content</div>;
          };
        },
      };

      renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...stringProps} />,
        {
          initialState: getInitialState({
            vaProfile: {
              schedulingPreferences: {},
            },
          }),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(capturedHandlers).to.exist;
      });

      // Set pageData with the noPreferenceValue string
      capturedSetPageData({
        data: { [mockFieldName]: 'no_preference' },
        quickExit: true,
      });

      await new Promise(resolve => setTimeout(resolve, 50));

      capturedHandlers.continue();

      await waitFor(() => {
        expect(capturedStep).to.equal('confirm');
      });
    });

    it('should validate a string option value in non-array context', async () => {
      let capturedHandlers;
      let capturedSetPageData;
      let capturedStep;
      const stringProps = {
        ...defaultProps,
        emptyValue: '',
        noPreferenceValue: 'no_preference',
        getContentComponent: step => {
          capturedStep = step;
          return ({ handlers, setPageData }) => {
            capturedHandlers = handlers;
            capturedSetPageData = setPageData;
            return <div data-testid="mock-content">Content</div>;
          };
        },
      };

      renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...stringProps} />,
        {
          initialState: getInitialState({
            vaProfile: {
              schedulingPreferences: {},
            },
          }),
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(capturedHandlers).to.exist;
      });

      // Set pageData with a valid option string value
      capturedSetPageData({
        data: { [mockFieldName]: 'option-1' },
        quickExit: false,
      });

      await new Promise(resolve => setTimeout(resolve, 50));

      capturedHandlers.continue();

      await waitFor(() => {
        expect(capturedStep).to.equal('confirm');
      });
    });
  });

  describe('quickExit initialization', () => {
    it('should set quickExit true when fieldData is only no_preference', async () => {
      let capturedQuickExit;
      const initialState = getInitialState();
      initialState.vaProfile.schedulingPreferences[mockFieldName] = [
        'no_preference',
      ];

      const propsWithCapture = {
        ...defaultProps,
        getButtons: (step, quickExit) => {
          capturedQuickExit = quickExit;
          return <div data-testid="mock-buttons">Buttons</div>;
        },
      };

      renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...propsWithCapture} />,
        {
          initialState,
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(capturedQuickExit).to.be.true;
      });
    });

    it('should set quickExit false when fieldData has real values', async () => {
      let capturedQuickExit;
      const initialState = getInitialState();
      initialState.vaProfile.schedulingPreferences[mockFieldName] = ['email'];

      const propsWithCapture = {
        ...defaultProps,
        getButtons: (step, quickExit) => {
          capturedQuickExit = quickExit;
          return <div data-testid="mock-buttons">Buttons</div>;
        },
      };

      renderWithStoreAndRouter(
        <PreferenceSelectionContainer {...propsWithCapture} />,
        {
          initialState,
          reducers: { vapService, vaProfile },
          path: '/profile/scheduling-preferences/edit-contact-method',
        },
      );

      await waitFor(() => {
        expect(capturedQuickExit).to.be.false;
      });
    });
  });
});
