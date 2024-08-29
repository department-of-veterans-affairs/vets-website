import { yesNoUI } from 'platform/forms-system/src/js/web-component-patterns';
import React from 'react';

const PaymentSelectionUI = () => {
  return yesNoUI({
    title: 'Tell us where to send the payment for this claim',
    description: (
      <>
        <ul>
          <li>
            Select <strong>Veteran</strong> if you’ve already paid this
            provider. We’ll send a check to your mailing address to pay you back
            (also called reimbursement).
          </li>
          <li>
            Select <strong>Provider</strong> if you haven’t paid the provider.
            We’ll send a check to the provider’s mailing address to pay them
            directly.
          </li>
        </ul>
        <p>
          <strong>Send payment to:</strong>
        </p>
      </>
    ),
    labels: {
      Y: 'Veteran',
      N: 'Provider',
    },
  });
};

export default PaymentSelectionUI;
