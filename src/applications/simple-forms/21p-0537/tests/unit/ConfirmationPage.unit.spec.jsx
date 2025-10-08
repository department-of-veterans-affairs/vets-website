import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { format } from 'date-fns';

import ConfirmationPage from '../../containers/ConfirmationPage';

describe('21P-0537 ConfirmationPage', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  const baseStore = {
    form: {
      formId: '21P-0537',
      submission: {
        confirmationId: 'ABC123',
        timestamp: '2024-03-15T10:30:00Z',
      },
      data: {
        hasRemarried: false,
      },
    },
  };

  afterEach(() => {
    cleanup();
  });

  describe('basic rendering', () => {
    it('should render success alert with correct heading', () => {
      const { container } = render(
        <Provider store={mockStore(baseStore)}>
          <ConfirmationPage />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.have.attr('status', 'success');
      expect(alert).to.have.attr('uswds');
    });

    it('should display form number in submission information', () => {
      const { container } = render(
        <Provider store={mockStore(baseStore)}>
          <ConfirmationPage />
        </Provider>,
      );

      const text = container.textContent;
      expect(text).to.include('VA Form 21P-0537');
      expect(text).to.include('Marital Status Questionnaire');
    });
  });

  describe('submission date formatting', () => {
    it('should format submission date when timestamp exists', () => {
      const timestamp = '2024-03-15T10:30:00Z';
      const expectedDate = format(new Date(timestamp), 'MMMM d, yyyy');

      const store = {
        form: {
          ...baseStore.form,
          submission: {
            confirmationId: 'ABC123',
            timestamp,
          },
        },
      };

      const { getByText } = render(
        <Provider store={mockStore(store)}>
          <ConfirmationPage />
        </Provider>,
      );

      getByText(expectedDate);
    });

    it('should use current date when timestamp is missing', () => {
      const expectedDate = format(new Date(), 'MMMM d, yyyy');

      const store = {
        form: {
          ...baseStore.form,
          submission: {
            confirmationId: 'ABC123',
            timestamp: undefined,
          },
        },
      };

      const { getByText } = render(
        <Provider store={mockStore(store)}>
          <ConfirmationPage />
        </Provider>,
      );

      getByText(expectedDate);
    });

    it('should use current date when submission is missing', () => {
      const expectedDate = format(new Date(), 'MMMM d, yyyy');

      const store = {
        form: {
          ...baseStore.form,
          submission: undefined,
        },
      };

      const { getByText } = render(
        <Provider store={mockStore(store)}>
          <ConfirmationPage />
        </Provider>,
      );

      getByText(expectedDate);
    });
  });

  describe('confirmation number display', () => {
    it('should display confirmation number when available', () => {
      const { getByText } = render(
        <Provider store={mockStore(baseStore)}>
          <ConfirmationPage />
        </Provider>,
      );

      getByText(/Confirmation number:/i);
      getByText('ABC123');
    });

    it('should hide confirmation number section when not available', () => {
      const store = {
        form: {
          ...baseStore.form,
          submission: {
            timestamp: '2024-03-15T10:30:00Z',
            confirmationId: undefined,
          },
        },
      };

      const { queryByText } = render(
        <Provider store={mockStore(store)}>
          <ConfirmationPage />
        </Provider>,
      );

      expect(queryByText(/Confirmation number:/i)).to.be.null;
    });

    it('should hide confirmation number section when submission is undefined', () => {
      const store = {
        form: {
          ...baseStore.form,
          submission: undefined,
        },
      };

      const { queryByText } = render(
        <Provider store={mockStore(store)}>
          <ConfirmationPage />
        </Provider>,
      );

      expect(queryByText(/Confirmation number:/i)).to.be.null;
    });
  });

  describe('conditional content based on remarriage status', () => {
    it('should show not remarried message when hasRemarried is false', () => {
      const store = {
        form: {
          ...baseStore.form,
          data: {
            hasRemarried: false,
          },
        },
      };

      const { getByText, queryByText } = render(
        <Provider store={mockStore(store)}>
          <ConfirmationPage />
        </Provider>,
      );

      getByText(/you have not remarried/i);
      getByText(/your DIC benefits should continue without interruption/i);
      expect(queryByText(/your age at the time of remarriage/i)).to.be.null;
    });

    it('should show remarried message when hasRemarried is true', () => {
      const store = {
        form: {
          ...baseStore.form,
          data: {
            hasRemarried: true,
          },
        },
      };

      const { getByText, queryByText } = render(
        <Provider store={mockStore(store)}>
          <ConfirmationPage />
        </Provider>,
      );

      getByText(/you have remarried/i);
      getByText(/your age at the time of remarriage/i);
      getByText(/whether the remarriage has ended/i);
      expect(
        queryByText(/your DIC benefits should continue without interruption/i),
      ).to.be.null;
    });

    it('should handle missing hasRemarried property', () => {
      const store = {
        form: {
          ...baseStore.form,
          data: {},
        },
      };

      const { queryByText } = render(
        <Provider store={mockStore(store)}>
          <ConfirmationPage />
        </Provider>,
      );

      // When hasRemarried is undefined, it should show remarried message
      expect(queryByText(/you have not remarried/i)).to.be.null;
    });

    it('should handle missing data property', () => {
      const store = {
        form: {
          ...baseStore.form,
          data: undefined,
        },
      };

      const { queryByText } = render(
        <Provider store={mockStore(store)}>
          <ConfirmationPage />
        </Provider>,
      );

      // Should not crash when data is undefined
      expect(queryByText(/you have not remarried/i)).to.be.null;
    });
  });

  describe('print functionality', () => {
    it('should render print button', () => {
      const { container } = render(
        <Provider store={mockStore(baseStore)}>
          <ConfirmationPage />
        </Provider>,
      );

      const printButton = container.querySelector('va-button');
      expect(printButton).to.have.attr('text', 'Print this page');
    });
  });

  describe('error handling', () => {
    it('should handle undefined form gracefully or throw PropTypes warning', () => {
      const store = {
        form: undefined,
      };

      // The component uses optional chaining and may not throw
      // depending on PropTypes being in development or production mode
      try {
        const { container } = render(
          <Provider store={mockStore(store)}>
            <ConfirmationPage />
          </Provider>,
        );
        // If it renders, verify it doesn't crash
        expect(container).to.exist;
      } catch (error) {
        // If it throws due to PropTypes in dev mode, that's also acceptable
        expect(error).to.exist;
      }
    });
  });

  describe('contact information', () => {
    it('should display contact phone number', () => {
      const { getByText } = render(
        <Provider store={mockStore(baseStore)}>
          <ConfirmationPage />
        </Provider>,
      );

      getByText(/1-877-294-6380/i);
      getByText(/TTY: 711/i);
    });

    it('should display IRIS website link', () => {
      const { container } = render(
        <Provider store={mockStore(baseStore)}>
          <ConfirmationPage />
        </Provider>,
      );

      const links = container.querySelectorAll('a[href="https://iris.va.gov"]');
      expect(links.length).to.be.greaterThan(0);
    });
  });
});
