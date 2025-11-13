import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

describe.skip('payment history component', () => {
  it('should exist', () => {
    const paymentHistory = render(
      <BrowserRouter>{/* <PaymentHistory></PaymentHistory> */}</BrowserRouter>,
    );
    expect(paymentHistory.getByTestId('payment-history-body')).to.exist;
  });
  it('should be empty if there is no history', () => {
    // const payments = {};
    // expect(getPayments(payments).to.equal({}))
  });
  it('should show payment history if it is not empty', () => {
    // const payments = {id: '3', amount: 530}
    // expect(getPayments(payments).to.equal(payments))
  });
});
