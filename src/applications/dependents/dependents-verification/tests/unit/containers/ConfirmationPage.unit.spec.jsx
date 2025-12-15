import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { cleanup, render, fireEvent, waitFor } from '@testing-library/react';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import ConfirmationPage from '../../../containers/ConfirmationPage';

import formConfig from '../../../config/form';
import maxData from '../../e2e/fixtures/data/maximal-test.json';

const mockStore = state => createStore(() => state);

const initConfirmationPage = ({
  formData = maxData,
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
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    if (sandbox) {
      sandbox.restore();
    }
    cleanup();
  });

  it('should show success alert, h2, and confirmation number if present', () => {
    const { container } = initConfirmationPage({
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
    expect($('va-accordion', container)).to.exist;
    expect($('va-process-list', container)).to.exist;
    expect($$('va-link-action', container)).to.have.lengthOf(2);
  });

  it('should call print function when button is clicked', async () => {
    const printSpy = sandbox.spy();
    global.window.print = printSpy;

    const { container } = initConfirmationPage({});

    await waitFor(() => {
      fireEvent.click($('va-button[text*="Print this page"]', container));
      expect(printSpy.calledOnce).to.be.true;
    });
  });

  it('should render when API fails', () => {
    const { container } = render(
      <Provider store={mockStore({ form: { data: {} } })}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );
    expect($('va-alert', container).textContent).to.not.include(
      'Your confirmation number is',
    );

    expect($('va-accordion', container)).to.exist;
  });
});
