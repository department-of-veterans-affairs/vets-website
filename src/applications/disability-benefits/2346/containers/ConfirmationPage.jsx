import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

const ConfirmationPage = ({
  email,
  submittedAt,
  selectedProductArray,
  confirmationNumber,
  fullName,
  shippingAddress,
}) => (
  <div className="confirmation-page">
    <p className="vads-u-font-weight--bold">
      Please print this page for your records.
    </p>
    <AlertBox
      headline="Your order has been submitted"
      content={
        <p>
          We'll send you an email confirming your order to{' '}
          <strong>{email}</strong>.
        </p>
      }
      status="success"
    />
    <AlertBox
      content={
        <section>
          <h4 className="vads-u-margin-top--0">
            Request for Batteries and Accessories{' '}
            <span className="vads-u-font-weight--normal">(Form 2346)</span>
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
            <strong>Shipping Address</strong>
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
          <p className="vads-u-margin--0">
            <strong>Confirmation number</strong>
          </p>
          <p className="vads-u-margin-top--0">{confirmationNumber}</p>
        </section>
      }
      status="info"
      backgroundOnly
    />
    <section>
      <h4>How long will it take to receive my order?</h4>
      <p>
        You'll receive an email with your order tracking number within 1 to 2
        days of your order. Orders typically arrive within 7 to 10 business
        days.
      </p>
    </section>
    <section className="vads-u-margin-bottom--4">
      <h4>What if I have questions about my order?</h4>
      <p>
        If you have any questions about your order, please call the DLC Customer
        Service Section at{' '}
        <a aria-label="3 0 3. 2 7 3. 6 2 0 0." href="tel:303-273-6200">
          303-273-6200
        </a>{' '}
        or email <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
      </p>
    </section>
  </div>
);

ConfirmationPage.propTypes = {
  email: PropTypes.string.isRequired,
  confirmationNumber: PropTypes.string.isRequired,
  shippingAddress: PropTypes.object.isRequired,
};

ConfirmationPage.defaultProps = {
  email: '',
  shippingAddress: {},
};

const mapStateToProps = state => {
  /* eslint-disable no-debugger */
  debugger;
  const supplies = state.form?.data?.supplies;
  const selectedProducts = state.form?.data?.selectedProducts;
  const productIdArray = selectedProducts?.map(product => product.productId);
  const selectedProductArray = supplies?.filter(supply =>
    productIdArray?.includes(supply.productId),
  );
  // Temporary fallback until this is added to the API response
  const submittedAt = state.form?.submission?.submittedAt || moment();

  return {
    submittedAt,
    email: state.form?.data?.email,
    selectedProductArray,
    confirmationNumber:
      state.form?.submission?.response?.attributes?.confirmationNumber,
    fullName: state.form?.data?.fullName,
    shippingAddress: state.form?.submission?.response?.shippingAddress,
  };
};

export default connect(mapStateToProps)(ConfirmationPage);
