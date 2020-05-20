import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

const ConfirmationPage = ({
  email,
  submittedAt,
  selectedProductArray,
  confirmationNumber,
  fullName,
}) => (
  <>
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
            Request for Batteries and Accessories (Form 2346)
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
          <p className="vads-u-margin--0">
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
      <h5>How long will it take to receive my order?</h5>
      <p>
        You'll receive an email with your order tracking number within 1 to 2
        days of your order. Orders typically arrive within 7 to 10 business
        days.
      </p>
    </section>
    <section className="vads-u-margin-bottom--4">
      <h5>What if I have questions about my order?</h5>
      <p>
        If you have any questions about your order, please call the DLC Customer
        Service Section at{' '}
        <a aria-label="3 0 3. 2 7 3. 6 2 0 0." href="tel:303-273-6200">
          303-273-6200
        </a>{' '}
        or email <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
      </p>
    </section>
  </>
);

ConfirmationPage.propTypes = {
  email: PropTypes.string.isRequired,
  confirmationNumber: PropTypes.string.isRequired,
};

ConfirmationPage.defaultProps = {
  email: '',
};

const mapStateToProps = state => {
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
  };
};

export default connect(mapStateToProps)(ConfirmationPage);
