import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import React from 'react';
import profileContactInfo from 'platform/forms-system/src/js/definitions/profileContactInfo';
import {
  COUNTRY_VALUES,
  COUNTRY_NAMES,
  REJECT_WHITESPACE_ONLY,
} from 'platform/forms-system/src/js/definitions/profileAddress';
import configService from '../utilities/configService';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import {
  authorizeMedical,
  authorizeMedicalSelect,
  authorizeAddress,
  authorizeInsideVA,
  authorizeOutsideVA,
  formToggle,
  authorizeOutsideVANames,
  claimantRelationship,
  claimantPersonalInformation,
  confirmClaimantPersonalInformation,
  claimantContactPhoneEmail,
} from '../pages';

import { prefillTransformer } from '../prefill-transformer';
import {
  preparerIsVeteranAndHasPrefill,
  preparerIsVeteran,
  isLoggedIn,
} from '../utilities/helpers';

import initialData from '../tests/fixtures/data/test-data.json';
import ClaimantType from '../components/ClaimantType';

// import { prefillTransformer } from '../prefill-transformer';

// import ClaimantType from '../components/ClaimantType';

const mockData = initialData;

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

const formConfigFromService = configService.getFormConfig();

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'appoint-a-rep-21-22-and-21-22A',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-22-AND-21-22A',
  saveInProgress: {
    messages: {
      inProgress:
        'Your VA accredited representative appointment application (21-22-AND-21-22A) is in progress.',
      expired:
        'Your saved VA accredited representative appointment application (21-22-AND-21-22A) has expired. If you want to apply for VA accredited representative appointment, please start a new application.',
      saved:
        'Your VA accredited representative appointment application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
  v3SegmentedProgressBar: true,
  additionalRoutes: [
    {
      path: 'claimant-type',
      component: ClaimantType,
      pageKey: 'claimant-type',
      depends: () => true,
    },
  ],
  savedFormMessages: {
    notFound:
      'Please start over to apply for VA accredited representative appointment.',
    noAuth:
      'Please sign in again to continue your application for VA accredited representative appointment.',
  },
  title: 'Fill out your form to appoint a VA accredited representative or VSO',
  subTitle: formConfigFromService.subTitle || 'VA Forms 21-22 and 21-22a',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    formToggle: {
      title: ' ',
      pages: {
        repType: {
          path: 'rep-type',
          title: ' ',
          uiSchema: formToggle.uiSchema,
          schema: formToggle.schema,
        },
      },
    },
    yourInformation: {
      title: 'Your information',
      pages: {
        claimantRelationship: {
          depends: formData => !preparerIsVeteran({ formData }),
          path: 'claimant-relationship',
          title: 'Tell us how you’re connected to the veteran',
          uiSchema: claimantRelationship.uiSchema,
          schema: claimantRelationship.schema,
        },
        claimantPersonalInformation: {
          path: 'claimant-personal-information',
          depends: formData => !preparerIsVeteranAndHasPrefill({ formData }),
          initialData:
            /* istanbul ignore next */
            !!mockData && environment.isLocalhost() && !window.Cypress
              ? mockData
              : undefined,
          title: 'Your Personal Information',
          uiSchema: claimantPersonalInformation.uiSchema,
          schema: claimantPersonalInformation.schema,
        },
        confirmClaimantPersonalInformation: {
          path: 'confirm-claimant-personal-information',
          depends: formData => preparerIsVeteranAndHasPrefill({ formData }),
          initialData:
            /* istanbul ignore next */
            !!mockData && environment.isLocalhost() && !window.Cypress
              ? mockData
              : undefined,
          title: 'Your Personal Information',
          uiSchema: confirmClaimantPersonalInformation.uiSchema,
          schema: confirmClaimantPersonalInformation.schema,
          editModeOnReviewPage: true,
        },
        claimantContactPhoneEmail: {
          path: 'claimant-contact-phone-email',
          title: 'Your phone number and email address',
          uiSchema: claimantContactPhoneEmail.uiSchema,
          schema: claimantContactPhoneEmail.schema,
          editModeOnReviewPage: true,
        },
        ...profileContactInfo({
          contactInfoPageKey: 'confirmContactInfo',
          // contactPath: 'claimant-contact', // default path
          // contactInfoRequiredKeys: [], // nothing required
          // included: ['primaryPhone', 'mailingAddress', 'email'], // default
          depends: formData => isLoggedIn({ formData }),
          // ** These are ALL default values **
          contactPath: 'claimant-contact',
          phoneSchema: {
            type: 'object',
            properties: {
              countryCode: {
                type: 'string',
                pattern: '^[0-9]+$',
                minLength: 1,
                maxLength: 3,
              },
              areaCode: {
                type: 'string',
                pattern: '^[0-9]{1,4}$',
                minLength: 1,
                maxLength: 4,
              },
              phoneNumber: {
                type: 'string',
                pattern: '^[0-9]{1,14}$',
                minLength: 1,
                maxLength: 14,
              },
              phoneNumberExt: {
                type: 'string',
                pattern: '^[a-zA-Z0-9]{1,10}$',
                minLength: 1,
                maxLength: 10,
              },
            },
            required: ['areaCode', 'phoneNumber'],
          },
          emailSchema: {
            type: 'string',
            format: 'email',
            minLength: 6,
            maxLength: 255,
          },
          addressSchema: {
            type: 'object',
            required: ['country', 'street', 'city', 'postalCode'],
            properties: {
              isMilitary: {
                type: 'boolean',
              },
              country: {
                type: 'string',
                enum: COUNTRY_VALUES, // from /definitions/profileAddress
                enumNames: COUNTRY_NAMES, // from /definitions/profileAddress
              },
              street: {
                type: 'string',
                minLength: 1,
                maxLength: 100,
                pattern: REJECT_WHITESPACE_ONLY, // from /definitions/profileAddress
              },
              street2: {
                type: 'string',
                minLength: 1,
                maxLength: 100,
                pattern: REJECT_WHITESPACE_ONLY, // from /definitions/profileAddress
              },
              street3: {
                type: 'string',
                minLength: 1,
                maxLength: 100,
                pattern: REJECT_WHITESPACE_ONLY, // from /definitions/profileAddress
              },
              city: {
                type: 'string',
              },
              state: {
                type: 'string',
              },
              postalCode: {
                type: 'string',
              },
            },
          },

          // ** Object key wrapping contact info, e.g. **
          // ** { veteran: { mailingAddress: {}, primaryPhone: {}, ... } }
          wrapperKey: 'veteran',
          addressKey: 'mailingAddress',
          primaryPhoneKey: 'primaryPhone',
          emailKey: 'email',
          contactInfoRequiredKeys: ['mailingAddress', 'email', 'primaryPhone'],

          // ** Use the same keys as defined above **
          included: ['primaryPhone', 'mailingAddress', 'email'],

          content: {
            title: 'Contact information',
            description: (
              <>
                <p>
                  This is the contact information we have on file for you. We’ll
                  send any updates or information about your application to this
                  address.
                </p>
              </>
            ),

            // ** Page titles & link aria-labels **
            editPrimaryNumber: 'Edit primary phone number',
            editEmail: 'Edit email address',
            editMailingAddress: 'Edit mailing address',

            edit: 'Edit', // link text
            editLabel: 'Edit contact information', // link aria-label
            update: 'Update page', // update button on review & submit page
            updated: 'updated', // alert updated text

            // ** Missing info alert messaging **
            missingPrimaryNumber: 'primary phone',
            missingAddress: 'mailing address',
            missingEmail: 'email address',
            alertContent:
              'The missing information has been added to your application. You may continue.',

            // ** Review & submit & section titles **
            mailingAddress: 'Mailing address',
            primaryPhone: 'Home phone number',
            email: 'Email address',
            country: 'Country',
            address1: 'Street address',
            address2: 'Street address line 2',
            address3: 'Street address line 3',
            city: 'City',
            state: 'State',
            province: 'Province',
            postal: 'Postal code',

            // // ** Error on review & submit **
            // missingEmailError: 'Missing email address',

            // // ** contact info depends callback
            // depends = null,
          },
        }),
      },
    },
    authorization: {
      title: 'Accredited representative authorizations',
      pages: {
        authorizeMedical: {
          path: 'authorize-medical',
          title: 'Authorization for Certain Medical Records',
          uiSchema: authorizeMedical.uiSchema,
          schema: authorizeMedical.schema,
        },
        authorizeMedicalSelect: {
          path: 'authorize-medical/select',
          depends: formData => {
            return (
              formData?.authorizationRadio ===
              'Yes, but they can only access some of these types of records'
            );
          },
          title: 'Authorization for Certain Medical Records - Select',
          uiSchema: authorizeMedicalSelect.uiSchema,
          schema: authorizeMedicalSelect.schema,
        },
        authorizeAddress: {
          path: 'authorize-address',
          title: 'Authorization to change your address',
          uiSchema: authorizeAddress.uiSchema,
          schema: authorizeAddress.schema,
        },
        authorizeInsideVA: {
          path: 'authorize-inside-va',
          depends: formData => {
            return formData?.repTypeRadio === ('Attorney' || 'Claims Agent');
          },
          title: 'Authorization for Access Inside VA Systems',
          uiSchema: authorizeInsideVA.uiSchema,
          schema: authorizeInsideVA.schema,
        },
        authorizeOutsideVA: {
          path: 'authorize-outside-va',
          depends: formData => {
            return formData?.repTypeRadio === ('Attorney' || 'Claims Agent');
          },
          title: 'Authorization for Access Outside VA Systems',
          uiSchema: authorizeOutsideVA.uiSchema,
          schema: authorizeOutsideVA.schema,
        },
        authorizeOutsideVANames: {
          path: 'authorize-outside-va/names',
          depends: formData => {
            return formData?.repTypeRadio === ('Attorney' || 'Claims Agent');
          },
          title: 'Authorization for Access Outside of VA Systems',
          uiSchema: authorizeOutsideVANames.uiSchema,
          schema: authorizeOutsideVANames.schema,
        },
      },
    },
  },
};

configService.setFormConfig(formConfig);

export default formConfig;
