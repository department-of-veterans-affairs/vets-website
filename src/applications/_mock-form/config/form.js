// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/00-1234-schema.json';

// In a real app this would not be imported directly; instead the schema that
// is imported from vets-json-schema should include these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import { VA_FORM_IDS } from 'platform/forms/constants';
import profileContactInfo from 'platform/forms-system/src/js/definitions/profileContactInfo';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import applicantInformation from '../pages/applicantInformation';
import serviceHistory from '../pages/serviceHistory';
import contactInfoSettings from '../pages/contactInfoSettings';
import contactInformation1 from '../pages/contactInformation1';
import contactInformation2 from '../pages/contactInformation2';
import directDeposit from '../pages/directDeposit';
import expandUnder from '../pages/expandUnder';
import conditionalFields from '../pages/conditionalFields';
import conditionalPages from '../pages/conditionalPages';
import radioButtonGroup from '../pages/radioButtonGroup';
import checkboxGroupPattern from '../pages/checkboxGroupPattern';

import singleCheckbox from '../pages/singleCheckbox';
import groupCheckbox from '../pages/checkboxGroupValidation';

// const { } = fullSchema.properties;
// const { } = fullSchema.definitions;

import initialData from '../tests/fixtures/data/test-data.json';

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'mock-1234',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_MOCK,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your Mock form application (00-1234) is in progress.',
    //   expired: 'Your saved Mock form application (00-1234) has expired. If you want to apply for Mock form, please start a new application.',
    //   saved: 'Your Mock form application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: false,
  savedFormMessages: {
    notFound: 'Please start over to apply for Mock form.',
    noAuth: 'Please sign in again to continue your application for Mock form.',
  },
  title: 'Mock Form',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    contactInfo: {
      title: 'Contact info',
      pages: {
        contactInfoSettings: {
          title: 'Section Title: Required contact info',
          path: 'contact-info-required',
          uiSchema: contactInfoSettings.uiSchema,
          schema: contactInfoSettings.schema,
        },

        // ** Contact info example; none required, but show all entries
        ...profileContactInfo({
          contactInfoPageKey: 'confirmContactInfo',
          contactPath: 'contact-information', // default path
          contactInfoRequiredKeys: [], // nothing required
          included: ['mobilePhone', 'homePhone', 'mailingAddress', 'email'], // default
          depends: formData => formData.contactInfoSettings === 'none',
          /* * /
          // ** These are ALL default values **
          contactPath: 'contact-information',
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
          // ** { veteran: { mailingAddress: {}, homePhone: {}, ... } }
          wrapperKey: 'veteran',
          addressKey: 'mailingAddress',
          homePhoneKey: 'homePhone',
          mobilePhoneKey: 'mobilePhone',
          emailKey: 'email',
          contactInfoRequiredKeys: [
            'mailingAddress',
            'email',
            'homePhone|mobilePhone', // homePhone OR mobilePhone required
            // 'homePhone', // only homePhone required
            // 'mobilePhone', // only mobilePhone required
          ],

          // ** Use the same keys as defined above **
          included: ['mobilePhone', 'homePhone', 'mailingAddress', 'email'],

          content: {
            title: 'Contact information',
            description: (
              <>
                <p>
                  This is the contact information we have on file for you. We’ll
                  send any updates or information about your application to this
                  address.
                </p>
                <p>
                  <strong>Note:</strong> Any updates you make here will be
                  reflected in your VA.gov profile.
                </p>
              </>
            ),

            // ** Page titles & link aria-labels **
            editHomePhone: 'Edit home phone number',
            editMobilePhone: 'Edit mobile phone number',
            editEmail: 'Edit email address',
            editMailingAddress: 'Edit mailing address',

            edit: 'Edit', // link text
            editLabel: 'Edit contact information', // link aria-label
            update: 'Update page', // update button on review & submit page
            updated: 'updated', // alert updated text

            // ** Missing info alert messaging **
            missingHomeOrMobile: 'home or mobile phone',
            missingHomePhone: 'home phone',
            missingMobilePhone: 'mobile phone',
            missingAddress: 'mailing address',
            missingEmail: 'email address',
            alertContent:
              'The missing information has been added to your application. You may continue.',

            // ** Review & submit & section titles **
            mailingAddress: 'Mailing address',
            mobilePhone: 'Mobile phone number',
            homePhone: 'Home phone number',
            email: 'Email address',
            country: 'Country',
            address1: 'Street address',
            address2: 'Street address line 2',
            address3: 'Street address line 3',
            city: 'City',
            state: 'State',
            province: 'Province',
            postal: 'Postal code',

            // ** Error on review & submit **
            missingEmailError: 'Missing email address',

            // ** contact info depends callback
            depends = null,
          },
          /* */
        }),

        // show & require email
        ...profileContactInfo({
          contactInfoPageKey: 'confirmContactInfo2',
          contactPath: 'contact-info-with-email',
          contactInfoRequiredKeys: ['email'],
          included: ['email'],
          depends: formData => formData.contactInfoSettings === 'email',
        }),

        // show & require email, mailing address & home phone
        ...profileContactInfo({
          contactInfoPageKey: 'confirmContactInfo3',
          contactPath: 'contact-info-with-home-phone',
          contactInfoRequiredKeys: ['mailingAddress', 'email', 'homePhone'],
          included: ['homePhone', 'mailingAddress', 'email'],
          depends: formData => formData.contactInfoSettings === 'home',
        }),

        // show & require email, mailing address & mobile phone
        ...profileContactInfo({
          contactInfoPageKey: 'confirmContactInfo4',
          contactPath: 'contact-info-with-mobile-phone',
          contactInfoRequiredKeys: ['mailingAddress', 'email', 'mobilePhone'],
          included: ['mobilePhone', 'mailingAddress', 'email'],
          depends: formData => formData.contactInfoSettings === 'mobile',
        }),

        // show all & require all
        ...profileContactInfo({
          contactInfoPageKey: 'confirmContactInfo5',
          contactPath: 'contact-info-all',
          contactInfoRequiredKeys: [
            'mailingAddress',
            'email',
            'homePhone|mobilePhone',
          ],
          included: ['mobilePhone', 'homePhone', 'mailingAddress', 'email'],
          depends: formData => formData.contactInfoSettings === 'all',
        }),
      },
    },

    // ** Complex Form
    applicantInformationChapter: {
      title: 'Chapter Title: Applicant Information (Basic Form elements)',
      pages: {
        applicantInformation: {
          path: 'applicant-information',
          title: 'Section Title: Applicant Information',
          uiSchema: applicantInformation.uiSchema,
          schema: applicantInformation.schema,
          initialData, // Add prefill data to form
        },
      },
    },
    serviceHistoryChapter: {
      title: 'Chapter Title: Service History (Simple array loop)',
      pages: {
        serviceHistory: {
          path: 'service-history',
          title: 'Section Title: Service History',
          uiSchema: serviceHistory.uiSchema,
          schema: serviceHistory.schema,
        },
      },
    },
    additionalInformationChapter: {
      title: 'Chapter Title: Additional Information (manual method)',
      pages: {
        contactInformation1: {
          path: 'contact-information-with-email-and-phone',
          title: 'Section Title: Contact Information',
          uiSchema: contactInformation1.uiSchema,
          schema: contactInformation1.schema,
        },
        contactInformation2: {
          path: 'contact-information-with-military-base',
          title: 'Section Title: Contact Information with Military base',
          uiSchema: contactInformation2.uiSchema,
          schema: contactInformation2.schema,
          updateFormData: contactInformation2.updateFormData,
        },
        directDeposit: {
          path: 'direct-deposit',
          title: 'Section Title: Direct Deposit',
          uiSchema: directDeposit.uiSchema,
          schema: directDeposit.schema,
        },
      },
    },
    // // ** Intermediate tutorial examples
    intermediateTutorialChapter: {
      title: 'Chapter Title: Intermediate tutorial examples',
      pages: {
        expandUnder: {
          path: 'expand-under',
          title: 'Section Title: Expand under', // ignored?
          uiSchema: expandUnder.uiSchema,
          schema: expandUnder.schema,
        },
        conditionalFields: {
          path: 'conditionally-hidden',
          title: 'Section Title: Conditionally hidden',
          uiSchema: conditionalFields.uiSchema,
          schema: conditionalFields.schema,
        },
        conditionalPages: {
          title: 'Section Title: Conditional page',
          path: 'conditional-page',
          uiSchema: conditionalPages.uiSchema,
          schema: conditionalPages.schema,
        },
      },
    },
    // https://department-of-veterans-affairs.github.io/veteran-facing-services-tools/forms/available-features-and-usage-guidelines/
    availableFeaturesAndUsage: {
      title: 'Chapter Title: Available features and usage guidelines examples',
      pages: {
        radioButtonGroup,
        checkboxGroupPattern,
      },
    },

    workaroundsChapter: {
      title: 'Chapter Title: Workarounds for form widget problems',
      pages: {
        singleCheckbox,
        groupCheckbox,
      },
    },
  },
};

export default formConfig;
