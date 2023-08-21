const _ = require('lodash');

const setInstitutionName = (obj, name) =>
  _.set(
    obj,
    'data.attributes.responses[0].paymentAccount.financialInstitutionName',
    name,
  );

const base = {
  data: {
    id: '',
    type: 'evss_ppiu_payment_information_responses',
    attributes: {
      responses: [
        {
          controlInformation: {
            canUpdateAddress: true,
            corpAvailIndicator: true,
            corpRecFoundIndicator: true,
            hasNoBdnPaymentsIndicator: true,
            identityIndicator: true,
            isCompetentIndicator: true,
            indexIndicator: true,
            noFiduciaryAssignedIndicator: true,
            notDeceasedIndicator: true,
          },
          paymentAccount: {
            accountType: 'Checking',
            financialInstitutionName: 'TEST BASE - PPIU',
            accountNumber: '*****4321',
            financialInstitutionRoutingNumber: '*****4974',
          },
          paymentAddress: {
            type: null,
            addressEffectiveDate: null,
            addressOne: null,
            addressTwo: null,
            addressThree: null,
            city: null,
            stateCode: null,
            zipCode: null,
            zipSuffix: null,
            countryName: null,
            militaryPostOfficeTypeCode: null,
            militaryStateCode: null,
          },
          paymentType: 'CNP',
        },
      ],
    },
  },
};

const isNotCompetent = _.set(
  _.cloneDeep(base),
  'data.attributes.responses[0].controlInformation.isCompetentIndicator',
  false,
);
setInstitutionName(isNotCompetent, 'TEST NOT COMPETENT FLAG - PPIU');

// fiduciary basically means a person who is not the veteran
// if they have a fiduciary, they can't update their payment info
const isFiduciary = _.set(
  _.cloneDeep(base),
  'data.attributes.responses[0].controlInformation.noFiduciaryAssignedIndicator',
  false,
);
setInstitutionName(isFiduciary, 'TEST FIDUCIARY FLAG - PPIU');

const isDeceased = _.set(
  _.cloneDeep(base),
  'data.attributes.responses[0].controlInformation.notDeceasedIndicator',
  false,
);
setInstitutionName(isDeceased, 'TEST DECEASED FLAG - PPIU');

// not eligible basically is a person who has no payment account
const notEligible = _.set(
  _.cloneDeep(base),
  'data.attributes.responses[0].paymentAccount',
  {
    accountType: null,
    financialInstitutionName: null,
    accountNumber: null,
    financialInstitutionRoutingNumber: null,
  },
);

const isEligible = _.set(
  _.cloneDeep(notEligible),
  'data.attributes.responses[0].paymentAddress',
  {
    type: 'DOMESTIC',
    addressEffectiveDate: '2019-01-01T00:00:00.000+00:00',
    addressOne: '1234 Test St',
    addressTwo: null,
    addressThree: null,
    city: 'Test City',
    stateCode: 'TN',
    zipCode: '12345',
  },
);

const errorResponse = {
  data: {
    errors: [{}],
  },
};

module.exports = {
  base,
  isDeceased,
  isFiduciary,
  isNotCompetent,
  notEligible,
  isEligible,
  errorResponse,
  updates: {
    success: _.set(
      _.cloneDeep(base),
      'data.attributes.responses[0].paymentAccount',
      {
        accountType: 'Checking',
        financialInstitutionName: 'UPDATED BANK NAME - SUCCESS - PPIU',
        accountNumber: '******0039',
        financialInstitutionRoutingNumber: '*****0021',
      },
    ),
    errors: {
      fraud: {
        errors: [
          {
            title: 'Unprocessable Entity',
            detail: 'One or more unprocessable user payment properties',
            code: '126',
            source: 'EVSS::PPIU::Service',
            status: '422',
            meta: {
              messages: [
                {
                  key: 'cnp.payment.generic.error.message',
                  severity: 'ERROR',
                  text:
                    'Generic CnP payment update error. Update response: Update Failed: GUIE50041&FABusnsTranRule(CFABUSNS_TRAN) Failed with Exception!! FILE: FABTInterfaceCreator.cpp LINE: 350This update is being elevated for additional review due to an Incident Flash associated with this Beneficiary: - An unexpected error was encountered. Please contact the System Administrator. Error is: GUIE50041&FABusnsTranRule(CFABUSNS_TRAN) Failed with Exception!! FILE: FABTInterfaceCreator.cpp LINE: 350This update is being elevated for additional review due to an Incident Flash associated with this Beneficiary:',
                },
              ],
            },
          },
        ],
      },
      phoneNumber: {
        errors: [
          {
            title: 'Unprocessable Entity',
            detail: 'One or more unprocessable user payment properties',
            code: '126',
            source: 'EVSS::PPIU::Service',
            status: '422',
            meta: {
              messages: [
                {
                  key: 'cnp.payment.generic.error.message',
                  severity: 'ERROR',
                  text:
                    'Generic CnP payment update error. Text needs to contain: day phone number',
                },
              ],
            },
          },
        ],
      },
      address: {
        errors: [
          {
            title: 'Unprocessable Entity',
            detail: 'One or more unprocessable user payment properties',
            code: '126',
            source: 'EVSS::PPIU::Service',
            status: '422',
            meta: {
              messages: [
                {
                  key: 'cnp.payment.generic.error.message',
                  severity: 'ERROR',
                  text:
                    'Generic CnP payment update error. Text needs to contain: address update',
                },
              ],
            },
          },
        ],
      },
      routingNumberInvalid: {
        errors: [
          {
            title: 'Unprocessable Entity',
            detail: 'One or more unprocessable user payment properties',
            code: '126',
            source: 'EVSS::PPIU::Service',
            status: '422',
            meta: {
              messages: [
                {
                  key: 'payment.accountRoutingNumber.invalidCheckSum',
                  severity: 'ERROR',
                  text: 'Invalid Routing Number',
                },
              ],
            },
          },
        ],
      },
      routingNumberFlagged: {
        errors: [
          {
            title: 'Unprocessable Entity',
            detail: 'Routing Number Flagged Test Error',
            code: '126',
            source: 'EVSS::PPIU::Service',
            status: '422',
            meta: {
              messages: [
                {
                  key: 'cnp.payment.routing.number.fraud.message',
                  severity: 'ERROR',
                  text: 'Routing number flaggged',
                },
              ],
            },
          },
        ],
      },
      invalidAddress: {
        errors: [
          {
            title: 'Unprocessable Entity',
            detail: 'Invalid Mailing Address Test Error',
            code: '126',
            source: 'EVSS::PPIU::Service',
            status: '422',
            meta: {
              messages: [
                {
                  key: 'cnp.payment.generic.error.message',
                  severity: 'ERROR',
                  text: 'address update',
                },
              ],
            },
          },
        ],
      },
      invalidPhoneNumber: {
        errors: [
          {
            title: 'Unprocessable Entity',
            detail: 'Invalid Phone Number Test Error',
            code: '126',
            source: 'EVSS::PPIU::Service',
            status: '422',
            meta: {
              messages: [
                {
                  key: 'cnp.payment.generic.error.message',
                  severity: 'ERROR',
                  text: 'day phone number',
                },
              ],
            },
          },
        ],
      },
      restrictionIndicator: {
        errors: [
          {
            title: 'Unprocessable Entity',
            detail: 'Payment Restrictions Test Error',
            code: '126',
            source: 'EVSS::PPIU::Service',
            status: '422',
            meta: {
              messages: [
                {
                  key: 'payment.restriction.indicators.present',
                  severity: 'ERROR',
                  text: 'payment restrictions',
                },
              ],
            },
          },
        ],
      },
    },
  },
};
