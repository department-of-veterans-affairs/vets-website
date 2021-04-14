import React from 'react';
import { connect } from 'react-redux';
import { accountTitleLabels } from 'platform/forms-system/src/js/constants';
import mask from 'platform/forms-system/src/js/utilities/ui/mask-string';

export const PaymentView = ({ formData = {}, originalData = {} }) => {
  const getBankData = name =>
    formData[name] ||
    formData['view:originalBankAccount']?.[`view:${name}`] ||
    originalData[`view:${name}`];

  const accountType = getBankData('accountType');
  const accountNumber = getBankData('accountNumber');
  const routingNumber = getBankData('routingNumber');

  return (
    <div className="vads-u-margin-x--4">
      <p>
        This is the bank account information we have on file for you. This is
        where we’ll send your payments.
      </p>
      <div className="blue-bar-block">
        <p>
          <strong>
            {accountTitleLabels[(accountType || '').toUpperCase()]}
          </strong>
        </p>
        <p data-testid="account-number">
          Account number: {mask(accountNumber, 4)}
        </p>
        <p data-testid="routing-number">
          Bank routing number: {mask(routingNumber, 4)}
        </p>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  originalData: state.form.data['view:originalBankAccount'],
});

export default connect(mapStateToProps)(PaymentView);
