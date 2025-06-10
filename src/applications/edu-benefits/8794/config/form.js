import React from 'react';
// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

// Example of an imported schema:
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/22-8794-schema.json';

import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import * as address from 'platform/forms-system/src/js/definitions/address';
import fullSchema from '../22-8794-schema.json';

// import fullSchema from 'vets-json-schema/dist/22-8794-schema.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

// pages
import {
  designatingOfficial,
  primaryOfficial,
  institutionDetails,
  institutionDetailsFacility,
  primaryOfficialTraining,
  primaryOfficialBenefitStatus,
  institutionDetailsNoFacilityDescription,
  institutionNameAndAddress,
} from '../pages';
import directDeposit from '../pages/directDeposit';

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'Edu-8794-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '22-8794',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your education benefits application (22-8794) is in progress.',
    //   expired: 'Your saved education benefits application (22-8794) has expired. If you want to apply for education benefits, please start a new application.',
    //   saved: 'Your education benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to continue your application for education benefits.',
  },
  title: "Update your institution's list of certifying officials",
  subTitle: () => (
    <p className="vads-u-margin-bottom--0">
      Designation of certifying official(s) (VA Form 22-8794)
    </p>
  ),
  useCustomScrollAndFocus: true,
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    designatingOfficialChapter: {
      title: 'Designating official',
      pages: {
        designatingOfficial: {
          path: 'designating-official',
          title: 'Your information',
          uiSchema: designatingOfficial.uiSchema,
          schema: designatingOfficial.schema,
        },
      },
    },
    institutionDetailsChapter: {
      title: 'Institution details',
      pages: {
        institutionDetails: {
          path: 'institution-details',
          title: 'Institution details',
          uiSchema: institutionDetails.uiSchema,
          schema: institutionDetails.schema,
        },
        institutionDetailsFacility: {
          path: 'institution-details-3',
          title: 'Institution details',
          uiSchema: institutionDetailsFacility.uiSchema,
          schema: institutionDetailsFacility.schema,
          depends: formData =>
            formData.institutionDetails.hasVaFacilityCode === true,
        },
        institutionDetailsNoFacilityDescription: {
          path: 'institution-details-1',
          title: 'Institution details',
          uiSchema: institutionDetailsNoFacilityDescription.uiSchema,
          schema: institutionDetailsNoFacilityDescription.schema,
          depends: formData =>
            formData.institutionDetails.hasVaFacilityCode === false,
        },
        institutionNameAndAddress: {
          path: 'institution-details-2',
          title: 'Institution details',
          uiSchema: institutionNameAndAddress.uiSchema,
          schema: institutionNameAndAddress.schema,
          depends: formData =>
            formData.institutionDetails.hasVaFacilityCode === false,
        },
      },
    },
    primaryOfficialChapter: {
      title: 'Primary certifying official',
      pages: {
        primaryOfficialDetails: {
          path: 'primary-certifying-official',
          title: 'Tell us about your primary certifying official',
          uiSchema: primaryOfficial.uiSchema,
          schema: primaryOfficial.schema,
        },
        primaryOfficialTraining: {
          path: 'primary-certifying-official-1',
          title: 'Section 305 training',
          uiSchema: primaryOfficialTraining.uiSchema,
          schema: primaryOfficialTraining.schema,
        },
        primaryOfficialBenefitStatus: {
          path: 'primary-certifying-official-2',
          title: 'Benefit status',
          uiSchema: primaryOfficialBenefitStatus.uiSchema,
          schema: primaryOfficialBenefitStatus.schema,
        },
      },
    },
    additionalInformationChapter: {
      title: 'Additional Information',
      pages: {
        contactInformation: {
          path: 'contact-information',
          title: 'Contact Information',
          uiSchema: {
            address: address.uiSchema('Mailing address'),
            email: {
              'ui:title': 'Primary email',
            },
            altEmail: {
              'ui:title': 'Secondary email',
            },
            phoneNumber: phoneUI('Daytime phone'),
          },
          schema: {
            type: 'object',
            properties: {
              address: address.schema(fullSchema, true),
              email: {
                type: 'string',
                format: 'email',
              },
              altEmail: {
                type: 'string',
                format: 'email',
              },
              phoneNumber: usaPhone,
            },
          },
        },
        directDeposit: {
          path: 'direct-deposit',
          title: 'Direct Deposit',
          uiSchema: directDeposit.uiSchema,
          schema: directDeposit.schema,
        },
      },
    },
  },
};

export default formConfig;
