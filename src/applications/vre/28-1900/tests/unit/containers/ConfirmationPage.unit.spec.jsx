import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { cleanup, render } from '@testing-library/react';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import formConfig from '../../../config/form';
import ConfirmationPage from '../../../containers/ConfirmationPage';

const mockStore = state => createStore(() => state);

const initConfirmationPage = formData => {
  const store = mockStore({
    form: {
      ...createInitialState(formConfig),
      submission: {
        response: {
          confirmationNumber: '1234567890',
        },
        timestamp: new Date(),
      },
      data: formData,
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

  it('should show success alert, h2, and confirmation number', () => {
    const formData = {
      internationalPhone: {
        countryCode: 'US',
        contact: '',
        _isValid: false,
        _error:
          'Enter a valid United States of America phone number. Use 10 digits.',
        _touched: false,
        _required: false,
      },
      email: 'email@email.com',
      isMoving: false,
      checkBoxGroup: {
        checkForMailingAddress: true,
      },
      veteranAddress: {
        'view:militaryBaseDescription': {},
      },
      yearsOfEducation: '10',
      fullName: {
        first: 'First',
        last: 'Last',
      },
      dob: '2000-01-01',
      newAddress: {
        'view:militaryBaseDescription': {},
      },
    };
    const { container } = initConfirmationPage(formData);
    const alert = container.querySelector('va-alert');
    expect(alert).to.have.attribute('status', 'success');
    expect(alert.querySelector('h2')).to.contain.text(
      "You've submitted your application for Veteran Readiness and Employment (VR&E)",
    );
    expect(alert).to.contain.text('Your confirmation number is 1234567890');
  });
});
