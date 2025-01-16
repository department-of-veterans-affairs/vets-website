import React from 'react';
import DlcEmailLink from '../DlcEmailLink';
import DlcTelephoneLink from '../DlcTelephoneLink';

const AlertReorderAccessExpired = () => (
  <va-alert
    status="warning"
    data-testid="reorder-alert--reorder-access-expired"
    class="vads-u-margin-bottom--5"
  >
    <h3 slot="headline">You can’t reorder your items at this time</h3>
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      <span>
        You can’t order hearing aid or CPAP supplies online at this time because
        you haven’t placed an order within the past two years.
      </span>

      <span className="vads-u-margin-top--1">
        If you need to place an order, call the DLC Customer Service Section at{' '}
        <DlcTelephoneLink /> or email <DlcEmailLink />.
      </span>
    </div>
  </va-alert>
);

export default AlertReorderAccessExpired;
