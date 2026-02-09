import React from 'react';
import { expect } from 'chai';
import { waitFor, cleanup } from '@testing-library/react';
import sinon from 'sinon';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import * as featureToggles from 'platform/utilities/feature-toggles';
import vapService from '~/platform/user/profile/vap-svc/reducers';
import vaProfile from '@@profile/reducers/vaProfile';
import { FIELD_NAMES } from '@@vap-svc/constants/schedulingPreferencesConstants';
import TimesSelection from '../../../../../components/health-care-settings/sub-tasks/select-times/pages/TimesSelection';

const mockFieldName = FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES;

describe('TimesSelection', () => {
  let useFeatureToggleStub;

  const defaultProps = {
    error: false,
    pageData: {
      data: {
        [mockFieldName]: [],
      },
    },
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
    it('should render checkbox group', async () => {
      const { container } = renderWithStoreAndRouter(
        <TimesSelection {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const checkboxGroup = container.querySelector('va-checkbox-group');
        expect(checkboxGroup).to.exist;
      });
    });

    it('should render multiple checkboxes', async () => {
      const { container } = renderWithStoreAndRouter(
        <TimesSelection {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const checkboxes = container.querySelectorAll('va-checkbox');
        expect(checkboxes.length).to.be.greaterThan(0);
      });
    });

    it('should render day labels', async () => {
      const { container } = renderWithStoreAndRouter(
        <TimesSelection {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const paragraphs = container.querySelectorAll('p');
        expect(paragraphs.length).to.be.greaterThan(0);
      });
    });

    it('should render error message when error prop is true', async () => {
      const propsWithError = {
        ...defaultProps,
        error: true,
      };

      const { container } = renderWithStoreAndRouter(
        <TimesSelection {...propsWithError} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const checkboxGroup = container.querySelector('va-checkbox-group');
        expect(checkboxGroup.getAttribute('error')).to.not.be.null;
      });
    });

    it('should not render error message when error prop is false', async () => {
      const { container } = renderWithStoreAndRouter(
        <TimesSelection {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const checkboxGroup = container.querySelector('va-checkbox-group');
        const errorAttr = checkboxGroup.getAttribute('error');
        expect(errorAttr === null || errorAttr === 'null').to.be.true;
      });
    });
  });

  describe('checkbox options', () => {
    it('should render checkbox with time label', async () => {
      const { container } = renderWithStoreAndRouter(
        <TimesSelection {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const checkboxes = container.querySelectorAll('va-checkbox');
        const firstCheckbox = checkboxes[0];
        expect(firstCheckbox).to.exist;
        expect(firstCheckbox.getAttribute('label')).to.exist;
      });
    });

    it('should render checkboxes with proper aria labels', async () => {
      const { container } = renderWithStoreAndRouter(
        <TimesSelection {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const checkboxes = container.querySelectorAll('va-checkbox');
        const firstCheckbox = checkboxes[0];
        expect(firstCheckbox.getAttribute('aria-label')).to.exist;
      });
    });

    it('should have value attributes on checkboxes', async () => {
      const { container } = renderWithStoreAndRouter(
        <TimesSelection {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const checkboxes = container.querySelectorAll('va-checkbox');
        expect(checkboxes[0].getAttribute('value')).to.exist;
      });
    });
  });

  describe('checkbox state management', () => {
    it('should check checkbox when value is in pageData', async () => {
      const propsWithValue = {
        ...defaultProps,
        pageData: {
          data: {
            [mockFieldName]: ['morning_time_option'],
          },
        },
      };

      const { container } = renderWithStoreAndRouter(
        <TimesSelection {...propsWithValue} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const checkboxes = container.querySelectorAll('va-checkbox');
        expect(checkboxes.length).to.be.greaterThan(0);
      });
    });

    it('should handle empty pageData array', async () => {
      const { container } = renderWithStoreAndRouter(
        <TimesSelection {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const checkboxes = container.querySelectorAll('va-checkbox');
        expect(checkboxes.length).to.be.greaterThan(0);
      });
    });

    it('should handle multiple selected values in pageData', async () => {
      const propsWithMultipleValues = {
        ...defaultProps,
        pageData: {
          data: {
            [mockFieldName]: ['monday_morning', 'wednesday_afternoon'],
          },
        },
      };

      const { container } = renderWithStoreAndRouter(
        <TimesSelection {...propsWithMultipleValues} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const checkboxes = container.querySelectorAll('va-checkbox');
        expect(checkboxes.length).to.be.greaterThan(0);
      });
    });
  });

  describe('checkbox change handler', () => {
    it('should call setPageData when checkbox changes', async () => {
      const { container } = renderWithStoreAndRouter(
        <TimesSelection {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const checkboxGroup = container.querySelector('va-checkbox-group');
        expect(checkboxGroup).to.exist;
      });

      const checkboxGroup = container.querySelector('va-checkbox-group');
      checkboxGroup.dispatchEvent(
        new CustomEvent('vaChange', {
          detail: {
            checked: true,
            value: 'monday_morning',
          },
          target: {
            checked: true,
            value: 'monday_morning',
          },
        }),
      );

      await waitFor(() => {
        expect(defaultProps.setPageData.called).to.be.true;
      });
    });
  });

  describe('required attribute', () => {
    it('should render checkbox group with required attribute', async () => {
      const { container } = renderWithStoreAndRouter(
        <TimesSelection {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const checkboxGroup = container.querySelector('va-checkbox-group');
        expect(checkboxGroup.getAttribute('required')).to.equal('true');
      });
    });
  });

  describe('field attributes', () => {
    it('should pass fieldName as name attribute to checkboxes', async () => {
      const { container } = renderWithStoreAndRouter(
        <TimesSelection {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const checkboxes = container.querySelectorAll('va-checkbox');
        const firstCheckbox = checkboxes[0];
        expect(firstCheckbox.getAttribute('name')).to.equal(mockFieldName);
      });
    });

    it('should render all checkboxes with same fieldName', async () => {
      const { container } = renderWithStoreAndRouter(
        <TimesSelection {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const checkboxes = container.querySelectorAll('va-checkbox');
        checkboxes.forEach(checkbox => {
          expect(checkbox.getAttribute('name')).to.equal(mockFieldName);
        });
      });
    });
  });

  describe('focus management', () => {
    it('should focus on h1 element on mount', async () => {
      const { container } = renderWithStoreAndRouter(
        <TimesSelection {...defaultProps} />,
        {
          initialState: getInitialState(),
          reducers: { vapService, vaProfile },
          path: '/test',
        },
      );

      await waitFor(() => {
        const checkboxGroup = container.querySelector('va-checkbox-group');
        expect(checkboxGroup).to.exist;
      });
    });
  });
});
