import React from 'react';

import AsyncDisplayWidget from '../components/AsyncDisplayWidget';

import { srSubstitute } from '../helpers';

export const accountLabels = {
  CHECKING: 'Checking account',
  SAVINGS: 'Savings account',
  NOBANK: 'I don’t have a bank account'
};

const accountTitleLabels = {
  CHECKING: 'Checking Account',
  SAVINGS: 'Savings Account',
  NOBANK: 'No Bank Account'
};

const NOBANK = 'NOBANK';

export const paymentInformationViewField = (response) => {
  const {
    accountType,
    accountNumber,
    financialInstitutionRoutingNumber: routingNumber,
    financialInstitutionName: bankName,
  } = response;
  let accountNumberString;
  let routingNumberString;
  let bankNameString;
  const mask = (string, unmaskedLength) => {
    const maskedString = srSubstitute(`${'●'.repeat(string.length - unmaskedLength)}-`, 'ending with');
    return <span>{maskedString}{string.slice(unmaskedLength * -1)}</span>;
  };

  if (accountType !== NOBANK) {
    accountNumberString = (
      <p>
        Account number: {mask(accountNumber, 4)}
      </p>
    );
    routingNumberString = (
      <p>
        Routing number: {mask(routingNumber, 4)}
      </p>
    );
    bankNameString = <p>Bank name: {bankName}</p>;
  }
  return (
    <div>
      <p>
        <strong>{accountTitleLabels[accountType]}</strong>
      </p>
      {accountNumberString}
      {routingNumberString}
      {bankNameString}
    </div>
  );
};

function fetchPaymentInformation() {
  return Promise.resolve({
    // Act like we get this from the api
    data: {
      attributes: {
        responses: [
          {
            controlInformation: {
              canUpdateAddress: true,
              corpAvailIndicator: true,
              corpRecFoundIndicator: true,
              hasNoBdnPaymentsIndicator: true,
              identityIndicator: true,
              indexIndicator: true,
              isCompetentIndicator: true,
              noFiduciaryAssignedIndicator: true,
              notDeceasedIndicator: true
            },
            paymentAccount: {
              accountNumber: '9876543211234',
              accountType: 'Checking',
              financialInstitutionName: 'Comerica',
              financialInstitutionRoutingNumber: '042102115'
            },
            paymentAddress: {
              addressEffectiveDate: '2018-06-07T22:47:21.873Z',
              addressOne: 'First street address line',
              addressTwo: 'Second street address line',
              addressThree: 'Third street address line',
              city: 'AdHocville',
              stateCode: 'OR',
              countryName: 'USA',
              militaryPostOfficeTypeCode: 'Military PO',
              militaryStateCode: 'AP',
              zipCode: '12345',
              zipSuffix: '6789',
              type: 'Domestic'
            },
            paymentType: 'CNP'
          }
        ]
      },
      id: {},
      type: 'evss_ppiu_payment_information_responses'
    }
  }).then(response => {
    // Return only the bit the UI cares about
    return response.data.attributes.responses[0].paymentAccount;
  });
}

export const uiSchema = {
  'ui:title': 'Payment information',
  'ui:field': 'StringField',
  'ui:widget': AsyncDisplayWidget,
  'ui:options': {
    callback: fetchPaymentInformation,
    viewComponent: paymentInformationViewField,
    failureComponent: () => <div>Woops</div>
  }
};

export const schema = {
  type: 'object',
  properties: {}
};
