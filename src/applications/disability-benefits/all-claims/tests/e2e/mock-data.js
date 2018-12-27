const mock = require('../../../../../platform/testing/e2e/mock-helpers');

export const initInProgressMock = token => {
  mock(token, {
    path: '/v0/in_progress_forms/21-526EZ',
    verb: 'get',
    value: {
      formData: {
        veteran: {
          primaryPhone: '4445551212',
          emailAddress: 'test2@test1.net',
        },
        disabilities: [
          {
            name: 'Diabetes mellitus0',
            ratedDisabilityId: '0',
            ratingDecisionId: '63655',
            diagnosticCode: 5238,
            decisionCode: 'SVCCONNCTED',
            decisionText: 'Service Connected',
            ratingPercentage: 100,
          },
          {
            name: 'Diabetes mellitus1',
            ratedDisabilityId: '1',
            ratingDecisionId: '63655',
            diagnosticCode: 5238,
            decisionCode: 'SVCCONNCTED',
            decisionText: 'Service Connected',
            ratingPercentage: 100,
          },
        ],
        servicePeriods: [
          {
            serviceBranch: 'Air Force Reserve',
            dateRange: {
              from: '2001-03-21',
              to: '2014-07-21',
            },
          },
        ],
        reservesNationalGuardService: {
          obligationTermOfServiceDateRange: {
            from: '2007-05-22',
            to: '2008-06-05',
          },
        },
      },
      metadata: {
        version: 0,
        prefill: true,
        returnUrl: '/veteran-information',
      },
    },
  });
};

export const initDocumentUploadMock = () => {
  mock(null, {
    path: '/v0/claim_attachments',
    verb: 'post',
    value: {
      data: {
        attributes: {
          guid: '123fake-submission-id-567',
        },
      },
    },
  });
};

export const initApplicationSubmitMock = () => {
  mock(null, {
    path: '/v0/21-526EZ',
    verb: 'post',
    value: {
      data: {
        attributes: {
          guid: '123fake-submission-id-567',
        },
      },
    },
  });
};

export const initItfMock = token => {
  mock(token, {
    path: '/v0/intent_to_file',
    verb: 'get',
    value: {
      data: {
        id: '',
        type: 'evss_intent_to_file_intent_to_files_responses',
        attributes: {
          intentToFile: [
            {
              id: '1',
              creationDate: '2014-07-28T19:53:45.810+00:00',
              expirationDate: '2015-08-28T19:47:52.786+00:00',
              participantId: 1,
              source: 'EBN',
              status: 'active',
              type: 'compensation',
            },
            {
              id: '1',
              creationDate: '2014-07-28T19:53:45.810+00:00',
              expirationDate: '2015-08-28T19:47:52.788+00:00',
              participantId: 1,
              source: 'EBN',
              status: 'claim_recieved',
              type: 'compensation',
            },
            {
              id: '1',
              creationDate: '2014-07-28T19:53:45.810+00:00',
              expirationDate: '2015-08-28T19:47:52.789+00:00',
              participantId: 1,
              source: 'EBN',
              status: 'claim_recieved',
              type: 'compensation',
            },
            {
              id: '1',
              creationDate: '2014-07-28T19:53:45.810+00:00',
              expirationDate: '2015-08-28T19:47:52.789+00:00',
              participantId: 1,
              source: 'EBN',
              status: 'expired',
              type: 'compensation',
            },
            {
              id: '1',
              creationDate: '2014-07-28T19:53:45.810+00:00',
              expirationDate: '2015-08-28T19:47:52.790+00:00',
              participantId: 1,
              source: 'EBN',
              status: 'incomplete',
              type: 'compensation',
            },
          ],
        },
      },
    },
  });
};

export const initPaymentInformationMock = token => {
  mock(token, {
    path: '/v0/ppiu/payment_information',
    verb: 'get',
    value: {
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
                financialInstitutionName: 'Comerica',
                accountNumber: '9876543211234',
                financialInstitutionRoutingNumber: '042102115',
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
  });
};
