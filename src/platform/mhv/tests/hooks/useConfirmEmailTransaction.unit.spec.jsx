import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import sinon from 'sinon';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderInReduxProvider as render } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';

import useConfirmEmailTransaction from '../../hooks/useConfirmEmailTransaction';

// Helper to build transaction response with a specific status
const buildTransactionResponse = (transactionStatus = 'COMPLETED_SUCCESS') => ({
  data: {
    id: '',
    type: 'async_transaction_va_profile_email_address_transactions',
    attributes: {
      transactionId: 'test-transaction-id',
      transactionStatus,
      type: 'AsyncTransaction::VAProfile::EmailAddressTransaction',
      metadata: [],
    },
  },
});

// Test component that exposes hook state
const TestComponent = ({
  emailAddressId,
  emailAddress,
  onSuccess,
  onError,
  autoConfirm = false,
}) => {
  const {
    confirmEmail,
    isLoading,
    isSuccess,
    isError,
  } = useConfirmEmailTransaction({
    emailAddressId,
    emailAddress,
    onSuccess,
    onError,
  });

  useEffect(
    () => {
      if (autoConfirm) {
        confirmEmail();
      }
    },
    [autoConfirm, confirmEmail],
  );

  return (
    <div>
      <span data-testid="isLoading">{String(isLoading)}</span>
      <span data-testid="isSuccess">{String(isSuccess)}</span>
      <span data-testid="isError">{String(isError)}</span>
      <va-button
        data-testid="confirm-btn"
        text="Confirm"
        onClick={() => confirmEmail()}
      />
    </div>
  );
};

TestComponent.propTypes = {
  autoConfirm: PropTypes.bool,
  emailAddress: PropTypes.string,
  emailAddressId: PropTypes.number,
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
};

describe('useConfirmEmailTransaction', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    if (global.fetch && global.fetch.restore) {
      global.fetch.restore();
    }
  });

  it('returns initial state with isLoading, isSuccess, isError all false', () => {
    const { getByTestId } = render(
      <TestComponent emailAddressId={123} emailAddress="test@example.com" />,
    );

    expect(getByTestId('isLoading').textContent).to.equal('false');
    expect(getByTestId('isSuccess').textContent).to.equal('false');
    expect(getByTestId('isError').textContent).to.equal('false');
  });

  it('sets isLoading to true when confirmEmail is called', async () => {
    mockApiRequest(buildTransactionResponse('COMPLETED_SUCCESS'));

    const { getByTestId } = render(
      <TestComponent emailAddressId={123} emailAddress="test@example.com" />,
    );

    fireEvent.click(getByTestId('confirm-btn'));

    // isLoading should be true immediately after click
    expect(getByTestId('isLoading').textContent).to.equal('true');

    await waitFor(() => {
      expect(getByTestId('isLoading').textContent).to.equal('false');
    });
  });

  it('sets isSuccess to true when transaction completes successfully', async () => {
    mockApiRequest(buildTransactionResponse('COMPLETED_SUCCESS'));
    const onSuccess = sandbox.spy();

    const { getByTestId } = render(
      <TestComponent
        emailAddressId={123}
        emailAddress="test@example.com"
        onSuccess={onSuccess}
      />,
    );

    fireEvent.click(getByTestId('confirm-btn'));

    await waitFor(() => {
      expect(getByTestId('isSuccess').textContent).to.equal('true');
      expect(getByTestId('isError').textContent).to.equal('false');
      expect(getByTestId('isLoading').textContent).to.equal('false');
    });

    expect(onSuccess.calledOnce).to.be.true;
  });

  it('sets isError to true when API request fails', async () => {
    mockApiRequest({}, false); // Simulate failed request
    const onError = sandbox.spy();

    const { getByTestId } = render(
      <TestComponent
        emailAddressId={123}
        emailAddress="test@example.com"
        onError={onError}
      />,
    );

    fireEvent.click(getByTestId('confirm-btn'));

    await waitFor(() => {
      expect(getByTestId('isError').textContent).to.equal('true');
      expect(getByTestId('isSuccess').textContent).to.equal('false');
      expect(getByTestId('isLoading').textContent).to.equal('false');
    });

    expect(onError.calledOnce).to.be.true;
  });

  it('sets isError to true when transaction fails with COMPLETED_FAILURE', async () => {
    mockApiRequest(buildTransactionResponse('COMPLETED_FAILURE'));
    const onError = sandbox.spy();

    const { getByTestId } = render(
      <TestComponent
        emailAddressId={123}
        emailAddress="test@example.com"
        onError={onError}
      />,
    );

    fireEvent.click(getByTestId('confirm-btn'));

    await waitFor(() => {
      expect(getByTestId('isError').textContent).to.equal('true');
      expect(getByTestId('isSuccess').textContent).to.equal('false');
      expect(getByTestId('isLoading').textContent).to.equal('false');
    });

    expect(onError.calledOnce).to.be.true;
  });

  it('includes id and email_address in the request body', async () => {
    mockApiRequest(buildTransactionResponse('COMPLETED_SUCCESS'));

    const { getByTestId } = render(
      <TestComponent emailAddressId={456} emailAddress="veteran@example.com" />,
    );

    fireEvent.click(getByTestId('confirm-btn'));

    await waitFor(() => {
      expect(global.fetch.calledOnce).to.be.true;
    });

    const [, options] = global.fetch.firstCall.args;
    const requestBody = JSON.parse(options.body);

    expect(requestBody).to.have.property('id', 456);
    expect(requestBody).to.have.property(
      'email_address',
      'veteran@example.com',
    );
    expect(requestBody).to.have.property('confirmation_date');
  });

  it('does not call API if emailAddressId is missing', async () => {
    mockApiRequest(buildTransactionResponse('COMPLETED_SUCCESS'));
    const consoleSpy = sandbox.spy(console, 'error');

    const { getByTestId } = render(
      <TestComponent emailAddress="test@example.com" />,
    );

    fireEvent.click(getByTestId('confirm-btn'));

    expect(global.fetch.called).to.be.false;
    expect(consoleSpy.calledOnce).to.be.true;
  });

  it('does not call API if emailAddress is missing', async () => {
    mockApiRequest(buildTransactionResponse('COMPLETED_SUCCESS'));
    const consoleSpy = sandbox.spy(console, 'error');

    const { getByTestId } = render(<TestComponent emailAddressId={123} />);

    fireEvent.click(getByTestId('confirm-btn'));

    expect(global.fetch.called).to.be.false;
    expect(consoleSpy.calledOnce).to.be.true;
  });

  it('handles response with no transactionId as success', async () => {
    // Some legacy responses may not include transactionId
    mockApiRequest({});
    const onSuccess = sandbox.spy();

    const { getByTestId } = render(
      <TestComponent
        emailAddressId={123}
        emailAddress="test@example.com"
        onSuccess={onSuccess}
      />,
    );

    fireEvent.click(getByTestId('confirm-btn'));

    await waitFor(() => {
      expect(getByTestId('isSuccess').textContent).to.equal('true');
      expect(getByTestId('isLoading').textContent).to.equal('false');
    });

    expect(onSuccess.calledOnce).to.be.true;
  });
});
