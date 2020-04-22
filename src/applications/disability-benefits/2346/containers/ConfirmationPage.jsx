import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

const ConfirmationPage = ({ email }) => {
  const date = new Date();

  return (
    <>
      <AlertBox
        headline="Your order is confirmed"
        content={
          <p>
            We'll send you an email confirming your order to{' '}
            <strong>{email}</strong>.
          </p>
        }
        status="success"
      />
      <AlertBox
        headline="Your order details"
        content={
          <section>
            <p>
              <strong>Order Date</strong>:{' '}
              {new Intl.DateTimeFormat('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              }).format(date)}
            </p>
            <p>
              <strong>Items Ordered</strong>
            </p>
            <p>
              <strong>ZA1239 Batteries</strong> <br /> Qty: 60
            </p>
            <p>
              <strong>Oticon medium domes</strong> <br /> Qty: 10
            </p>
          </section>
        }
        status="info"
        backgroundOnly
      />
      <section>
        <h2>How long will it take to receive my order?</h2>
        <p>
          You will receive an email containing an order tracking number within
          1-2 business days.
        </p>
        <p>
          You are able to view both the status of your order and your order
          tracking history any time.
        </p>
        <button type="button" className="usa-button">
          View your order history
        </button>
      </section>
      <section className="vads-u-margin-bottom--4">
        <h2>What if I have questions about my order?</h2>
        <p>
          If you have any questions about your order, please call Denver
          Logistics Center at <a href="tel:303-273-6200">303-273-6200</a>.
        </p>
      </section>
    </>
  );
};

ConfirmationPage.propTypes = {
  email: PropTypes.string.isRequired,
};

ConfirmationPage.defaultProps = {
  email: '',
};

const mapStateToProps = state => ({
  email: state.form?.data?.email,
});

export default connect(mapStateToProps)(ConfirmationPage);
