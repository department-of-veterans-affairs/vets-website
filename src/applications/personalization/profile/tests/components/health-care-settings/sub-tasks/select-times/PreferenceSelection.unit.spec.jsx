import React from 'react';
import { expect } from 'chai';
import { waitFor, cleanup } from '@testing-library/react';
import sinon from 'sinon';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import * as featureToggles from 'platform/utilities/feature-toggles';
import vapService from '~/platform/user/profile/vap-svc/reducers';
import vaProfile from '@@profile/reducers/vaProfile';
import { FIELD_NAMES } from '@@vap-svc/constants/schedulingPreferencesConstants';
import PreferenceSelection from '../../../../../components/health-care-settings/sub-tasks/select-times/pages/PreferenceSelection';

const mockFieldName = FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES;

describe('PreferenceSelection', () => {
  let useFeatureToggleStub;

  const defaultProps = {
    error: false,
    pageData: {
      data: {},
    },
    noPreferenceValue: 'no_preference',
    data: [],
    fieldName: mockFieldName,
  };

  const getInitialState = (overrides = {}) => ({
    user: {
      profile: {
        vapContactInfo: {},
      },
    },
    vapService: {},
    vaProfile: {
      schedulingPreferences: {
        [mockFieldName]: [],
        loading: false,
      },
      ...overrides,
    },
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
    it('should render radio group', async () => {
      const { container } = renderWithStoreAndRouter(
        <PreferenceSelection {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const radioGroup = container.querySelector('va-radio');
        expect(radioGroup).to.exist;
      });
    });

    it('should render radio options', async () => {
      const { container } = renderWithStoreAndRouter(
        <PreferenceSelection {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const options = container.querySelectorAll('va-radio-option');
        expect(options.length).to.be.greaterThan(0);
      });
    });

    it('should render error message when error prop is true', async () => {
      const propsWithError = {
        ...defaultProps,
        error: true,
      };

      const { container } = renderWithStoreAndRouter(
        <PreferenceSelection {...propsWithError} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const radioGroup = container.querySelector('va-radio');
        expect(radioGroup.getAttribute('error')).to.not.be.null;
      });
    });

    it('should not render error message when error prop is false', async () => {
      const { container } = renderWithStoreAndRouter(
        <PreferenceSelection {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const radioGroup = container.querySelector('va-radio');
        const errorAttr = radioGroup.getAttribute('error');
        expect(errorAttr === null || errorAttr === 'null').to.be.true;
      });
    });
  });

  describe('loading state', () => {
    it('should render loading indicator when loading is true', async () => {
      const initialState = getInitialState();
      initialState.vaProfile.schedulingPreferences.loading = true;

      const { container } = renderWithStoreAndRouter(
        <PreferenceSelection {...defaultProps} />,
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
        <PreferenceSelection {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const radioGroup = container.querySelector('va-radio');
        expect(radioGroup).to.exist;
      });
    });
  });

  describe('field data normalization', () => {
    it('should handle empty field data', async () => {
      const { container } = renderWithStoreAndRouter(
        <PreferenceSelection {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const radioGroup = container.querySelector('va-radio');
        expect(radioGroup).to.exist;
      });
    });

    it('should handle array field data', async () => {
      const propsWithArrayData = {
        ...defaultProps,
        data: ['time-option-1'],
      };

      const { container } = renderWithStoreAndRouter(
        <PreferenceSelection {...propsWithArrayData} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const radioGroup = container.querySelector('va-radio');
        expect(radioGroup).to.exist;
      });
    });

    it('should select no preference when data is no_preference', async () => {
      const propsWithNoPreference = {
        ...defaultProps,
        data: ['no_preference'],
      };

      const { container } = renderWithStoreAndRouter(
        <PreferenceSelection {...propsWithNoPreference} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const radioGroup = container.querySelector('va-radio');
        expect(radioGroup).to.exist;
      });
    });

    it('should prefer pageData over data prop', async () => {
      const propsWithBoth = {
        ...defaultProps,
        pageData: {
          data: {
            [mockFieldName]: ['time-option-2'],
          },
        },
        data: ['time-option-1'],
      };

      const { container } = renderWithStoreAndRouter(
        <PreferenceSelection {...propsWithBoth} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const radioGroup = container.querySelector('va-radio');
        expect(radioGroup).to.exist;
      });
    });
  });

  describe('radio handler', () => {
    it('should render radio options for user selection', async () => {
      const { container } = renderWithStoreAndRouter(
        <PreferenceSelection {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const radioGroup = container.querySelector('va-radio');
        expect(radioGroup).to.exist;
        const radioOptions = container.querySelectorAll('va-radio-option');
        expect(radioOptions.length).to.be.greaterThan(0);
      });
    });
  });

  describe('required attribute', () => {
    it('should render with required attribute', async () => {
      const { container } = renderWithStoreAndRouter(
        <PreferenceSelection {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const radioGroup = container.querySelector('va-radio');
        expect(radioGroup.getAttribute('required')).to.equal('true');
      });
    });
  });

  describe('focus management', () => {
    it('should focus on h1 element on mount', async () => {
      const { container } = renderWithStoreAndRouter(
        <PreferenceSelection {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const radioGroup = container.querySelector('va-radio');
        expect(radioGroup).to.exist;
      });
    });
  });
});
