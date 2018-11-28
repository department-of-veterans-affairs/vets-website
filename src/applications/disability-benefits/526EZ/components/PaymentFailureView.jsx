import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

const PaymentFailureView = () => (
  <AlertBox
    headline="We can’t access your information"
    content="We’re sorry. We can’t access your payment information right now. You can continue to fill out the form and we’ll try again later."
    status="error"
    className="async-display-widget-alert-box"
    isVisible
  />
);

export default PaymentFailureView;
