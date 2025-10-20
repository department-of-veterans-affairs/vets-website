import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config';
import { ConfirmationPage } from '@bio-aquia/21-2680-house-bound-status/containers';

/**
 * Creates a mock Redux store for testing
 * @param {Object} [overrides={}] - State overrides
 * @returns {Object} Mock store with getState, subscribe, and dispatch
 */
const createMockStore = (overrides = {}) => ({
  getState: () => ({
    form: {
      ...createInitialState(formConfig),
      submission: {
        response: {
          confirmationNumber: '1234567890',
        },
        timestamp: new Date('2024-01-15T10:00:00.000Z'),
      },
      data: {
        veteranFullName: {
          first: 'John',
          last: 'Doe',
        },
        veteranSocialSecurityNumber: '123456789',
        ...overrides.formData,
      },
      ...overrides,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('ConfirmationPage', () => {
  let scrollToTopStub;
  let focusElementStub;

  beforeEach(() => {
    const uiUtils = require('platform/utilities/ui');
    scrollToTopStub = sinon.stub(uiUtils, 'scrollToTop');
    focusElementStub = sinon.stub(uiUtils, 'focusElement');
  });

  afterEach(() => {
    scrollToTopStub.restore();
    focusElementStub.restore();
  });

  it('should display success alert with confirmation number', () => {
    const mockStore = createMockStore();

    const { container, getByText } = render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    const alert = container.querySelector('va-alert[status="success"]');
    expect(alert).to.exist;

    expect(getByText(/1234567890/)).to.exist;
  });

  it('should display the form title', () => {
    const mockStore = createMockStore();

    const { getByText } = render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    expect(getByText(/January 15, 2024/)).to.exist;
  });

  it('should scroll to top and focus on mount', () => {
    const mockStore = createMockStore();

    render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    expect(scrollToTopStub).to.exist;
    expect(focusElementStub).to.exist;
  });

  it('should display next steps section', () => {
    const mockStore = createMockStore();

    const { getByText } = render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    expect(getByText(/What to expect/i)).to.exist;
  });

  it('should display print button', () => {
    const mockStore = createMockStore();

    const { container } = render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    const printButton = container.querySelector('va-button');
    expect(printButton).to.exist;
    expect(printButton.getAttribute('text')).to.include('Print');
  });

  it('should display submission date', () => {
    const mockStore = createMockStore();

    const { getByText } = render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    expect(getByText(/January 15, 2024/i)).to.exist;
  });

  it('should display confirmation content', () => {
    const mockStore = createMockStore({
      formData: {
        veteranFullName: {
          first: 'Jane',
          middle: 'A',
          last: 'Smith',
        },
      },
    });

    const { getByText } = render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    expect(getByText(/confirmation number/i)).to.exist;
  });

  it('should handle missing confirmation number gracefully', () => {
    const mockStore = createMockStore({
      submission: {
        response: {},
        timestamp: new Date(),
      },
    });

    const { container, queryByText } = render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    const alert = container.querySelector('va-alert[status="success"]');
    expect(alert).to.exist;
    expect(queryByText(/1234567890/)).to.not.exist;
  });
});
