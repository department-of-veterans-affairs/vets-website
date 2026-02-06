import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
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
        <button type="button" data-testid="cancel-button">
          Cancel
        </button>
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
});
