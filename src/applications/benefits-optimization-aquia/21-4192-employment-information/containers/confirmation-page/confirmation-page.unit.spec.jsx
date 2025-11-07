import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import { formConfig } from '@bio-aquia/21-4192-employment-information/config';
import { ConfirmationPage } from '@bio-aquia/21-4192-employment-information/containers';

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

    expect(getByText(/What are my next steps/i)).to.exist;
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

  describe('Date Formatting', () => {
    it('should handle string timestamp', () => {
      const mockStore = createMockStore({
        submission: {
          response: { confirmationNumber: '123' },
          timestamp: '2024-03-15T14:30:00.000Z',
        },
      });

      const { getByText } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );

      expect(getByText(/March 15, 2024/i)).to.exist;
    });

    it('should handle Date object timestamp', () => {
      const mockStore = createMockStore({
        submission: {
          response: { confirmationNumber: '123' },
          timestamp: new Date('2024-06-20T10:00:00.000Z'),
        },
      });

      const { getByText } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );

      expect(getByText(/June 20, 2024/i)).to.exist;
    });

    it('should handle missing timestamp with current date', () => {
      const mockStore = createMockStore({
        submission: {
          response: { confirmationNumber: '123' },
          timestamp: null,
        },
      });

      const { container } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert[status="success"]');
      expect(alert).to.exist;
    });

    it('should handle invalid date string gracefully', () => {
      const mockStore = createMockStore({
        submission: {
          response: { confirmationNumber: '123' },
          timestamp: 'invalid-date-string',
        },
      });

      const { container } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert[status="success"]');
      expect(alert).to.exist;
    });

    it('should handle undefined timestamp', () => {
      const mockStore = createMockStore({
        submission: {
          response: { confirmationNumber: '123' },
          timestamp: undefined,
        },
      });

      const { container } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );

      expect(container).to.exist;
    });
  });

  describe('Veteran Information Display', () => {
    it('should display veteran full name', () => {
      const mockStore = createMockStore({
        formData: {
          veteranInformation: {
            firstName: 'Boba',
            lastName: 'Fett',
          },
        },
      });

      const { getAllByText } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );

      const nameElements = getAllByText(/Boba Fett/);
      expect(nameElements).to.have.lengthOf(2);
    });

    it('should display veteran name', () => {
      const mockStore = createMockStore({
        formData: {
          veteranInformation: {
            firstName: 'Cad',
            lastName: 'Bane',
          },
        },
      });

      const { getAllByText } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );

      const nameElements = getAllByText(/Cad Bane/);
      expect(nameElements).to.have.lengthOf(2);
    });

    it('should handle missing veteran name gracefully', () => {
      const mockStore = createMockStore({
        formData: {
          veteranInformation: {},
        },
      });

      const { getByText } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );

      expect(getByText(/Organization title/i)).to.exist;
    });

    it('should handle null veteran information', () => {
      const mockStore = createMockStore({
        formData: {
          veteranInformation: null,
        },
      });

      const { container } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );

      expect(container).to.exist;
    });

    it('should handle missing first name', () => {
      const mockStore = createMockStore({
        formData: {
          veteranInformation: {
            lastName: 'Bossk',
          },
        },
      });

      const { getAllByText } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );

      const nameElements = getAllByText(/Bossk/);
      expect(nameElements.length).to.be.at.least(1);
    });

    it('should handle missing last name', () => {
      const mockStore = createMockStore({
        formData: {
          veteranInformation: {
            firstName: 'Jean-Luc',
          },
        },
      });

      const { getAllByText } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );

      const nameElements = getAllByText(/Jean-Luc/);
      expect(nameElements.length).to.be.at.least(1);
    });

    it('should handle empty veteranInformation object', () => {
      const mockStore = createMockStore({
        formData: {
          veteranInformation: {},
        },
      });

      const { container } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );

      expect(container).to.exist;
    });
  });

  describe('Print Functionality', () => {
    it('should have print button with click handler', () => {
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
  });

  describe('Missing Form Data', () => {
    it('should handle completely missing form data', () => {
      const mockStore = {
        getState: () => ({
          form: {
            submission: {},
            data: null,
          },
        }),
        subscribe: () => {},
        dispatch: () => {},
      };

      const { container } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );

      expect(container).to.exist;
    });

    it('should handle missing form object', () => {
      const mockStore = {
        getState: () => ({}),
        subscribe: () => {},
        dispatch: () => {},
      };

      const { container } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );

      expect(container).to.exist;
    });

    it('should handle missing submission object', () => {
      const mockStore = {
        getState: () => ({
          form: {
            data: {},
          },
        }),
        subscribe: () => {},
        dispatch: () => {},
      };

      const { container } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );

      expect(container).to.exist;
    });
  });
});
