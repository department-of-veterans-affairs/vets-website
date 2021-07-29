import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';
import { currency } from '../utils/helpers';

export const StatusAlert = ({ amount }) => (
  <va-alert
    class="row vads-u-margin-bottom--5 status-alert"
    data-testid="server-error"
    status="warning"
  >
    <h3 slot="headline">
      Sent for collection: {currency(amount)} of your overdue charges
    </h3>
    <p className="vads-u-font-size--base vads-u-font-family--sans">
      You have {currency(amount)} in unpaid charges that’s 120 days or more
      overdue. The U.S. Department of the Treasury has sent these charges for
      collection. To resolve this debt, you’ll need to call{' '}
      <Telephone contact={'8003043107'} />.
    </p>
  </va-alert>
);

export default StatusAlert;
