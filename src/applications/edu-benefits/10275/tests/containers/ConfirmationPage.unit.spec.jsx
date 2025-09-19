import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';

import formConfig from '../../config/form';
import ConfirmationPage from '../../containers/ConfirmationPage';

const mockStore = state => createStore(() => state);

before(() => {
  if (!global.scrollTo) global.scrollTo = () => {};
});

const getPage = (data = {}, submission) =>
  render(
    <Provider
      store={mockStore({
        form: {
          ...createInitialState(formConfig),
          data,
          submission,
        },
      })}
    >
      <ConfirmationPage route={{ formConfig }} />
    </Provider>,
  );

describe('ConfirmationPage', () => {
  afterEach(cleanup);

  it('shows success alert for "newCommitment" agreement type', () => {
    const { container, getByText } = getPage({
      agreementType: 'newCommitment',
    });

    expect(container.querySelector('va-alert')).to.have.attribute(
      'status',
      'success',
    );
    expect(getByText(/new commitment/)).to.exist;
  });

  it('shows success alert for "withdrawal" agreement type', () => {
    const { container, getByText } = getPage({
      agreementType: 'withdrawal',
    });

    expect(container.querySelector('va-alert')).to.have.attribute(
      'status',
      'success',
    );
    expect(getByText(/withdrawal of commitment/)).to.exist;
  });

  it('shows summary box with button to print page', () => {
    const { container } = getPage({
      response: {
        attributes: {
          confirmationNumber: '1234567890',
        },
      },
      timestamp: new Date().toISOString(),
    });

    expect(container.querySelector('va-summary-box')).to.exist;
    expect(container.querySelectorAll('va-summary-box h4').length).to.equal(3);
    expect(container.querySelector('va-button')).to.have.attribute(
      'text',
      'Print this page',
    );
  });

  it('shows whats next section', () => {
    const { getByText } = getPage({
      response: {
        attributes: {
          confirmationNumber: '1234567890',
        },
      },
      timestamp: new Date().toISOString(),
    });

    expect(getByText(/What to expect next/)).to.exist;
    expect(getByText(/Your form will be evaluated/)).to.exist;
  });

  it('shows action link to return to VA.gov homepage', () => {
    const { container } = getPage({
      response: {
        attributes: {
          confirmationNumber: '1234567890',
        },
      },
      timestamp: new Date().toISOString(),
    });

    expect(container.querySelector('va-link-action')).to.have.attribute(
      'text',
      'Go back to VA.gov',
    );
  });
});
