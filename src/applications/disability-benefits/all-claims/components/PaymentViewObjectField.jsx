import React from 'react';
import PropTypes from 'prop-types';

export const paymentRows = {
  bankAccountType: 'Account type',
  bankAccountNumber: 'Account number',
  bankRoutingNumber: 'Routing number',
  bankName: 'Bank name',
};

const PaymentViewObjectField = (props = {}) => {
  const { renderedProperties, defaultEditButton, title, formData } = props;
  if (!renderedProperties) {
    return null;
  }

  // Save-in-progress banking info contained in 'view:originalBankAccount'
  // User entered (new) banking info in 'view:bankAccount'
  const buildRow = name => (
    <div className="review-row">
      <dt>{paymentRows[name]}</dt>
      <dd>
        {formData['view:bankAccount'][name] ||
          formData['view:originalBankAccount']?.[`view:${name}`] ||
          ''}
      </dd>
    </div>
  );

  return (
    <>
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {title}
        </h4>
        {defaultEditButton()}
      </div>
      <dl className="review">{Object.keys(paymentRows).map(buildRow)}</dl>
    </>
  );
};
PaymentViewObjectField.propTypes = {
  defaultEditButton: PropTypes.func,
  formData: PropTypes.shape({
    'view:bankAccount': PropTypes.object,
    'view:originalBankAccount': PropTypes.object,
  }),
  renderedProperties: PropTypes.array,
  title: PropTypes.node,
};

export default PaymentViewObjectField;
