import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import environment from 'platform/utilities/environment';
import { BATTERY } from '../constants';

const ConfirmationPage = ({
  vetEmail,
  submittedAt,
  selectedProductArray,
  fullName,
  shippingAddress,
  orderId,
  isError,
  isEmptyOrder,
  isCompleteOrderSubmitted,
  isPartiallySubmittedOrder,
  hasCompleteOrderFailed,
}) => {
  // TODO: move to util or custom hook.
  const supplyDescription = 'hearing aid or CPAP supplies';
  const PrintDetails = () => (
    <div className="print-details">
      <img
        src="/img/design/logo/logo-black-and-white.png"
        alt="VA logo"
        width="300"
        className="vads-u-margin-bottom--2"
      />
      <h1 className="vads-u-font-size--h3">Order {supplyDescription}</h1>
      <h2 className="vads-u-font-size--h4">Your order has been submitted</h2>
      <p>
        We’ll send you an email confirming your order to{' '}
        <strong>{vetEmail}</strong>.
      </p>
      <h3 className="vads-u-font-size--h4">Your order details</h3>
      <p>
        <span className="vads-u-font-weight--bold">Order date:</span>{' '}
        {moment(submittedAt).format('MMM D, YYYY')}
      </p>
      <h4>Items ordered</h4>
      {selectedProductArray?.map(product => (
        <div key={product?.productId}>
          <p>
            <strong>{product?.productName}</strong>
          </p>
          <p>Qty: {product?.quantity}</p>
        </div>
      ))}
      <section className="print-order-timeframe-section">
        <h4 className="vads-u-font-size--h4">
          How long will it take to receive my order?
        </h4>
        <p>
          You’ll receive an email with your order tracking number within 1 to 2
          business days.
        </p>{' '}
        <p>
          You are able to view both the status of your order and your order
          history at any time.
        </p>
      </section>
      <section className="print-order-questions-section vads-u-margin-bottom--4">
        <h4 className="vads-u-font-size--h4">
          What if I have questions about my order?
        </h4>
        <p>
          If you have any questions about your order please call the Denver
          Logistics Center at <va-telephone contact="3032736200" /> .
        </p>
      </section>
    </div>
  );
  return (
    <div className="confirmation-page">
      {!isError && isCompleteOrderSubmitted && (
        <>
          <p className="vads-u-font-weight--bold print-copy">
            Please print this page for your records.
          </p>
          <va-alert
            class="order-submission-alert vads-u-margin-top--3"
            status="success"
          >
            <h2 className="usa-alert-heading" slot="headline">
              Your order has been submitted
            </h2>
            <p className="order-submission-alert">
              We’ll send you an email confirming your order to{' '}
              <strong className="dd-privacy-mask">{vetEmail}</strong>.
            </p>
          </va-alert>
          <va-alert
            background-only
            class="order-summary-alert vads-u-margin-top--3"
            status="info"
          >
            <section>
              <h4 className="vads-u-margin-top--0">
                Request for {supplyDescription}
              </h4>
              <p className="vads-u-margin--0 dd-privacy-mask">
                for {fullName?.first} {fullName?.last}
              </p>
              <p className="vads-u-margin-bottom--0">
                <strong>Items ordered</strong>
              </p>
              <ul className="vads-u-margin-bottom--1 dd-privacy-mask">
                {selectedProductArray?.map(product => (
                  <li key={product?.productId}>
                    {product?.productName} (Quantity: {product?.quantity})
                  </li>
                ))}
              </ul>
              <p className="vads-u-margin-bottom--0">
                <strong>Shipping address</strong>
              </p>
              <div className="shippingAddress">
                <p className="vads-u-margin-y--0 dd-privacy-mask">
                  {shippingAddress?.street} {shippingAddress?.street2 || ''}
                </p>
                <p className="vads-u-margin-top--0 dd-privacy-mask">
                  {`${shippingAddress?.city},
          ${shippingAddress?.state || shippingAddress?.province} ${' '}
          ${shippingAddress?.postalCode ||
            shippingAddress?.internationalPostalCode}
          `}
                </p>
              </div>
              <p className="vads-u-margin-bottom--0">
                <strong>Date submitted</strong>
              </p>
              <p className="vads-u-margin-top--0">
                {' '}
                {moment(submittedAt).format('MMM D, YYYY')}
              </p>
              <p className="vads-u-margin-bottom--0 dd-privacy-mask">
                <strong>Confirmation number</strong>
              </p>
              <p className="vads-u-margin-y--0">{orderId}</p>
              <button
                className="usa-button button"
                onClick={() => window.print()}
              >
                Print this page
              </button>
            </section>
          </va-alert>
          <section className="order-timeframe-section">
            <h4>How long will it take to receive my order?</h4>
            <p>
              You’ll receive an email with your order tracking number within 1
              to 2 days of your order. Orders typically arrive within 7 to 10
              business days.
            </p>
          </section>
          <section className="order-questions-section vads-u-margin-bottom--4">
            <h4>What if I have questions about my order?</h4>
            <p>
              If you have any questions about your order, please call the DLC
              Customer Service Section at <va-telephone contact="3032736200" />{' '}
              or email <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
            </p>
          </section>
          <PrintDetails />
        </>
      )}
      {isError && isEmptyOrder && (
        <va-alert class="vads-u-margin-bottom--4" status="error">
          <h2 slot="headline">We’re sorry. Your order wasn’t submitted.</h2>
          <div className="empty-state-alert">
            <p>
              Your order for {supplyDescription} wasn’t submitted because you
              didn’t select any items.
            </p>
            <p className="vads-u-font-weight--bold vads-u-margin-y--1 vads-u-font-family--serif">
              What you can do
            </p>
            <p className="vads-u-margin-top--0">
              If you want to{' '}
              <a
                href={`${environment.BASE_URL}/health-care/order-hearing-aid-and-cpap-supplies`}
              >
                place an order online
              </a>
              , please select at least one item before submitting your order.
              For help ordering {supplyDescription}, please call the DLC
              Customer Service Section at <va-telephone contact="3032736200" />{' '}
              or email <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
            </p>
          </div>
        </va-alert>
      )}
      {isError && isPartiallySubmittedOrder && (
        <va-alert class="vads-u-margin-bottom--4" status="error">
          <h2>We’re sorry. Part of your order wasn’t submitted.</h2>
          <div className="partial-submit-alert">
            <p>At least one of the following items couldn’t be ordered:</p>
            <ul className="vads-u-margin-bottom--1 dd-privacy-mask">
              {selectedProductArray?.map(product => {
                if (product.productGroup === BATTERY) {
                  return (
                    <li key={product?.productId}>
                      {`${product?.productName} batteries (Quantity: ${product?.quantity})`}
                    </li>
                  );
                }
                return (
                  <li key={product?.productId}>
                    {product?.productName} (Quantity: {product?.quantity})
                  </li>
                );
              })}
            </ul>
            <p className="vads-u-font-weight--bold vads-u-font-family--serif">
              What you can do
            </p>
            <p className="vads-u-margin-top--0">
              For help ordering {supplyDescription}, please call the DLC
              Customer Service Section at <va-telephone contact="3032736200" />{' '}
              or email <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
            </p>
          </div>
        </va-alert>
      )}
      {isError && hasCompleteOrderFailed && (
        <div className="submission-error-alert">
          <va-alert className="vads-u-margin-bottom--4" status="error">
            <h2>We’re sorry. Your order wasn’t submitted.</h2>
            <>
              <p>
                Your order for {supplyDescription} wasn’t submitted because
                something went wrong on our end.
              </p>
              <p className="vads-u-font-weight--bold vads-u-font-family--serif vads-u-margin-bottom--1">
                What you can do
              </p>
              <p className="vads-u-margin-top--0">
                For help ordering {supplyDescription}, please call the DLC
                Customer Service Section at{' '}
                <va-telephone contact="3032736200" /> or email{' '}
                <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
              </p>
            </>
          </va-alert>
        </div>
      )}
    </div>
  );
};

ConfirmationPage.propTypes = {
  fullName: PropTypes.shape({
    first: PropTypes.string,
    middle: PropTypes.string,
    last: PropTypes.string,
  }),
  hasCompleteOrderFailed: PropTypes.bool,
  isCompleteOrderSubmitted: PropTypes.bool,
  isEmptyOrder: PropTypes.bool,
  isError: PropTypes.bool,
  isPartiallySubmittedOrder: PropTypes.bool,
  orderId: PropTypes.string,
  selectedProductsArray: PropTypes.array,
  shippingAddress: PropTypes.shape({
    street: PropTypes.string.isRequired,
    street2: PropTypes.string,
    city: PropTypes.string.isRequired,
    state: PropTypes.string,
    province: PropTypes.string,
    country: PropTypes.string.isRequired,
    postalCode: PropTypes.string,
    internationalPostalCode: PropTypes.string,
  }),
  submittedAt: PropTypes.object,
  vetEmail: PropTypes.string,
};

ConfirmationPage.defaultProps = {
  fullName: {
    first: '',
    last: '',
  },
  vetEmail: '',
  shippingAddress: {
    street: '',
    street2: '',
    city: '',
    state: '',
    province: '',
    country: '',
    postalCode: '',
    internationalPostalCode: '',
  },
  submittedAt: {},
  selectedProductsArray: [],
  orderId: '',
};

const mapStateToProps = state => {
  const selectedAddress = state.form?.data['view:currentAddress'];
  const shippingAddress = state.form?.data[selectedAddress];
  const { fullName, vetEmail, order, supplies } = state.form?.data;
  const productIdArray = order?.map(product => product.productId);
  const selectedProductArray = supplies?.filter(supply =>
    productIdArray?.includes(supply.productId),
  );
  const {
    submission,
    submission: { response: responses },
    submission: {
      response: { errors },
    },
  } = state.form;

  // Temporary fallback until this is added to the API response
  const submittedAt = submission?.submittedAt || moment();
  let isCompleteOrderSubmitted;
  let isPartiallySubmittedOrder;
  let hasCompleteOrderFailed;
  let isEmptyOrder;
  let isError = false;
  if (!errors) {
    const responseStatuses = responses.map(response => response.status);
    const failedSubmissions = responseStatuses.filter(
      response => !response.toLowerCase().includes('processed'),
    );

    isPartiallySubmittedOrder =
      responseStatuses.length > failedSubmissions.length &&
      failedSubmissions.length > 0;

    hasCompleteOrderFailed =
      responseStatuses.length === failedSubmissions.length;

    isCompleteOrderSubmitted = failedSubmissions.length === 0;
  } else {
    isEmptyOrder = selectedProductArray?.length === 0;
  }

  if (isPartiallySubmittedOrder || hasCompleteOrderFailed || isEmptyOrder) {
    isError = true;
  }
  return {
    submittedAt,
    fullName,
    vetEmail,
    selectedProductArray,
    shippingAddress,
    orderId: submission?.response?.orderId,
    isError,
    isEmptyOrder,
    isCompleteOrderSubmitted,
    isPartiallySubmittedOrder,
    hasCompleteOrderFailed,
  };
};

export default connect(mapStateToProps)(ConfirmationPage);
