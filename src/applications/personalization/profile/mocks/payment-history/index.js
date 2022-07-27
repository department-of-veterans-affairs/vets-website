const simplePaymentHistory = {
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
            financialInstitutionName: 'NAVY FEDERAL CREDIT UNION',
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

const isNotCompetent = {
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
            isCompetentIndicator: false,
            indexIndicator: true,
            noFiduciaryAssignedIndicator: true,
            notDeceasedIndicator: true,
          },
          paymentAccount: {
            accountType: 'Checking',
            financialInstitutionName: 'NAVY FEDERAL CREDIT UNION',
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

const isFiduciary = {
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
            noFiduciaryAssignedIndicator: false,
            notDeceasedIndicator: true,
          },
          paymentAccount: {
            accountType: 'Checking',
            financialInstitutionName: 'NAVY FEDERAL CREDIT UNION',
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

const isDeceased = {
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
            notDeceasedIndicator: false,
          },
          paymentAccount: {
            accountType: 'Checking',
            financialInstitutionName: 'NAVY FEDERAL CREDIT UNION',
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

const notEligible = {
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
            accountType: null,
            financialInstitutionName: null,
            accountNumber: null,
            financialInstitutionRoutingNumber: null,
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

const errorResponse = {
  data: {
    errors: [{}],
  },
};

module.exports = {
  paymentHistory: {
    isDeceased,
    isFiduciary,
    isNotCompetent,
    simplePaymentHistory,
    notEligible,
    errorResponse,
  },
  paymentInformation: {
    saved: {
      success: {
        data: {
          id: '',
          type: 'evss_ppiu_payment_information_responses',
          attributes: {
            responses: [
              {
                controlInformation: {
                  canUpdateAddress: false,
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
                  accountType: 'Savings',
                  financialInstitutionName: 'JPMORGAN CHASE BANK, NA',
                  accountNumber: '******0039',
                  financialInstitutionRoutingNumber: '*****0021',
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
      },
    },
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
