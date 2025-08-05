import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { cleanup, render, fireEvent } from '@testing-library/react';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import ConfirmationPage from '../../../containers/ConfirmationPage';

import formConfig from '../../../config/form';

const mockStore = state => createStore(() => state);

const initConfirmationPage = ({
  formData,
  confirmationNumber,
  timestamp,
  userFullName,
} = {}) => {
  const store = mockStore({
    form: {
      ...createInitialState(formConfig),
      submission: {
        response: {
          confirmationNumber,
        },
        timestamp,
      },
      data: formData,
    },
    user: {
      profile: {
        userFullName,
      },
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
    const { container } = initConfirmationPage({
      formData: {},
      confirmationNumber: '1234567890',
      timestamp: Date.now(),
      userFullName: { first: 'John', middle: 'A.', last: 'Doe', suffix: 'Jr.' },
    });
    const alert = $('va-alert', container);
    expect(alert).to.have.attribute('status', 'success');
    expect($('h2', alert).textContent).to.include('Form submission started');
    expect(alert.textContent).to.include(
      'Your confirmation number is 1234567890',
    );
    expect($('va-link-action', alert).getAttribute('text')).to.eq(
      'Check the status of your form on My VA',
    );
    const summaryBox = $('va-summary-box', container);
    expect(summaryBox).to.exist;
    expect(summaryBox.textContent).to.include('John A. Doe, Jr.');
    expect($('va-process-list', container)).to.exist;
    expect($$('va-link-action', container)).to.have.lengthOf(2);
  });

  it('should call print function when button is clicked', () => {
    const printSpy = sinon.spy();
    const oldPrint = global.window.print;
    global.window.print = printSpy;

    const { container } = initConfirmationPage({});
    fireEvent.click($('va-button[text*="Print this page"]', container));

    expect(printSpy.calledOnce).to.be.true;
    global.window.print = oldPrint;
  });

  it('should render when API fails', () => {
    const { container } = render(
      <Provider store={mockStore({ form: {} })}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );
    expect($('va-alert', container).textContent).to.not.include(
      'Your confirmation number is',
    );

    const summaryBox = $('va-summary-box', container);
    expect(summaryBox).to.exist;
    expect(summaryBox.textContent).to.include('nameDate submitted');
  });
});
