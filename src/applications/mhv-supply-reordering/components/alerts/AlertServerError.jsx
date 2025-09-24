import React from 'react';
import DlcEmailLink from '../DlcEmailLink';
import DlcTelephoneLink from '../DlcTelephoneLink';

const AlertServerError = () => (
  <va-alert
    status="error"
    data-testid="reorder-alert--something-went-wrong"
    class="vads-u-margin-bottom--5"
  >
    <h3 slot="headline">This tool isn’t working right now</h3>
    <div className="mdot-server-error-alert">
      <p>
        We’re sorry. There’s a problem with the medical supply re-order form.
        Refresh this page or try again later.
      </p>
      <p>
        For help ordering hearing aid or CPAP supplies, please call the DLC
        Customer Service Section at <DlcTelephoneLink /> or email{' '}
        <DlcEmailLink />.
      </p>
    </div>
  </va-alert>
);

export default AlertServerError;
