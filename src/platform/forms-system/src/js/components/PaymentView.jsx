import React from 'react';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';

import { accountTitleLabels } from '../constants';
import viewifyFields from '../utilities/viewify-fields';
import mask, { srSubstitute } from '../utilities/ui/mask-string';

export const PaymentView = ({ formData = {}, originalData = {} }) => {
  const getBankData = name =>
    formData[name] ||
    formData['view:originalBankAccount']?.[`view:${name}`] ||
    originalData[`view:${name}`];

  const accountType = getBankData('accountType');
  const accountNumber = getBankData('accountNumber');
  const routingNumber = getBankData('routingNumber');
  const bankName = getBankData('bankName');

  const dataChanged = !isEqual(
    viewifyFields({
      accountType,
      accountNumber,
      routingNumber,
      bankName,
    }),
    originalData,
  );

  return (
    <>
      {!dataChanged && (
        <p>We’re currently paying your compensation to this account</p>
      )}
      <div className="blue-bar-block">
        <p>
          <strong>
            {accountTitleLabels[(accountType || '').toUpperCase()]}
          </strong>
        </p>
        <p>Account number: {mask(accountNumber, 4)}</p>
        <p>Bank routing number: {mask(routingNumber, 4)}</p>
        <p>Bank name: {bankName || srSubstitute('', 'is blank')}</p>
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  originalData: state.form.data['view:originalBankAccount'],
});

export default connect(mapStateToProps)(PaymentView);
