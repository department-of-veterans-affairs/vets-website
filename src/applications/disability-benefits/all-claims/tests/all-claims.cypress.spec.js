import moment from 'moment';

import { VA_FORM_IDS } from '../../../../platform/forms/constants';
import testData from './data/newOnly-test.json';
import testForm from '../../../../platform/testing/e2e/cypress/support/form-tester';

/* eslint-disable camelcase */
const mockUser = {
  data: {
    attributes: {
      profile: {
        sign_in: {
          service_name: 'idme',
        },
        email: 'fake@fake.com',
        loa: { current: 3 },
        first_name: 'Jane',
        middle_name: '',
        last_name: 'Doe',
        gender: 'F',
        birth_date: '1985-01-01',
        verified: true,
      },
      veteran_status: {
        status: 'OK',
        is_veteran: true,
        served_in_military: true,
      },
      in_progress_forms: [
        {
          form: VA_FORM_IDS.FORM_10_10EZ,
          metadata: {},
        },
      ],
      prefills_available: [VA_FORM_IDS.FORM_21_526EZ],
      services: [
        'facilities',
        'hca',
        'edu-benefits',
        'evss-claims',
        'form526',
        'user-profile',
        'health-records',
        'rx',
        'messaging',
      ],
      va_profile: {
        status: 'OK',
        birth_date: '19511118',
        family_name: 'Hunter',
        gender: 'M',
        given_names: ['Julio', 'E'],
        active_status: 'active',
      },
    },
  },
  meta: { errors: null },
};

const mockItf = {
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
};

const mockDocumentUpload = {
  data: {
    attributes: {
      guid: '123fake-submission-id-567',
    },
  },
};

const mockPaymentInformation = {
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
};
/* eslint-enable camelcase */

const testConfig = {
  pageHooks: {
    '/disability/file-disability-claim-form-21-526ez/introduction': () => {
      // Hit the start button
      cy.findAllByText(/start/i, { selector: 'button' })
        .first()
        .click();

      // Click past the ITF message
      cy.findByText(/continue/i, { selector: 'button' }).click();
    },
    '/disability/file-disability-claim-form-21-526ez/disabilities/rated-disabilities': () => {
      cy.get('@testConfig').then(({ testData: { data } }) => {
        data.ratedDisabilities.forEach((disability, index) => {
          if (disability['view:selected']) {
            cy.get(`input[name="root_ratedDisabilities_${index}"]`).click();
          }
        });
        cy.findByText(/continue/i, { selector: 'button' }).click();
      });
    },
    '/disability/file-disability-claim-form-21-526ez/payment-information': () => {
      cy.get('@testConfig').then(({ testData: { data } }) => {
        if (data['view:bankAccount']) {
          cy.get('form.rjsf').then($form => {
            const editButton = $form.find('.usa-button-primary.edit-button');
            if (editButton) editButton.click();
          });

          cy.fillPage();
          cy.findByText(/save/i, { selector: 'button' }).click();
        }

        cy.findByText(/continue/i, { selector: 'button' }).click();
      });
    },
  },
  setup: () => {
    // Set up signed in session.
    window.localStorage.setItem('hasSession', true);

    // Set up mock API.
    cy.route('GET', '/v0/user', mockUser)
      .route('GET', '/v0/intent_to_file', mockItf)
      .route('GET', '/v0/upload_supporting_evidence', mockDocumentUpload)
      .route('GET', '/v0/ppiu/payment_information', mockPaymentInformation)
      .route('POST', '/v0/disability_compensation_form/submit_all_claim', {
        data: {
          attributes: {
            guid: '123fake-submission-id-567',
          },
        },
      });
  },
  setupPerTest: () => {
    // Pre-fill with the expected ratedDisabilities,
    // but nix view:selected since that's not pre-filled
    const sanitizedRatedDisabilities = (
      testData.data.ratedDisabilities || []
    ).map(({ 'view:selected': _, ...obj }) => obj);

    cy.route('GET', 'v0/in_progress_forms/21-526EZ', {
      formData: {
        veteran: {
          primaryPhone: '4445551212',
          emailAddress: 'test2@test1.net',
        },
        disabilities: sanitizedRatedDisabilities,
      },
      metadata: {
        version: 0,
        prefill: true,
        returnUrl: '/veteran-information',
      },
    });
  },
  testData,
  url: '/disability/file-disability-claim-form-21-526ez/introduction',
  // TODO: Remove this in favor of importing the formConfig and finding them all
  arrayPages: [
    {
      path: 'new-disabilities/follow-up/:index',
      arrayPath: 'newDisabilities',
    },
  ],
};

testForm('523 all claims', testConfig);
