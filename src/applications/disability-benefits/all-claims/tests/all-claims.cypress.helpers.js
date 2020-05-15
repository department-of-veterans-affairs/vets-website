import moment from 'moment';

import { VA_FORM_IDS } from 'platform/forms/constants';

/* eslint-disable camelcase */
export const mockUser = {
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

export const mockItf = {
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

export const mockDocumentUpload = {
  data: {
    attributes: {
      guid: '123fake-submission-id-567',
    },
  },
};

export const mockPaymentInformation = {
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

export const mockApplicationSubmit = {
  data: {
    attributes: {
      guid: '123fake-submission-id-567',
    },
  },
};
/* eslint-enable camelcase */
