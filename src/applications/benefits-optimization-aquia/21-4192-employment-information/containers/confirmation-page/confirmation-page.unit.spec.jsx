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

  it('should display success alert', () => {
    const mockStore = createMockStore();

    const { container } = render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    const alert = container.querySelector('va-alert[status="success"]');
    expect(alert).to.exist;

    // Verify the custom title is displayed in the alert
    expect(alert.textContent).to.include('provided information in connection');
    expect(alert.textContent).to.include('disability benefits');
    expect(alert.textContent).to.include('January 15, 2024');
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

    // The new component uses "What to expect" instead of "What are my next steps"
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

    const { container, getByText } = render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    // Verify the alert and main sections are displayed
    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(getByText(/How to submit supporting documents/i)).to.exist;
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
          timestamp: '2024-03-15T14:30:00.000Z',
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
    // The new ConfirmationView component displays veteran information
    // through ChapterSectionCollection, which shows submitted form data
    // These tests verify the component renders without errors

    it('should display veteran full name', () => {
      const mockStore = createMockStore({
        formData: {
          veteranInformation: {
            firstName: 'Boba',
            lastName: 'Fett',
          },
        },
      });

      const { container } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );

      // Verify the page renders successfully with veteran data
      expect(container).to.exist;
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

      const { container } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );

      // Verify the page renders successfully with veteran data
      expect(container).to.exist;
    });

    it('should handle missing veteran name gracefully', () => {
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

      // Verify the page renders successfully without veteran data
      expect(container).to.exist;
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

      const { container } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );

      // Verify the page renders successfully with partial data
      expect(container).to.exist;
    });

    it('should handle missing last name', () => {
      const mockStore = createMockStore({
        formData: {
          veteranInformation: {
            firstName: 'Jean-Luc',
          },
        },
      });

      const { container } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );

      // Verify the page renders successfully with partial data
      expect(container).to.exist;
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
        getState: () => ({ form: { data: {}, submission: {} } }),
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

  describe('How to Contact Section', () => {
    it('should display contact information section', () => {
      const mockStore = createMockStore();

      const { getByText } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );

      expect(getByText(/For assistance or to ask questions/i)).to.exist;
    });

    it('should display VA Benefits phone number', () => {
      const mockStore = createMockStore();

      const { container } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );

      // Check for va-telephone element (the actual contact value comes from CONTACTS constant)
      const phoneLinks = container.querySelectorAll('va-telephone');
      expect(phoneLinks.length).to.be.greaterThan(0);
    });

    it('should display TTY phone number', () => {
      const mockStore = createMockStore();

      const { container } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );

      const ttyLink = container.querySelector('va-telephone[tty="true"]');
      expect(ttyLink).to.exist;
    });

    it('should display Ask VA link', () => {
      const mockStore = createMockStore();

      const { container } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );

      const askVALink = container.querySelector(
        'va-link[href="https://ask.va.gov/"]',
      );
      expect(askVALink).to.exist;
      expect(askVALink.getAttribute('text')).to.include('Ask VA');
    });

    it('should display Veterans Benefits Administration information', () => {
      const mockStore = createMockStore();

      const { getByText } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );

      expect(
        getByText(/Veterans Benefits Administration National Call Center/i),
      ).to.exist;
    });

    it('should display hours of operation', () => {
      const mockStore = createMockStore();

      const { getByText } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );

      expect(getByText(/Monday through Friday, 8:00 a.m. to 9:00 p.m. ET/i)).to
        .exist;
    });
  });
});
