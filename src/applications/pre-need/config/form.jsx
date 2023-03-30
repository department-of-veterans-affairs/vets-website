import React from 'react';
import { merge, pick } from 'lodash';
import get from 'platform/utilities/data/get';
import omit from 'platform/utilities/data/omit';
import set from 'platform/utilities/data/set';

import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import environment from 'platform/utilities/environment';
import preSubmitInfo from 'platform/forms/preSubmitInfo';
import { VA_FORM_IDS } from 'platform/forms/constants';

import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import fullNameUI from 'platform/forms/definitions/fullName';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';

import applicantDescription from 'platform/forms/components/ApplicantDescription';

import * as autosuggest from 'platform/forms-system/src/js/definitions/autosuggest';
import * as address from '../definitions/address';
import Footer from '../components/Footer';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetFormHelp from '../components/GetFormHelp';
import ErrorText from '../components/ErrorText';
import EligibleBuriedView from '../components/EligibleBuriedView';
import SupportingDocumentsDescription from '../components/SupportingDocumentsDescription';
import { validateSponsorDeathDate } from '../validation';

import manifest from '../manifest.json';

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
  militaryServiceNumber,
  race,
} = fullSchemaPreNeed.definitions;

const nonRequiredFullName = omit('required', fullName);

function currentlyBuriedPersonsMinItem() {
  const copy = { ...currentlyBuriedPersons };
  copy.minItems = 1;
  return set('items.properties.cemeteryNumber', autosuggest.schema, copy);
}

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/preneeds/burial_forms`,
  trackingPrefix: 'preneed-',
  transformForSubmit: transform,
  formId: VA_FORM_IDS.FORM_40_10007,
  saveInProgress: {
    messages: {
      inProgress:
        'Your pre-need determination of eligibility in a VA national cemetery application is in progress.',
      // TODO: Fix the expired message
      expired:
        'Your saved pre-need determination of eligibility in a VA national cemetery application has expired. If you want to apply for pre-need determination of eligibility in a VA national cemetery, please start a new application.',
      saved:
        'Your pre-need determination of eligibility in a VA national cemetery application has been saved.',
    },
  },
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
    race,
    email,
    phone,
    files,
    centralMailVaFile,
    militaryServiceNumber,
  },
  chapters: {
    applicantInformation: {
      title: environment.isProduction()
        ? 'Applicant Information'
        : 'Applicant information',
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
                    widgetProps: {
                      1: { 'aria-describedby': 'veteran-relationship' },
                      2: { 'aria-describedby': 'spouse-relationship' },
                      3: { 'aria-describedby': 'child-relationship' },
                      4: { 'aria-describedby': 'other-relationship' },
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
                    properties: pick(claimant.properties, [
                      'name',
                      'ssn',
                      'dateOfBirth',
                      'relationshipToVet',
                    ]),
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
                    properties: set(
                      'militaryStatus.enum',
                      veteran.properties.militaryStatus.enum.filter(
                        // Doesn't make sense to have options for the
                        // Veteran to say they're deceased
                        opt => !['I', 'D'].includes(opt),
                      ),
                      pick(veteran.properties, [
                        'militaryServiceNumber',
                        'vaClaimNumber',
                        'placeOfBirth',
                        'gender',
                        'race',
                        'maritalStatus',
                        'militaryStatus',
                      ]),
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
      title: environment.isProduction()
        ? 'Sponsor Information'
        : 'Sponsor information',
      pages: {
        sponsorInformation: {
          path: 'sponsor-information',
          depends: formData => !isVeteran(formData),
          uiSchema: {
            'ui:description': applicantDescription,
            application: {
              veteran: merge({}, veteranUI, {
                currentName: merge({}, fullNameUI, {
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
                  'ui:order': ['first', 'middle', 'last', 'suffix', 'maiden'],
                }),
                militaryServiceNumber: {
                  'ui:title':
                    'Sponsor’s Military Service number (if they have one that’s different than their Social Security number)',
                  'ui:errorMessages': {
                    pattern:
                      'Sponsor’s Military Service number must be between 4 to 10 characters',
                  },
                },
                vaClaimNumber: {
                  'ui:title': 'Sponsor’s VA claim number (if known)',
                  'ui:errorMessages': {
                    pattern: 'Sponsor’s VA claim number must be 8 or 9 digits',
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
                race: {
                  'ui:title':
                    'Which categories best describe your sponsor? (You may check more than one)',
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
                dateOfDeath: merge(
                  {},
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
                    properties: pick(veteran.properties, [
                      'currentName',
                      'ssn',
                      'dateOfBirth',
                      'militaryServiceNumber',
                      'vaClaimNumber',
                      'placeOfBirth',
                      'gender',
                      'race',
                      'maritalStatus',
                      'militaryStatus',
                      'isDeceased',
                      'dateOfDeath',
                    ]),
                  },
                },
              },
            },
          },
        },
      },
    },
    militaryHistory: {
      title: environment.isProduction()
        ? 'Military History'
        : 'Military history',
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
          uiSchema: merge({}, militaryNameUI, {
            application: {
              veteran: {
                serviceName: {
                  first: {
                    'ui:required': form =>
                      get('application.veteran.view:hasServiceName', form) ===
                      true,
                  },
                  last: {
                    'ui:required': form =>
                      get('application.veteran.view:hasServiceName', form) ===
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
                serviceRecords: merge({}, serviceRecordsUI, {
                  'ui:title': 'Sponsor’s service periods',
                  'ui:description':
                    'Please provide all your sponsor’s service periods. If you need to add another service period, please click the Add Another Service Period button.',
                  items: {
                    'ui:order': [
                      'serviceBranch',
                      'dateRange',
                      'dischargeType',
                      'highestRank',
                      'nationalGuardState',
                    ],
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
          uiSchema: merge({}, militaryNameUI, {
            application: {
              veteran: {
                'view:hasServiceName': {
                  'ui:title': 'Did your sponsor serve under another name?',
                },
                serviceName: merge({}, fullNameUI, {
                  first: {
                    'ui:title': 'Sponsor’s first name',
                    'ui:required': form =>
                      get('application.veteran.view:hasServiceName', form) ===
                      true,
                  },
                  last: {
                    'ui:title': 'Sponsor’s last name',
                    'ui:required': form =>
                      get('application.veteran.view:hasServiceName', form) ===
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
      title: environment.isProduction() ? 'Burial Benefits' : 'Burial benefits',
      pages: {
        burialBenefits: {
          path: 'burial-benefits',
          uiSchema: {
            application: {
              claimant: {
                desiredCemetery: autosuggest.uiSchema(
                  'Which VA national cemetery would you prefer to be buried in?',
                  getCemeteries,
                  {
                    'ui:options': {
                      inputProps: {
                        'aria-describedby': 'burial-cemetary-note',
                      },
                    },
                  },
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
                  name: merge({}, fullNameUI, {
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
      title: 'Supporting Documents',
      pages: {
        supportingDocuments: {
          path: 'supporting-documents',
          editModeOnReviewPage: true,
          uiSchema: {
            'ui:description': SupportingDocumentsDescription,
            application: {
              preneedAttachments: fileUploadUI('Select files to upload', {
                addAnotherLabel: environment.isProduction()
                  ? 'Add Another'
                  : 'Add another',
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
      title: environment.isProduction()
        ? 'Contact Information'
        : 'Contact information',
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
                      const nameData = get(
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
                  name: merge({}, nonRequiredFullNameUI, {
                    'ui:title': 'Preparer information',
                    first: { 'ui:required': isAuthorizedAgent },
                    last: { 'ui:required': isAuthorizedAgent },
                  }),
                  mailingAddress: merge(
                    {},
                    address.uiSchema('Mailing address'),
                    {
                      country: { 'ui:required': isAuthorizedAgent },
                      street: { 'ui:required': isAuthorizedAgent },
                      city: { 'ui:required': isAuthorizedAgent },
                      state: { 'ui:required': isAuthorizedAgent },
                      postalCode: { 'ui:required': isAuthorizedAgent },
                    },
                  ),
                  'view:contactInfo': {
                    'ui:title': 'Contact information',
                    applicantPhoneNumber: merge(
                      {},
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
