import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { cleanup, render } from '@testing-library/react';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import formConfig from '../../../config/form';
import ConfirmationPage2 from '../../../containers/ConfirmationPage2';
import { TOGGLE_KEY } from '../../../constants';

const mockStore = state => createStore(() => state);
const initConfirmationPage = ({
  formData = {},
  submissionResponse = {},
} = {}) => {
  const store = mockStore({
    form: {
      ...createInitialState(formConfig),
      submission: {
        response: {
          confirmationNumber: '1234567890',
          pdfUrl: '/fake-pdf-url',
          statusUrl: '/fake-status-url',
          ...submissionResponse,
        },
        timestamp: new Date('2024-05-05T12:00:00Z'),
      },
      data: {
        fullName: { first: 'Jane', last: 'Doe' },
        dob: '2000-01-01',
        email: 'test@test.com',
        [`view:${TOGGLE_KEY}`]: true,
        ...formData,
      },
    },
  });
  return render(
    <Provider store={store}>
      <ConfirmationPage2
        route={{
          formConfig,
        }}
      />
    </Provider>,
  );
};

describe('COE ConfirmationPage2', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders alert content and COE status action link', () => {
    const { container } = initConfirmationPage();
    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert).to.have.attribute('status', 'success');
    expect(alert.textContent).to.contain(
      'Request submission started on May 5, 2024',
    );
    expect(alert.textContent).to.contain('Your submission is in progress.');
    expect(alert.textContent).to.contain(
      'After we receive your request, we’ll review your information and notify you by email on how to get your COE.',
    );
  });

  it('renders the print section without the extra default copy', () => {
    const { container } = initConfirmationPage();
    expect(container.textContent).to.contain('Print this confirmation page');
    expect(container.textContent).to.contain(
      'If you’d like to keep a copy of the information on this page, you can print it now.',
    );
    expect(container.textContent).to.not.contain(
      'You won’t be able to access this page later.',
    );
  });

  it('renders the status section and what to expect process list', () => {
    const { container } = initConfirmationPage();
    expect(container.textContent).to.contain('What to expect');
  });

  it('renders the What to expect process list headings', () => {
    const { container } = initConfirmationPage();
    const items = Array.from(
      container.querySelectorAll('va-process-list-item'),
    );

    expect(items.length).to.be.at.least(3);
    expect(
      container.querySelector(
        'va-process-list-item[header="We’ll confirm when we are reviewing your request"]',
      ),
    ).to.exist;
    expect(
      container.querySelector(
        'va-process-list-item[header="We’ll let you know if we need additional documentation"]',
      ),
    ).to.exist;
    expect(
      container.querySelector(
        'va-process-list-item[header="We’ll provide a decision"]',
      ),
    ).to.exist;
  });
});
