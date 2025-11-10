import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import { cleanup, render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import formConfig from '@bio-aquia/21-0779-nursing-home-information/config/form';
import { ConfirmationPage } from '@bio-aquia/21-0779-nursing-home-information/containers/confirmation-page';

const mockStore = state => createStore(() => state);

const initConfirmationPage = ({ formData, submission = {} } = {}) => {
  const defaultSubmission = {
    response: {
      confirmationNumber: '1234567890',
      pdfUrl: 'https://example.com/form.pdf',
    },
    timestamp: new Date(),
    ...submission,
  };

  const store = mockStore({
    form: {
      ...createInitialState(formConfig),
      submission: defaultSubmission,
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

  it('should show success alert, h2, and confirmation number if present', () => {
    const { container } = initConfirmationPage();
    const alert = container.querySelector('va-alert');
    expect(alert).to.have.attribute('status', 'success');
    expect(alert.querySelector('h2')).to.contain.text(
      "You've submitted your nursing home information",
    );
    expect(alert).to.contain.text(
      "You've submitted your nursing home information",
    );
  });

  it('should render without confirmation number when not available', () => {
    const { container } = initConfirmationPage({
      submission: {
        response: {},
        timestamp: new Date(),
      },
    });
    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert).to.not.contain.text('Your confirmation number is');
  });

  it('should display the correct thank you message', () => {
    const { container } = initConfirmationPage();
    const alert = container.querySelector('va-alert');
    expect(alert).to.contain.text('Thank you for helping to support a claim.');
  });

  it('should render with form data', () => {
    const formData = {
      nursingOfficialInformation: {
        fullName: {
          first: 'Owen',
          last: 'Lars',
        },
      },
    };
    const { container } = initConfirmationPage({ formData });
    expect(container).to.exist;
  });
});
