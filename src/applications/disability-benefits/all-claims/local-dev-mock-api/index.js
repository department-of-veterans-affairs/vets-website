const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');
const formData2 = require('./formData2.json');
const userData = require('./userData.json');
const featureToggles = require('./featureToggles.json');
const ratedDisabilities = require('./ratedDisabilities.json');
const serviceBranches = require('./serviceBranches.json');
const ptsdClassifications = require('./ptsdClassifications.json');

const responses = {
  ...commonResponses,
  'GET /v0/user': userData,
  'GET /v0/feature_toggles': featureToggles,
  'GET /v0/disability_compensation_form/rated_disabilities': ratedDisabilities,
  'POST /v0/disability_compensation_form/validate_0781': {
    data: {
      attributes: {
        valid: true,
        errors: [],
      },
    },
  },
  'POST /v0/disability_compensation_form/validate': {
    data: {
      attributes: {
        valid: true,
        errors: [],
        warnings: [],
      },
    },
  },
  'POST /v0/disability_compensation_form/submit_0781': {
    data: {
      attributes: {
        guid: '123fake-0781-submission-id-567',
        submissionDate: new Date().toISOString(),
      },
    },
  },
  'GET /v0/disability_compensation_form/ptsd_classifications': ptsdClassifications,
  'POST /v0/mvi_users/21-0966': {
    data: {
      attributes: {
        status: 'success',
      },
    },
  },
  'GET /v0/user/session': {
    data: {
      attributes: {
        loggedIn: true,
        sessionExpiry: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      },
    },
  },
  'POST /v0/upload_supporting_evidence': {
    data: {
      attributes: {
        guid: '123fake-submission-id-567',
      },
    },
  },
  'GET /v0/upload_supporting_evidence': {
    data: {
      attributes: {
        guid: '123fake-upload-guid-567',
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
  'GET /v0/disability_compensation_form/submission_status/:id': {
    data: {
      attributes: {
        status: 'success',
        detail: 'Claim submitted successfully',
      },
    },
  },
  'GET /v0/disability_compensation_form/separation_locations': {
    separationLocations: [
      {
        code: '98283',
        description: 'AAFES',
      },
      {
        code: '98956',
        description: 'Facility A',
      },
      {
        code: '98284',
        description: 'Facility B',
      },
    ],
  },
  // Mock API for service branches
  'GET /v0/benefits_reference_data/service-branches': serviceBranches,
  'GET /v0/intent_to_file': {
    data: {
      id: '',
      type: 'evss_intent_to_file_intent_to_files_responses',
      attributes: {
        intentToFile: [
          {
            id: '1',
            creationDate: '2014-07-28T19:53:45.810+00:00',
            expirationDate: new Date(
              new Date().getTime() + 24 * 60 * 60 * 1000,
            ).toISOString(),
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
  'POST /v0/intent_to_file': {
    data: {
      id: '1',
      type: 'intent_to_file',
      attributes: {
        intentToFile: {
          id: '1',
          creationDate: '2024-01-21T19:53:45.810+00:00',
          expirationDate: '2025-01-21T19:53:45.810+00:00',
          participantId: 1,
          source: 'EBN',
          status: 'active',
          type: 'compensation',
        },
      },
    },
  },
  'POST /v0/intent_to_file/compensation': {
    data: {
      attributes: {
        intentToFile: {
          id: '1',
          creationDate: new Date().toISOString(),
          expirationDate: new Date(
            new Date().getTime() + 365 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          participantId: 1,
          source: 'EBN',
          status: 'active',
          type: 'compensation',
        },
      },
      id: {},
      type: 'evss_intent_to_file_intent_to_files_responses',
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
  [`GET /v0/disability_compensation_in_progress_forms/21-526EZ`]: formData2,
  [`PUT /v0/disability_compensation_in_progress_forms/21-526EZ`]: {
    data: {
      id: '1234',
      type: 'in_progress_forms',
      attributes: {
        formId: '21-526EZ',
        createdAt: '2020-06-30T00:00:00.000Z',
        updatedAt: '2020-06-30T00:00:00.000Z',
        metadata: {
          version: 1,
          returnUrl: '/review-and-submit',
          savedAt: 1593500000000,
          lastUpdated: 1593500000000,
          expiresAt: 99999999999,
          submission: {
            status: false,
            errorMessage: false,
            id: false,
            timestamp: false,
            hasAttemptedSubmit: false,
          },
          inProgressFormId: 1234,
        },
      },
    },
  },
};

module.exports = responses;
