import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { cleanup, render } from '@testing-library/react';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import formConfig from '../../config/form';
import ConfirmationPage from '../../containers/ConfirmationPage';
import maximalTestData from '../fixtures/data/maximal-test.json';

const mockStore = state => createStore(() => state);

const initConfirmationPage = ({ formData, customState } = {}) => {
  const defaultState = {
    form: {
      ...createInitialState(formConfig),
      submission: {
        response: {
          confirmationNumber: '1234567890',
        },
        timestamp: new Date(),
      },
      data: formData || {},
    },
  };

  const store = mockStore(customState || defaultState);

  return render(
    <Provider store={store}>
      <ConfirmationPage route={{ formConfig }} />
    </Provider>,
  );
};

describe('ConfirmationPage', () => {
  afterEach(() => {
    cleanup();
  });

  it('should show success alert, h2, and confirmation number if present', () => {
    const { container } = initConfirmationPage();
    const alert = container.querySelector('va-alert');
    expect(alert).to.have.attribute('status', 'success');
    expect(alert.querySelector('h2')).to.contain.text(
      'Form submission started',
    );
    expect(alert).to.contain.text('Your confirmation number is 1234567890');
  });

  it('should render with form data', () => {
    const { container } = initConfirmationPage({
      formData: maximalTestData.data,
    });
    const alert = container.querySelector('va-alert');
    expect(alert).to.have.attribute('status', 'success');
  });

  describe('conditional variable assignments', () => {
    it('should handle missing submission in form', () => {
      const { container } = initConfirmationPage({
        customState: {
          form: {
            ...createInitialState(formConfig),
            data: {},
          },
        },
      });
      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
    });

    it('should handle missing timestamp in submission', () => {
      const { container } = initConfirmationPage({
        customState: {
          form: {
            ...createInitialState(formConfig),
            submission: {
              response: {
                confirmationNumber: '1234567890',
              },
            },
            data: {},
          },
        },
      });
      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert).to.contain.text('Your confirmation number is 1234567890');
    });

    it('should handle missing confirmationNumber in submission.response', () => {
      const { container } = initConfirmationPage({
        customState: {
          form: {
            ...createInitialState(formConfig),
            submission: {
              response: {},
              timestamp: new Date(),
            },
            data: {},
          },
        },
      });
      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert).to.have.attribute('status', 'success');
    });

    it('should handle missing response in submission', () => {
      const { container } = initConfirmationPage({
        customState: {
          form: {
            ...createInitialState(formConfig),
            submission: {
              timestamp: new Date(),
            },
            data: {},
          },
        },
      });
      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
    });

    it('should handle missing pdfUrl in submission.response', () => {
      const { container } = initConfirmationPage({
        customState: {
          form: {
            ...createInitialState(formConfig),
            submission: {
              response: {
                confirmationNumber: '1234567890',
              },
              timestamp: new Date(),
            },
            data: {},
          },
        },
      });
      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert).to.contain.text('Your confirmation number is 1234567890');
    });

    it('should handle empty form object', () => {
      const { container } = initConfirmationPage({
        customState: {
          form: {},
        },
      });
      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
    });

    it('should handle empty submission object', () => {
      const { container } = initConfirmationPage({
        customState: {
          form: {
            ...createInitialState(formConfig),
            submission: {},
            data: {},
          },
        },
      });
      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
    });
  });
});
