import React from 'react';
import _ from 'lodash/fp';

import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import Footer from '../components/Footer';
import environment from 'platform/utilities/environment';
import preSubmitInfo from 'platform/forms/preSubmitInfo';
import { VA_FORM_IDS } from 'platform/forms/constants';

import * as address from '../definitions/address';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import fullNameUI from 'platform/forms/definitions/fullName';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';

import applicantDescription from 'platform/forms/components/ApplicantDescription';

import * as autosuggest from 'platform/forms-system/src/js/definitions/autosuggest';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetFormHelp from '../components/GetFormHelp';
import ErrorText from '../components/ErrorText';
import EligibleBuriedView from '../components/EligibleBuriedView';
import SupportingDocumentsDescription from '../components/SupportingDocumentsDescription';
import { validateSponsorDeathDate } from '../validation';

import {
  isVeteran,
  isAuthorizedAgent,
  formatName,
  transform,
  fullMaidenNameUI,
  ssnDashesUI,
  veteranUI,
  serviceRecordsUI,
  militaryNameUI,
  getCemeteries,
  contactInfoDescription,
  authorizedAgentDescription,
  veteranRelationshipDescription,
  spouseRelationshipDescription,
  childRelationshipDescription,
  otherRelationshipDescription,
  sponsorMilitaryStatusDescription,
  desiredCemeteryNoteDescription,
  nonRequiredFullNameUI,
} from '../utils/helpers';

const {
  claimant,
  veteran,
  applicant,
  hasCurrentlyBuried,
  currentlyBuriedPersons,
  preneedAttachments,
} = fullSchemaPreNeed.properties.application.properties;

const {
  fullName,
  ssn,
  date,
  dateRange,
  gender,
  email,
  phone,
  files,
  centralMailVaFile,
} = fullSchemaPreNeed.definitions;

const nonRequiredFullName = _.omit('required', fullName);

function currentlyBuriedPersonsMinItem() {
  const copy = Object.assign({}, currentlyBuriedPersons);
  copy.minItems = 1;
  return _.set('items.properties.cemeteryNumber', autosuggest.schema, copy);
}

const formConfig = {
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/preneeds/burial_forms`,
  trackingPrefix: 'preneed-',
  transformForSubmit: transform,
  formId: VA_FORM_IDS.FORM_40_10007,
  prefillEnabled: true,
  verifyRequiredPrefill: false,
  version: 0,
  savedFormMessages: {
    notFound: 'Please start over to apply for pre-need eligibility.',
    noAuth:
      'Please sign in again to resume your application for pre-need eligibility.',
  },
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  title: 'Apply for pre-need eligibility determination',
  subTitle: 'Form 40-10007',
  preSubmitInfo,
  footerContent: ({ currentLocation }) => (
    <Footer formConfig={formConfig} currentLocation={currentLocation} />
  ),
  getHelp: GetFormHelp,
  errorText: ErrorText,
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    gender,
    email,
    phone,
    files,
    centralMailVaFile,
  },
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
        applicantInformation: {
          title: 'Applicant information',
          path: 'applicant-information',
          uiSchema: {
            'ui:description': applicantDescription,
            application: {
              claimant: {
                name: fullMaidenNameUI,
                ssn: ssnDashesUI,
                dateOfBirth: currentOrPastDateUI('Date of birth'),
                relationshipToVet: {
                  'ui:title': 'Relationship to service member',
                  'ui:widget': 'radio',
                  'ui:options': {
                    labels: {
                      1: 'I am the service member/Veteran',
                      2: 'Spouse or surviving spouse',
                      3: 'Unmarried adult child',
                      4: 'Other',
                    },
                    nestedContent: {
                      1: veteranRelationshipDescription,
                      2: spouseRelationshipDescription,
                      3: childRelationshipDescription,
                      4: otherRelationshipDescription,
                    },
                  },
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              application: {
                type: 'object',
                properties: {
                  claimant: {
                    type: 'object',
                    required: [
                      'name',
                      'ssn',
                      'dateOfBirth',
                      'relationshipToVet',
                    ],
                    properties: _.pick(
                      ['name', 'ssn', 'dateOfBirth', 'relationshipToVet'],
                      claimant.properties,
                    ),
                  },
                },
              },
            },
          },
        },
        veteranInformation: {
          path: 'veteran-applicant-information',
          title: 'Veteran Information',
          depends: isVeteran,
          uiSchema: {
            application: {
              veteran: veteranUI,
            },
          },
          schema: {
            type: 'object',
            properties: {
              application: {
                type: 'object',
                properties: {
                  veteran: {
                    type: 'object',
                    required: ['gender', 'maritalStatus', 'militaryStatus'],
                    properties: _.set(
                      'militaryStatus.enum',
                      veteran.properties.militaryStatus.enum.filter(
                        // Doesn't make sense to have options for the
                        // Veteran to say they're deceased
                        opt => !['I', 'D'].includes(opt),
                      ),
                      _.pick(
                        [
                          'militaryServiceNumber',
                          'vaClaimNumber',
                          'placeOfBirth',
                          'gender',
                          'maritalStatus',
                          'militaryStatus',
                        ],
                        veteran.properties,
                      ),
                    ),
                  },
                },
              },
            },
          },
        },
      },
    },
    sponsorInformation: {
      title: 'Sponsor Information',
      pages: {
        sponsorInformation: {
          path: 'sponsor-information',
          depends: formData => !isVeteran(formData),
          uiSchema: {
            'ui:description': applicantDescription,
            application: {
              veteran: _.merge(veteranUI, {
                currentName: _.merge(fullNameUI, {
                  first: {
                    'ui:title': 'Sponsor’s first name',
                  },
                  last: {
                    'ui:title': 'Sponsor’s last name',
                  },
                  middle: {
                    'ui:title': 'Sponsor’s middle name',
                  },
                  suffix: {
                    'ui:title': 'Sponsor’s suffix',
                  },
                  maiden: {
                    'ui:title': 'Sponsor’s maiden name',
                  },
                }),
                militaryServiceNumber: {
                  'ui:title':
                    'Sponsor’s Military Service number (if they have one that’s different than their Social Security number)',
                },
                vaClaimNumber: {
                  'ui:title': 'Sponsor’s VA claim number (if known)',
                  'ui:errorMessages': {
                    pattern: 'Your VA claim number must be 8 or 9 digits',
                  },
                },
                ssn: {
                  ...ssnDashesUI,
                  'ui:title': 'Sponsor’s Social Security number',
                },
                dateOfBirth: currentOrPastDateUI('Sponsor’s date of birth'),
                placeOfBirth: {
                  'ui:title':
                    "Sponsor's place of birth (City, State, or Territory)",
                },
                gender: {
                  'ui:title':
                    "Sponsor's sex (information will be used for statistical purposes only)",
                },
                maritalStatus: {
                  'ui:title': 'Sponsor’s marital status',
                },
                militaryStatus: {
                  'ui:title':
                    'Sponsor’s current military status (You can add more service history information later in this application)',
                  'ui:options': {
                    nestedContent: {
                      X: sponsorMilitaryStatusDescription,
                    },
                  },
                },
                isDeceased: {
                  'ui:title': 'Has the sponsor died?',
                  'ui:widget': 'radio',
                  'ui:options': {
                    labels: {
                      yes: 'Yes',
                      no: 'No',
                      unsure: 'I don’t know',
                    },
                  },
                },
                dateOfDeath: _.merge(
                  currentOrPastDateUI('Sponsor’s date of death'),
                  {
                    'ui:options': {
                      expandUnder: 'isDeceased',
                      expandUnderCondition: 'yes',
                    },
                  },
                ),
                'ui:validations': [validateSponsorDeathDate],
              }),
            },
          },
          schema: {
            type: 'object',
            properties: {
              application: {
                type: 'object',
                properties: {
                  veteran: {
                    type: 'object',
                    required: [
                      'ssn',
                      'gender',
                      'maritalStatus',
                      'militaryStatus',
                      'isDeceased',
                    ],
                    properties: _.pick(
                      [
                        'currentName',
                        'ssn',
                        'dateOfBirth',
                        'militaryServiceNumber',
                        'vaClaimNumber',
                        'placeOfBirth',
                        'gender',
                        'maritalStatus',
                        'militaryStatus',
                        'isDeceased',
                        'dateOfDeath',
                      ],
                      veteran.properties,
                    ),
                  },
                },
              },
            },
          },
        },
      },
    },
    militaryHistory: {
      title: 'Military History',
      pages: {
        // Two sets of military history pages dependent on
        // whether the applicant is the veteran or not.
        // If not, "Sponsor’s" precedes all the field labels.
        applicantMilitaryHistory: {
          path: 'applicant-military-history',
          depends: isVeteran,
          uiSchema: {
            application: {
              veteran: {
                serviceRecords: serviceRecordsUI,
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              application: {
                type: 'object',
                properties: {
                  veteran: {
                    type: 'object',
                    properties: {
                      serviceRecords: veteran.properties.serviceRecords,
                    },
                  },
                },
              },
            },
          },
        },
        applicantMilitaryName: {
          path: 'applicant-military-name',
          depends: isVeteran,
          uiSchema: _.merge(militaryNameUI, {
            application: {
              veteran: {
                serviceName: {
                  first: {
                    'ui:required': form =>
                      _.get('application.veteran.view:hasServiceName', form) ===
                      true,
                  },
                  last: {
                    'ui:required': form =>
                      _.get('application.veteran.view:hasServiceName', form) ===
                      true,
                  },
                },
              },
            },
          }),
          schema: {
            type: 'object',
            properties: {
              application: {
                type: 'object',
                properties: {
                  veteran: {
                    type: 'object',
                    required: ['view:hasServiceName'],
                    properties: {
                      'view:hasServiceName': {
                        type: 'boolean',
                      },
                      serviceName: nonRequiredFullName,
                    },
                  },
                },
              },
            },
          },
        },
        sponsorMilitaryHistory: {
          path: 'sponsor-military-history',
          depends: formData => !isVeteran(formData),
          uiSchema: {
            application: {
              veteran: {
                serviceRecords: _.merge(serviceRecordsUI, {
                  'ui:title': 'Sponsor’s service periods',
                  'ui:description':
                    'Please provide all your sponsor’s service periods. If you need to add another service period, please click the Add Another Service Period button.',
                  items: {
                    serviceBranch: {
                      'ui:title': 'Sponsor’s branch of service',
                    },
                    dateRange: dateRangeUI(
                      'Sponsor’s service start date',
                      'Sponsor’s service end date',
                      'Service start date must be before end date',
                    ),
                    dischargeType: {
                      'ui:title': 'Sponsor’s discharge character of service',
                    },
                    highestRank: {
                      'ui:title': 'Sponsor’s highest rank attained',
                    },
                    nationalGuardState: {
                      'ui:title':
                        'Sponsor’s state (for National Guard Service only)',
                    },
                  },
                }),
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              application: {
                type: 'object',
                properties: {
                  veteran: {
                    type: 'object',
                    properties: {
                      serviceRecords: veteran.properties.serviceRecords,
                    },
                  },
                },
              },
            },
          },
        },
        sponsorMilitaryName: {
          path: 'sponsor-military-name',
          depends: formData => !isVeteran(formData),
          uiSchema: _.merge(militaryNameUI, {
            application: {
              veteran: {
                'view:hasServiceName': {
                  'ui:title': 'Did your sponsor serve under another name?',
                },
                serviceName: _.merge(fullNameUI, {
                  first: {
                    'ui:title': 'Sponsor’s first name',
                    'ui:required': form =>
                      _.get('application.veteran.view:hasServiceName', form) ===
                      true,
                  },
                  last: {
                    'ui:title': 'Sponsor’s last name',
                    'ui:required': form =>
                      _.get('application.veteran.view:hasServiceName', form) ===
                      true,
                  },
                  middle: {
                    'ui:title': 'Sponsor’s middle name',
                  },
                  suffix: {
                    'ui:title': 'Sponsor’s suffix',
                  },
                }),
              },
            },
          }),
          schema: {
            type: 'object',
            properties: {
              application: {
                type: 'object',
                properties: {
                  veteran: {
                    type: 'object',
                    required: ['view:hasServiceName'],
                    properties: {
                      'view:hasServiceName': {
                        type: 'boolean',
                      },
                      serviceName: nonRequiredFullName,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    burialBenefits: {
      title: 'Burial Benefits',
      pages: {
        burialBenefits: {
          path: 'burial-benefits',
          uiSchema: {
            application: {
              claimant: {
                desiredCemetery: autosuggest.uiSchema(
                  'Which VA national cemetery would you prefer to be buried in?',
                  getCemeteries,
                ),
                'view:desiredCemeteryNote': {
                  'ui:description': desiredCemeteryNoteDescription,
                },
              },
              hasCurrentlyBuried: {
                'ui:widget': 'radio',
                'ui:options': {
                  updateSchema: formData => {
                    let title;
                    if (isVeteran(formData)) {
                      /* eslint-disable no-param-reassign */
                      title =
                        'Is there anyone currently buried in a VA national cemetery under your eligibility?';
                    } else {
                      title =
                        'Is there anyone currently buried in a VA national cemetery under your sponsor’s eligibility?';
                      /* eslint-enable no-param-reassign */
                    }
                    return { title };
                  },
                  labels: {
                    1: 'Yes',
                    2: 'No',
                    3: 'I don’t know',
                  },
                },
              },
              currentlyBuriedPersons: {
                'ui:options': {
                  viewField: EligibleBuriedView,
                  expandUnder: 'hasCurrentlyBuried',
                  expandUnderCondition: '1',
                },
                items: {
                  name: _.merge(fullNameUI, {
                    'ui:title': 'Name of deceased',
                  }),
                  cemeteryNumber: autosuggest.uiSchema(
                    'VA national cemetery where they’re buried',
                    getCemeteries,
                  ),
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              application: {
                type: 'object',
                required: ['hasCurrentlyBuried'],
                properties: {
                  claimant: {
                    type: 'object',
                    properties: {
                      desiredCemetery: autosuggest.schema,
                      'view:desiredCemeteryNote': {
                        type: 'object',
                        properties: {},
                      },
                    },
                  },
                  hasCurrentlyBuried,
                  currentlyBuriedPersons: currentlyBuriedPersonsMinItem(),
                },
              },
            },
          },
        },
      },
    },
    supportingDocuments: {
      title: 'Supporting documents',
      pages: {
        supportingDocuments: {
          path: 'supporting-documents',
          editModeOnReviewPage: true,
          uiSchema: {
            'ui:description': SupportingDocumentsDescription,
            application: {
              preneedAttachments: fileUploadUI('Select files to upload', {
                fileUploadUrl: `${
                  environment.API_URL
                }/v0/preneeds/preneed_attachments`,
                fileTypes: ['pdf'],
                maxSize: 15728640,
                hideLabelText: true,
                createPayload: file => {
                  const payload = new FormData();
                  payload.append('preneed_attachment[file_data]', file);

                  return payload;
                },
                parseResponse: (response, file) => ({
                  name: file.name,
                  confirmationCode: response.data.attributes.guid,
                }),
                attachmentSchema: {
                  'ui:title': 'What kind of document is this?',
                },
                attachmentName: {
                  'ui:title': 'Document name',
                },
              }),
            },
          },
          schema: {
            type: 'object',
            properties: {
              application: {
                type: 'object',
                properties: {
                  preneedAttachments,
                },
              },
            },
          },
        },
      },
    },
    contactInformation: {
      title: 'Contact Information',
      pages: {
        applicantContactInformation: {
          title: 'Applicant’s contact information',
          path: 'applicant-contact-information',
          uiSchema: {
            application: {
              claimant: {
                address: address.uiSchema('Applicant’s mailing address'),
                'view:contactInfoDescription': {
                  'ui:description': contactInfoDescription,
                },
                phoneNumber: phoneUI('Primary telephone number'),
                email: emailUI(),
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              application: {
                type: 'object',
                properties: {
                  claimant: {
                    type: 'object',
                    required: ['email', 'phoneNumber'],
                    properties: {
                      address: address.schema(fullSchemaPreNeed, true),
                      'view:contactInfoDescription': {
                        type: 'object',
                        properties: {},
                      },
                      phoneNumber: claimant.properties.phoneNumber,
                      email: claimant.properties.email,
                    },
                  },
                },
              },
            },
          },
        },
        sponsorMailingAddress: {
          title: 'Sponsor’s mailing address',
          path: 'sponsor-mailing-address',
          depends: formData => !isVeteran(formData),
          uiSchema: {
            application: {
              veteran: {
                address: address.uiSchema('Sponsor’s address'),
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              application: {
                type: 'object',
                properties: {
                  veteran: {
                    type: 'object',
                    properties: {
                      address: address.schema(fullSchemaPreNeed),
                    },
                  },
                },
              },
            },
          },
        },
        preparer: {
          title: 'Preparer',
          path: 'preparer',
          uiSchema: {
            application: {
              applicant: {
                applicantRelationshipToClaimant: {
                  'ui:title': 'Who is filling out this application?',
                  'ui:widget': 'radio',
                  'ui:options': {
                    updateSchema: formData => {
                      const nameData = _.get(
                        'application.claimant.name',
                        formData,
                      );
                      const applicantName = nameData
                        ? formatName(nameData)
                        : null;

                      return {
                        enumNames: [applicantName || 'Myself', 'Someone else'],
                      };
                    },
                    nestedContent: {
                      'Authorized Agent/Rep': authorizedAgentDescription,
                    },
                  },
                },
                'view:applicantInfo': {
                  'ui:options': {
                    expandUnder: 'applicantRelationshipToClaimant',
                    expandUnderCondition: 'Authorized Agent/Rep',
                  },
                  name: _.merge(nonRequiredFullNameUI, {
                    'ui:title': 'Preparer information',
                    first: { 'ui:required': isAuthorizedAgent },
                    last: { 'ui:required': isAuthorizedAgent },
                  }),
                  mailingAddress: _.merge(address.uiSchema('Mailing address'), {
                    country: { 'ui:required': isAuthorizedAgent },
                    street: { 'ui:required': isAuthorizedAgent },
                    city: { 'ui:required': isAuthorizedAgent },
                    state: { 'ui:required': isAuthorizedAgent },
                    postalCode: { 'ui:required': isAuthorizedAgent },
                  }),
                  'view:contactInfo': {
                    'ui:title': 'Contact information',
                    applicantPhoneNumber: _.merge(
                      phoneUI('Primary telephone number'),
                      {
                        'ui:required': isAuthorizedAgent,
                      },
                    ),
                  },
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              application: {
                type: 'object',
                properties: {
                  applicant: {
                    type: 'object',
                    required: ['applicantRelationshipToClaimant'],
                    properties: {
                      applicantRelationshipToClaimant:
                        applicant.properties.applicantRelationshipToClaimant,
                      'view:applicantInfo': {
                        type: 'object',
                        properties: {
                          name: nonRequiredFullName,
                          mailingAddress: address.schema(fullSchemaPreNeed),
                          'view:contactInfo': {
                            type: 'object',
                            properties: {
                              applicantPhoneNumber:
                                applicant.properties.applicantPhoneNumber,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
