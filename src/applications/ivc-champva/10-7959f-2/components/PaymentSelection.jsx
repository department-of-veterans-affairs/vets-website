import PropTypes from 'prop-types';
import React from 'react';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { radioUI } from 'platform/forms-system/src/js/web-component-patterns/radioPattern';

const PaymentSelectionUI = () => {
  return radioUI({
    title: 'Send payment to',
    labels: {
      Veteran: 'Veteran',
      Provider: 'Provider',
    },
  });
};

export const PaymentReviewScreen = props => {
  return (
    props.data && (
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
              <dd>
                {props?.data?.sendPayment} bank account or mailing address
              </dd>
            ) : (
              <dd>{props?.data?.sendPayment}</dd>
            )}
          </div>
        </dl>
      </div>
    )
  );
};

const introText = (
  <p>
    Tell us if we should send any payments for this claim to you or to the
    provider:
  </p>
);

const providerText = (
  <p>
    <b>If you haven’t paid the provider,</b> select <b>Provider</b>. We’ll send
    a check to the provider by mail.
  </p>
);

const noDirectDeposit = (
  <p>
    Don’t have direct deposit or a U.S. bank account? We’ll send any payments to
    you by check at the mailing address you gave us on this form.
  </p>
);

const alreadyPaid = (
  <p>
    <b>If you already paid the provider,</b> select <b>Veteran</b>. If we
    approve your claim, we’ll pay you by direct deposit if you have it set up
    for your VA benefit payments. Or, we’ll mail you a check.
  </p>
);

export const loggedInPaymentInfo = (
  <>
    {introText}
    {alreadyPaid}
    {providerText}

    <va-additional-info trigger="Learn more about direct deposit payments">
      If you have a U.S. bank account, you can add, review, or edit your direct
      deposit information in your <va-link href="/" text="VA.gov" /> profile
      anytime.
      <br />
      <br />
      <a href="/profile/direct-deposit" rel="noreferrer" target="_blank">
        Go to your direct deposit information in your VA.gov profile (opens in a
        new tab)
      </a>
      <br />
      <br />
      {noDirectDeposit}
    </va-additional-info>
  </>
);

export const loggedOutPaymentInfo = (
  <>
    {introText}
    <ul>
      <li>{alreadyPaid}</li>
      <li>{providerText}</li>
    </ul>
    <va-additional-info trigger="Learn more about direct deposit payments">
      <a href="/profile/direct-deposit" rel="noreferrer" target="_blank">
        Learn how to change your direct deposit information for your VA benefit
        payments (opens in a new tab)
      </a>
      <br />
      <br />
      {noDirectDeposit}
    </va-additional-info>
  </>
);

export default PaymentSelectionUI;

PaymentReviewScreen.propTypes = {
  data: PropTypes.object,
  editPage: PropTypes.func,
  title: PropTypes.string,
};
