/**
 * Unit tests for ConfirmationPage container component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
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
});
