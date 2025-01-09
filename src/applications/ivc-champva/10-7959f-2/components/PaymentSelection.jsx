import React from 'react';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { radioUI } from 'platform/forms-system/src/js/web-component-patterns/radioPattern';

const PaymentSelectionUI = () => {
  return radioUI({
    title: 'Tell us where to send the payment for this claim',
    labels: {
      Veteran: 'Veteran',
      Provider: 'Provider',
    },
  });
};

export const PaymentReviewScreen = props => {
  return props.data ? (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {props?.title}
        </h4>
        <VaButton secondary onClick={props?.editPage} text="Edit" uswds />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>Send payment to:</dt>
          {props?.data?.sendPayment === 'Veteran' ? (
            <dd>{props?.data?.sendPayment} mailing address</dd>
          ) : (
            <dd>{props?.data?.sendPayment}</dd>
          )}
        </div>
      </dl>
    </div>
  ) : null;
};

export default PaymentSelectionUI;
