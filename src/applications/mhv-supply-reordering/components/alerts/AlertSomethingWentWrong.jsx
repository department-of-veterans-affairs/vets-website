import React from 'react';
import DlcEmailLink from '../DlcEmailLink';
import DlcTelephoneLink from '../DlcTelephoneLink';

const AlertSomethingWentWrong = () => (
  <va-alert
    status="error"
    data-testid="reorder-alert--something-went-wrong"
    class="vads-u-margin-bottom--5"
  >
    <h3 slot="headline">We’re sorry. Something went wrong on our end.</h3>
    <div className="mdot-server-error-alert">
      <p>
        You can’t place an order for hearing aid or CPAP supplies because
        something went wrong on our end.
      </p>
      <p className="vads-u-font-weight--bold vads-u-margin-y--1 vads-u-font-family--serif">
        What you can do
      </p>
      <p className="vads-u-margin-top--0">
        For help ordering hearing aid or CPAP supplies, please call the DLC
        Customer Service Section at <DlcTelephoneLink /> or email{' '}
        <DlcEmailLink />.
      </p>
    </div>
  </va-alert>
);

export default AlertSomethingWentWrong;
