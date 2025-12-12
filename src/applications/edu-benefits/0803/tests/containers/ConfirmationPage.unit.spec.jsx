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

const initConfirmationPage = ({ formData } = {}) => {
  const store = mockStore({
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
  });

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
});
