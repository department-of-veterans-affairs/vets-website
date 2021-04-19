import React from 'react';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';

import { accountTitleLabels } from 'platform/forms-system/src/js/constants';
import viewifyFields from 'platform/forms-system/src/js/utilities/viewify-fields';
import mask, {
  srSubstitute,
} from 'platform/forms-system/src/js/utilities/ui/mask-string';

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
    <div className="vads-u-margin-x--4">
      {!dataChanged && (
        <p>
          This is the bank account information we have on file for you. We’ll
          send your housing payment to this account.
        </p>
      )}
      <div className="blue-bar-block">
        <p>
          <strong>
            {accountTitleLabels[(accountType || '').toUpperCase()]}
          </strong>
        </p>
        <p data-testid="account-number">
          Bank account number: {mask(accountNumber, 4)}
        </p>
        <p data-testid="routing-number">
          Bank routing number: {mask(routingNumber, 4)}
        </p>
        {bankName && (
          <p data-testid="bank-name">
            Bank name: {bankName || srSubstitute('', 'is blank')}
          </p>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  originalData: state.form.data['view:originalBankAccount'],
});

export default connect(mapStateToProps)(PaymentView);
