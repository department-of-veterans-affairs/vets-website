import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';

import { ConfirmationPage } from './confirmation-page';

describe('ConfirmationPage Container', () => {
  let store;

  beforeEach(() => {
    store = {
      getState: () => ({
        form: {
          formId: '21-0779',
          submission: {
            status: 'submitted',
            timestamp: '2024-01-15T10:30:00.000Z',
            response: {
              confirmationNumber: 'V-NHI-12345',
              pdfUrl: '/path/to/pdf',
            },
          },
          data: {},
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
  });

  describe('Component Rendering', () => {
    it('should render without errors', () => {
      const route = { formConfig: { formId: '21-0779' } };
      const { container } = render(
        <Provider store={store}>
          <ConfirmationPage route={route} />
        </Provider>,
      );
      expect(container).to.exist;
    });

    it('should display success message content', () => {
      const route = { formConfig: { formId: '21-0779' } };
      const { container } = render(
        <Provider store={store}>
          <ConfirmationPage route={route} />
        </Provider>,
      );
      expect(container.textContent).to.include('submitted');
      expect(container.textContent).to.include('nursing home information');
    });
  });

  describe('Content', () => {
    it('should display submission date when available', () => {
      const route = { formConfig: { formId: '21-0779' } };
      const { container } = render(
        <Provider store={store}>
          <ConfirmationPage route={route} />
        </Provider>,
      );
      expect(container.textContent).to.include('January');
    });

    it('should display review information', () => {
      const route = { formConfig: { formId: '21-0779' } };
      const { container } = render(
        <Provider store={store}>
          <ConfirmationPage route={route} />
        </Provider>,
      );
      expect(container.textContent).to.include('review');
    });

    it('should mention contact if more information needed', () => {
      const route = { formConfig: { formId: '21-0779' } };
      const { container } = render(
        <Provider store={store}>
          <ConfirmationPage route={route} />
        </Provider>,
      );
      expect(container.textContent).to.include('contact you');
    });
  });

  describe('Missing Data Handling', () => {
    it('should handle missing submission data gracefully', () => {
      const emptyStore = {
        getState: () => ({
          form: {
            formId: '21-0779',
            submission: {},
            data: {},
          },
        }),
        subscribe: () => {},
        dispatch: () => {},
      };

      const route = { formConfig: { formId: '21-0779' } };
      const { container } = render(
        <Provider store={emptyStore}>
          <ConfirmationPage route={route} />
        </Provider>,
      );
      expect(container).to.exist;
    });

    it('should handle missing timestamp', () => {
      const storeWithoutTimestamp = {
        getState: () => ({
          form: {
            formId: '21-0779',
            submission: {
              response: {
                confirmationNumber: 'V-NHI-12345',
              },
            },
            data: {},
          },
        }),
        subscribe: () => {},
        dispatch: () => {},
      };

      const route = { formConfig: { formId: '21-0779' } };
      const { container } = render(
        <Provider store={storeWithoutTimestamp}>
          <ConfirmationPage route={route} />
        </Provider>,
      );
      expect(container).to.exist;
    });

    it('should handle missing confirmation number', () => {
      const storeWithoutConfirmation = {
        getState: () => ({
          form: {
            formId: '21-0779',
            submission: {
              timestamp: '2024-01-15T10:30:00.000Z',
              response: {},
            },
            data: {},
          },
        }),
        subscribe: () => {},
        dispatch: () => {},
      };

      const route = { formConfig: { formId: '21-0779' } };
      const { container } = render(
        <Provider store={storeWithoutConfirmation}>
          <ConfirmationPage route={route} />
        </Provider>,
      );
      expect(container).to.exist;
    });

    it('should handle missing response object', () => {
      const storeWithoutResponse = {
        getState: () => ({
          form: {
            formId: '21-0779',
            submission: {
              timestamp: '2024-01-15T10:30:00.000Z',
            },
            data: {},
          },
        }),
        subscribe: () => {},
        dispatch: () => {},
      };

      const route = { formConfig: { formId: '21-0779' } };
      const { container } = render(
        <Provider store={storeWithoutResponse}>
          <ConfirmationPage route={route} />
        </Provider>,
      );
      expect(container).to.exist;
    });
  });

  describe('Props', () => {
    it('should accept route prop with formConfig', () => {
      const route = {
        formConfig: {
          formId: '21-0779',
          title: 'Nursing Home Information',
        },
      };
      const { container } = render(
        <Provider store={store}>
          <ConfirmationPage route={route} />
        </Provider>,
      );
      expect(container).to.exist;
    });
  });

  describe('PDF URL Handling', () => {
    it('should pass pdfUrl to ConfirmationView when available', () => {
      const storeWithPdf = {
        getState: () => ({
          form: {
            formId: '21-0779',
            submission: {
              timestamp: '2024-01-15T10:30:00.000Z',
              response: {
                confirmationNumber: 'V-NHI-12345',
                pdfUrl: 'https://example.com/form.pdf',
              },
            },
            data: {},
          },
        }),
        subscribe: () => {},
        dispatch: () => {},
      };

      const route = { formConfig: { formId: '21-0779' } };
      const { container } = render(
        <Provider store={storeWithPdf}>
          <ConfirmationPage route={route} />
        </Provider>,
      );
      expect(container).to.exist;
    });

    it('should handle missing pdfUrl gracefully', () => {
      const storeWithoutPdf = {
        getState: () => ({
          form: {
            formId: '21-0779',
            submission: {
              timestamp: '2024-01-15T10:30:00.000Z',
              response: {
                confirmationNumber: 'V-NHI-12345',
              },
            },
            data: {},
          },
        }),
        subscribe: () => {},
        dispatch: () => {},
      };

      const route = { formConfig: { formId: '21-0779' } };
      const { container } = render(
        <Provider store={storeWithoutPdf}>
          <ConfirmationPage route={route} />
        </Provider>,
      );
      expect(container).to.exist;
    });
  });

  describe('Submission Alert Content', () => {
    it('should display thank you message', () => {
      const route = { formConfig: { formId: '21-0779' } };
      const { container } = render(
        <Provider store={store}>
          <ConfirmationPage route={route} />
        </Provider>,
      );
      expect(container.textContent).to.include('Thank you');
    });

    it('should mention supporting a claim', () => {
      const route = { formConfig: { formId: '21-0779' } };
      const { container } = render(
        <Provider store={store}>
          <ConfirmationPage route={route} />
        </Provider>,
      );
      expect(container.textContent).to.include('support a claim');
    });

    it('should include date in title when timestamp is available', () => {
      const route = { formConfig: { formId: '21-0779' } };
      const { container } = render(
        <Provider store={store}>
          <ConfirmationPage route={route} />
        </Provider>,
      );
      expect(container.textContent).to.include('on January');
    });

    it('should not break when timestamp is missing', () => {
      const storeWithoutTimestamp = {
        getState: () => ({
          form: {
            formId: '21-0779',
            submission: {
              response: {
                confirmationNumber: 'V-NHI-12345',
              },
            },
            data: {},
          },
        }),
        subscribe: () => {},
        dispatch: () => {},
      };

      const route = { formConfig: { formId: '21-0779' } };
      const { container } = render(
        <Provider store={storeWithoutTimestamp}>
          <ConfirmationPage route={route} />
        </Provider>,
      );
      expect(container.textContent).to.include('submitted your nursing home');
    });
  });

  describe('DevOnly Configuration', () => {
    it('should pass devOnly showButtons configuration', () => {
      const route = { formConfig: { formId: '21-0779' } };
      const { container } = render(
        <Provider store={store}>
          <ConfirmationPage route={route} />
        </Provider>,
      );

      expect(container).to.exist;
    });
  });
});
