import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { waitForRenderThenFocus } from 'platform/utilities/ui/focus';
import { scrollTo } from 'platform/utilities/scroll';
import {
  VaAlert,
  VaButton,
  VaSummaryBox,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import DlcTelephoneLink from '../components/DlcTelephoneLink';
import DlcEmailLink from '../components/DlcEmailLink';

export const ConfirmationPage = () => {
  const alertRef = useRef(null);
  const form = useSelector(state => state.form || {});
  const { submission, data = {} } = form;
  const {
    fullName,
    emailAddress,
    chosenSupplies,
    supplies,
    permanentAddress,
  } = data;

  const submittedAt = submission?.timestamp
    ? format(new Date(submission?.timestamp), 'MMMM d, yyyy')
    : '';

  const orderIds = submission?.response
    .map(({ orderId }) => orderId)
    .join(', ');

  const productNames = Object.keys(chosenSupplies || {})
    .filter(id => chosenSupplies[id])
    .map(id => supplies.find(({ productId }) => id == productId)) // eslint-disable-line eqeqeq
    .map(({ productName }) => productName);

  useEffect(
    () => {
      if (alertRef?.current) {
        scrollTo('topScrollElement');
        waitForRenderThenFocus('h2', alertRef.current);
      }
    },
    [alertRef],
  );

  return (
    <div>
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
      </div>

      <VaAlert status="success" class="vads-u-margin-bottom--4" ref={alertRef}>
        <h2 slot="headline">You’ve submitted your medical supplies order</h2>
        <p>
          We’ll send you a confirmation email about your order to {emailAddress}
          . Your order will be processed in the next business day.
        </p>
      </VaAlert>

      <VaSummaryBox>
        <h3 slot="headline">Your order information</h3>

        <h4>Who submitted this form</h4>
        <p className="vads-u-margin-y--0 dd-privacy-mask">
          {fullName ? (
            <span>
              {fullName.first} {fullName.middle} {fullName.last}
              {fullName.suffix ? `, ${fullName.suffix}` : null}
            </span>
          ) : null}
        </p>

        <h4 className="vads-u-margin-top--1">Confirmation number</h4>
        <p className="vads-u-margin-y--0">{orderIds}</p>

        <h4 className="vads-u-margin-top--1">Supplies ordered</h4>
        <ul className="vads-u-margin-top--0">
          {productNames.map((name, i) => (
            <li key={`${i}-${name}`}>{name}</li>
          ))}
        </ul>

        <h4 className="vads-u-margin-top--2">Shipping address</h4>
        <p className="vads-u-margin-y--0 vads-u-padding-bottom--0 dd-privacy-mask">
          {permanentAddress?.street} {permanentAddress?.street2 || ''}
        </p>
        <p className="vads-u-margin-top--0 dd-privacy-mask">
          {`${permanentAddress?.city},
            ${permanentAddress?.state || permanentAddress?.province} ${' '}
            ${permanentAddress?.postalCode ||
              permanentAddress?.internationalPostalCode}
          `}
        </p>

        <h4 className="vads-u-margin-top--1">Date submitted</h4>
        <p data-testid="dateSubmitted" className="vads-u-margin-y--0">
          {submittedAt}
        </p>

        <h4 className="vads-u-margin-top--1">Confirmation for your records</h4>
        <p className="vads-u-margin-y--0">
          You can print this confirmation page for your records
        </p>

        <VaButton
          class="vads-u-margin-top--4"
          text="Print this page"
          message-aria-describedby="Print this page for your records"
          onClick={() => {
            window.print();
          }}
        />
      </VaSummaryBox>
      <div>
        <h2>How long will it take to receive my order?</h2>
        <p>
          Your order will be processed after your order submission. Orders
          typically arrive within 7 to 10 business days.
        </p>
      </div>
      <div>
        <h2>What if I have more questions about my order?</h2>
        <p>
          If you have questions about your order, please call us at{' '}
          <DlcTelephoneLink /> or <DlcEmailLink />
        </p>
      </div>
      <a className="vads-c-action-link--green vads-u-margin-y--4" href="/">
        Go back to VA.gov
      </a>
    </div>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      fullName: {
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      },
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.string,
    }),
  }),
  name: PropTypes.string,
};

export default ConfirmationPage;
