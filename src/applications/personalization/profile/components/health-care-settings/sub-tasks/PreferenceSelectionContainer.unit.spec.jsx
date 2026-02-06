import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import * as featureToggles from 'platform/utilities/feature-toggles';
import vapService from '~/platform/user/profile/vap-svc/reducers';
import vaProfile from '@@profile/reducers/vaProfile';
import { FIELD_NAMES } from '@@vap-svc/constants';
import { PreferenceSelectionContainer } from './PreferenceSelectionContainer';

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
});
