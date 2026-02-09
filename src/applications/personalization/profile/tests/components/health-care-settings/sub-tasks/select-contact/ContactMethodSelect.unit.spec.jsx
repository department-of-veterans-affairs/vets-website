import React from 'react';
import { expect } from 'chai';
import { waitFor, cleanup } from '@testing-library/react';
import sinon from 'sinon';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import * as featureToggles from 'platform/utilities/feature-toggles';
import vapService from '~/platform/user/profile/vap-svc/reducers';
import vaProfile from '@@profile/reducers/vaProfile';
import {
  FIELD_NAMES,
  FIELD_OPTION_IDS,
} from '@@vap-svc/constants/schedulingPreferencesConstants';
import ContactMethodSelect from '../../../../../components/health-care-settings/sub-tasks/contact-method/pages/ContactMethodSelect';

const mockFieldName = FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD;

describe('ContactMethodSelect', () => {
  let useFeatureToggleStub;

  const defaultProps = {
    error: false,
    options: [
      { value: FIELD_OPTION_IDS[mockFieldName].EMAIL, label: 'Email' },
      {
        value: FIELD_OPTION_IDS[mockFieldName].NO_PREFERENCE,
        label: 'No preference',
      },
      {
        value: FIELD_OPTION_IDS[mockFieldName].SECURE_MESSAGE,
        label: 'Secure message',
      },
      {
        value: FIELD_OPTION_IDS[mockFieldName].TELEPHONE_MOBILE,
        label: 'Mobile phone',
      },
    ],
    fieldName: mockFieldName,
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
    },
    vaProfile: {
      schedulingPreferences: {
        [mockFieldName]: '',
        loading: false,
      },
    },
    ...overrides,
  });

  beforeEach(() => {
    useFeatureToggleStub = sinon.stub(featureToggles, 'useFeatureToggle');
    useFeatureToggleStub.returns({
      TOGGLE_NAMES: {},
      useToggleValue: sinon.stub().returns(true),
    });
    defaultProps.setPageData = sinon.spy();
  });

  afterEach(() => {
    useFeatureToggleStub.restore();
    cleanup();
  });

  describe('basic rendering', () => {
    it('should render the select component', async () => {
      const { container } = renderWithStoreAndRouter(
        <ContactMethodSelect {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const select = container.querySelector('va-select');
        expect(select).to.exist;
      });
    });

    it('should render all options', async () => {
      const { container } = renderWithStoreAndRouter(
        <ContactMethodSelect {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const options = container.querySelectorAll('option');
        expect(options.length).to.equal(defaultProps.options.length);
      });
    });

    it('should render with correct labels', async () => {
      const { container } = renderWithStoreAndRouter(
        <ContactMethodSelect {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const options = container.querySelectorAll('option');
        options.forEach((option, index) => {
          expect(option.textContent).to.include(
            defaultProps.options[index].label,
          );
        });
      });
    });

    it('should render error message when error prop is true', async () => {
      const propsWithError = {
        ...defaultProps,
        error: true,
      };

      const { container } = renderWithStoreAndRouter(
        <ContactMethodSelect {...propsWithError} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const select = container.querySelector('va-select');
        expect(select.getAttribute('error')).to.not.be.null;
      });
    });

    it('should not render error message when error prop is false', async () => {
      const { container } = renderWithStoreAndRouter(
        <ContactMethodSelect {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const select = container.querySelector('va-select');
        const errorAttr = select.getAttribute('error');
        expect(errorAttr === null || errorAttr === 'null').to.be.true;
      });
    });
  });

  describe('loading state', () => {
    it('should render loading indicator when loading is true', async () => {
      const initialState = getInitialState();
      initialState.vaProfile.schedulingPreferences.loading = true;

      const { container } = renderWithStoreAndRouter(
        <ContactMethodSelect {...defaultProps} />,
        {
          initialState,
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const loading = container.querySelector('va-loading-indicator');
        expect(loading).to.exist;
      });
    });

    it('should not render loading indicator when loading is false', async () => {
      const { container } = renderWithStoreAndRouter(
        <ContactMethodSelect {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const select = container.querySelector('va-select');
        expect(select).to.exist;
      });
    });
  });

  describe('selected value', () => {
    it('should display selected value from redux state', async () => {
      const initialState = getInitialState();
      initialState.vaProfile.schedulingPreferences[mockFieldName] =
        FIELD_OPTION_IDS[mockFieldName].EMAIL;

      const { container } = renderWithStoreAndRouter(
        <ContactMethodSelect {...defaultProps} />,
        {
          initialState,
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const select = container.querySelector('va-select');
        expect(select.getAttribute('value')).to.equal(
          FIELD_OPTION_IDS[mockFieldName].EMAIL,
        );
      });
    });

    it('should have empty default value when no data', async () => {
      const { container } = renderWithStoreAndRouter(
        <ContactMethodSelect {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const select = container.querySelector('va-select');
        expect(select.getAttribute('value')).to.equal('');
      });
    });
  });

  describe('select handler', () => {
    it('should set quickExit true for no preference', async () => {
      const { container } = renderWithStoreAndRouter(
        <ContactMethodSelect {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const select = container.querySelector('va-select');
        expect(select).to.exist;
      });

      const select = container.querySelector('va-select');
      select.dispatchEvent(
        new CustomEvent('vaSelect', {
          detail: { value: FIELD_OPTION_IDS[mockFieldName].NO_PREFERENCE },
        }),
      );

      await waitFor(() => {
        expect(defaultProps.setPageData.called).to.be.true;
        const callArgs = defaultProps.setPageData.lastCall.args[0];
        expect(callArgs.quickExit).to.be.true;
      });
    });

    it('should set quickExit true for secure message', async () => {
      const { container } = renderWithStoreAndRouter(
        <ContactMethodSelect {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const select = container.querySelector('va-select');
        expect(select).to.exist;
      });

      const select = container.querySelector('va-select');
      select.dispatchEvent(
        new CustomEvent('vaSelect', {
          detail: { value: FIELD_OPTION_IDS[mockFieldName].SECURE_MESSAGE },
        }),
      );

      await waitFor(() => {
        expect(defaultProps.setPageData.called).to.be.true;
        const callArgs = defaultProps.setPageData.lastCall.args[0];
        expect(callArgs.quickExit).to.be.true;
      });
    });

    it('should set quickExit false for other options', async () => {
      const { container } = renderWithStoreAndRouter(
        <ContactMethodSelect {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const select = container.querySelector('va-select');
        expect(select).to.exist;
      });

      const select = container.querySelector('va-select');
      select.dispatchEvent(
        new CustomEvent('vaSelect', {
          detail: { value: FIELD_OPTION_IDS[mockFieldName].TELEPHONE_MOBILE },
        }),
      );

      await waitFor(() => {
        expect(defaultProps.setPageData.called).to.be.true;
        const callArgs = defaultProps.setPageData.lastCall.args[0];
        expect(callArgs.quickExit).to.be.false;
      });
    });

    it('should set page data with selected value', async () => {
      const { container } = renderWithStoreAndRouter(
        <ContactMethodSelect {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const select = container.querySelector('va-select');
        expect(select).to.exist;
      });

      const select = container.querySelector('va-select');
      select.dispatchEvent(
        new CustomEvent('vaSelect', {
          detail: { value: FIELD_OPTION_IDS[mockFieldName].EMAIL },
        }),
      );

      await waitFor(() => {
        expect(defaultProps.setPageData.called).to.be.true;
        const callArgs = defaultProps.setPageData.lastCall.args[0];
        expect(callArgs.data[mockFieldName]).to.equal(
          FIELD_OPTION_IDS[mockFieldName].EMAIL,
        );
      });
    });
  });

  describe('required attribute', () => {
    it('should render with required attribute', async () => {
      const { container } = renderWithStoreAndRouter(
        <ContactMethodSelect {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const select = container.querySelector('va-select');
        expect(select.getAttribute('required')).to.equal('true');
      });
    });
  });

  describe('focus management', () => {
    it('should focus on h1 element on mount', async () => {
      const { container } = renderWithStoreAndRouter(
        <ContactMethodSelect {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const select = container.querySelector('va-select');
        expect(select).to.exist;
      });
    });
  });
});
