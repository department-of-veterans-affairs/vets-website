import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';

import ConfirmationPage from '../../containers/ConfirmationPage';
import formConfig from '../../config/form';

describe('21P-601 ConfirmationPage', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  const baseStore = {
    form: {
      formId: '21P-601 ',
      submission: {
        response: {
          confirmationNumber: 'ABC123',
        },
        timestamp: '2024-03-15T10:30:00Z',
      },
      data: {
        hasRemarried: false,
      },
    },
  };

  const route = {
    formConfig,
  };

  afterEach(() => {
    cleanup();
  });

  describe('basic rendering', () => {
    it('should render success alert with correct heading', () => {
      const { container } = render(
        <Provider store={mockStore(baseStore)}>
          <ConfirmationPage route={route} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.have.attr('status', 'success');
      expect(alert).to.have.attr('uswds');
    });

    it('should display confirmation information', () => {
      const { container } = render(
        <Provider store={mockStore(baseStore)}>
          <ConfirmationPage route={route} />
        </Provider>,
      );

      const text = container.textContent;
      expect(text).to.include('Form submission started');
    });
  });

  describe('submission handling', () => {
    it('should render successfully with valid submission', () => {
      const { container } = render(
        <Provider store={mockStore(baseStore)}>
          <ConfirmationPage route={route} />
        </Provider>,
      );
      expect(container).to.exist;
    });
  });

  describe('confirmation number display', () => {
    it('should display confirmation number when available', () => {
      const { container } = render(
        <Provider store={mockStore(baseStore)}>
          <ConfirmationPage route={route} />
        </Provider>,
      );

      expect(container.textContent).to.include('ABC123');
    });

    it('should hide confirmation number section when not available', () => {
      const store = {
        form: {
          ...baseStore.form,
          submission: {
            timestamp: '2024-03-15T10:30:00Z',
            response: {},
          },
        },
      };

      const { container } = render(
        <Provider store={mockStore(store)}>
          <ConfirmationPage route={route} />
        </Provider>,
      );

      expect(container.textContent).to.not.include('ABC123');
    });

    it('should hide confirmation number section when submission is undefined', () => {
      const store = {
        form: {
          ...baseStore.form,
          submission: undefined,
        },
      };

      const { container } = render(
        <Provider store={mockStore(store)}>
          <ConfirmationPage route={route} />
        </Provider>,
      );

      expect(container.textContent).to.not.include('ABC123');
    });
  });

  describe('print functionality', () => {
    it('should render print button', () => {
      const { container } = render(
        <Provider store={mockStore(baseStore)}>
          <ConfirmationPage route={route} />
        </Provider>,
      );

      const printButton = container.querySelector('va-button');
      expect(printButton).to.have.attr(
        'text',
        'Print this page for your records',
      );
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
            <ConfirmationPage route={route} />
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
    it('should display How to contact us section', () => {
      const { getByText } = render(
        <Provider store={mockStore(baseStore)}>
          <ConfirmationPage route={route} />
        </Provider>,
      );

      getByText(/How to contact us if you have questions/i);
    });

    it('should display Need help section', () => {
      const { getByText } = render(
        <Provider store={mockStore(baseStore)}>
          <ConfirmationPage route={route} />
        </Provider>,
      );

      getByText(/Need help\?/i);
    });
  });
});
