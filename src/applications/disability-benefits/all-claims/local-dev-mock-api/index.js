const moment = require('moment');
const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');

const responses = {
  ...commonResponses,

  'POST /v0/upload_supporting_evidence': {
    data: {
      attributes: {
        guid: '123fake-submission-id-567',
      },
    },
  },

  'POST /v0/disability_compensation_form/submit_all_claim': {
    data: {
      attributes: {
        guid: '123fake-submission-id-567',
      },
    },
  },

  'GET /v0/intent_to_file': {
    data: {
      id: '',
      type: 'evss_intent_to_file_intent_to_files_responses',
      attributes: {
        intentToFile: [
          {
            id: '1',
            creationDate: '2014-07-28T19:53:45.810+00:00',
            expirationDate: moment()
              .add(1, 'd')
              .format(),
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

  'GET /v0/ppiu/payment_information': {
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

  [`GET /v0/disability_compensation_in_progress_forms/`]: {
    formData: {
      veteran: {
        primaryPhone: '4445551212',
        emailAddress: 'test2@test1.net',
      },
      disabilities: [
        {
          name: 'First Condition',
          ratedDisabilityId: '0',
          ratingDecisionId: '63655',
          diagnosticCode: 5238,
          decisionCode: 'SVCCONNCTED',
          decisionText: 'Service Connected',
          ratingPercentage: 100,
        },
        {
          name: 'Second Condition',
          ratedDisabilityId: '1',
          ratingDecisionId: '63655',
          diagnosticCode: 5238,
          decisionCode: 'SVCCONNCTED',
          decisionText: 'Service Connected',
          ratingPercentage: 100,
        },
        {
          name: 'Diabetes mellitus0',
          ratedDisabilityId: '3',
          ratingDecisionId: '63655',
          diagnosticCode: 5238,
          decisionCode: 'SVCCONNCTED',
          decisionText: 'Service Connected',
          ratingPercentage: 100,
        },
      ],
    },
    metadata: {
      version: 0,
      prefill: true,
      returnUrl: '/veteran-information',
    },
  },
};

module.exports = responses;
