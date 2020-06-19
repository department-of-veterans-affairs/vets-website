import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

const ConfirmationPage = ({
  vetEmail,
  submittedAt,
  selectedProductArray,
  fullName,
  shippingAddress,
}) => {
  const PrintDetails = () => (
    <div className="print-details">
      <img
        src="/img/design/logo/logo-black-and-white.png"
        alt="VA logo"
        width="300"
        className="vads-u-margin-bottom--2"
      />
      <h1 className="vads-u-font-size--h3">
        Order hearing aid batteries and accessories
      </h1>
      <span>Form 2346A</span>
      <h2 className="vads-u-font-size--h4">
        Your order has been been submitted
      </h2>
      <p>
        We'll send you an email confirming your order to{' '}
        <strong>{vetEmail}</strong>.
      </p>
      <h3 className="vads-u-font-size--h4">Your order details</h3>
      <p>
        <span className="vads-u-font-weight--bold">Order date:</span>{' '}
        {moment(submittedAt).format('MMM D, YYYY')}
      </p>
      <h4>Items ordered</h4>
      {selectedProductArray.map(product => (
        <div key={product.productId}>
          <p>
            <strong>{product.productName}</strong>
          </p>
          <p>Qty: {product.quantity}</p>
        </div>
      ))}
      <section className="print-order-timeframe-section">
        <h4 className="vads-u-font-size--h4">
          How long will it take to receive my order?
        </h4>
        <p>
          You'll receive an email with your order tracking number within 1 to 2
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
          Logistics Center at{' '}
          <a aria-label="3 0 3. 2 7 3. 6 2 0 0." href="tel:303-273-6200">
            303-273-6200
          </a>{' '}
          .
        </p>
      </section>
    </div>
  );
  return (
    <div className="confirmation-page">
      <p className="vads-u-font-weight--bold print-copy">
        Please print this page for your records.
      </p>
      <AlertBox
        headline="Your order has been submitted"
        className="order-submission-alert"
        content={
          <p>
            We'll send you an email confirming your order to{' '}
            <strong>{vetEmail}</strong>.
          </p>
        }
        status="success"
      />
      <AlertBox
        className="order-summary-alert"
        content={
          <section>
            <h4 className="vads-u-margin-top--0">
              Request for Batteries and Accessories{' '}
              <span className="vads-u-font-weight--normal">(Form 2346A)</span>
            </h4>
            <p className="vads-u-margin--0">
              for {fullName.first} {fullName.last}
            </p>
            <p className="vads-u-margin-bottom--0">
              <strong>Items ordered</strong>
            </p>
            <ul className="vads-u-margin-bottom--1">
              {selectedProductArray.map(product => (
                <li key={product.productId}>
                  {product.productName} (Quantity: {product.quantity})
                </li>
              ))}
            </ul>
            <p className="vads-u-margin-bottom--0">
              <strong>Shipping address</strong>
            </p>
            <div className="shippingAddress">
              <p className="vads-u-margin-y--0">
                {shippingAddress.street} {shippingAddress.street2 || ''}
              </p>
              <p className="vads-u-margin-top--0">
                {`${shippingAddress.city},
            ${shippingAddress.state || shippingAddress.province} ${' '}
            ${shippingAddress.postalCode ||
              shippingAddress.internationalPostalCode}
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
            <button
              className="usa-button button"
              onClick={() => window.print()}
            >
              Print this page
            </button>
          </section>
        }
        status="info"
        backgroundOnly
      />
      <section className="order-timeframe-section">
        <h4>How long will it take to receive my order?</h4>
        <p>
          You'll receive an email with your order tracking number within 1 to 2
          days of your order. Orders typically arrive within 7 to 10 business
          days.
        </p>
      </section>
      <section className="order-questions-section vads-u-margin-bottom--4">
        <h4>What if I have questions about my order?</h4>
        <p>
          If you have any questions about your order, please call the DLC
          Customer Service Section at{' '}
          <a aria-label="3 0 3. 2 7 3. 6 2 0 0." href="tel:303-273-6200">
            303-273-6200
          </a>{' '}
          or email <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
        </p>
      </section>
      <PrintDetails />
    </div>
  );
};

ConfirmationPage.propTypes = {
  confirmationPageData: PropTypes.shape({
    fullName: PropTypes.shape({
      first: PropTypes.string.isRequired,
      middle: PropTypes.string,
      last: PropTypes.string.isRequired,
    }),
    vetEmail: PropTypes.string.isRequired,
    order: PropTypes.array.isRequired,
    shippingAddress: PropTypes.object.isRequired,
    supplies: PropTypes.array.isRequired,
  }),
};

ConfirmationPage.defaultProps = {
  confirmationPageData: {
    fullName: {
      first: '',
      last: '',
    },
    vetEmail: '',
    order: [],
    shippingAddress: {},
    supplies: [],
  },
};

const mapStateToProps = state => {
  const selectedAddress = state.form?.data['view:currentAddress'];
  const shippingAddress = state.form?.data[selectedAddress];
  const { fullName, vetEmail, order, supplies } = state.form?.data;
  const productIdArray = order?.map(product => product.productId);
  const selectedProductArray = supplies?.filter(supply =>
    productIdArray?.includes(supply.productId),
  );

  // Temporary fallback until this is added to the API response
  const submittedAt = state.form?.submission?.submittedAt || moment();

  return {
    submittedAt,
    fullName,
    vetEmail,
    selectedProductArray,
    shippingAddress,
  };
};

export default connect(mapStateToProps)(ConfirmationPage);
