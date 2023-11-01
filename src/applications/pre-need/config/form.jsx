import React from 'react';
import { merge, pick } from 'lodash';
import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';

import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import environment from 'platform/utilities/environment';
import preSubmitInfo from 'platform/forms/preSubmitInfo';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { useSelector } from 'react-redux';

import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import fullNameUI from 'platform/forms/definitions/fullName';
import applicantDescription from 'platform/forms/components/ApplicantDescription';
import emailUI from '../definitions/email';
import * as applicantMilitaryHistory from './pages/applicantMilitaryHistory';
import * as applicantMilitaryName from './pages/applicantMilitaryName';
import * as applicantMilitaryNameInformation from './pages/applicantMilitaryNameInformation';
import * as sponsorMilitaryHistory from './pages/sponsorMilitaryHistory';
import * as sponsorMilitaryName from './pages/sponsorMilitaryName';
import * as sponsorMilitaryNameInformation from './pages/sponsorMilitaryNameInformation';
import * as burialBenefits from './pages/burialBenefits';
import * as applicantRelationshipToVet from './pages/applicantRelationshipToVet';
import * as veteranApplicantDetails from './pages/veteranApplicantDetails';
import * as nonVeteranApplicantDetails from './pages/nonVeteranApplicantDetails';
import * as applicantDemographics from './pages/applicantDemographics';
import * as militaryDetails from './pages/militaryDetails';
import * as currentlyBuriedPersons from './pages/currentlyBuriedPersons';

import * as address from '../definitions/address';
import Footer from '../components/Footer';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetFormHelp from '../components/GetFormHelp';
import ErrorText from '../components/ErrorText';
import SubmissionError from '../components/SubmissionError';
import phoneUI from '../components/Phone';
import preparerPhoneUI from '../components/PreparerPhone';
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
  applicantContactInfoDescriptionNonVet,
  applicantContactInfoDescriptionVet,
  veteranRelationshipDescription,
  spouseRelationshipDescription,
  childRelationshipDescription,
  otherRelationshipDescription,
  sponsorMilitaryStatusDescription,
  isVeteranAndHasServiceName,
  isNotVeteranAndHasServiceName,
  buriedWSponsorsEligibility,
  preparerAddressHasState,
  applicantsMailingAddressHasState,
  sponsorMailingAddressHasState,
} from '../utils/helpers';
import SupportingFilesDescription from '../components/SupportingFilesDescription';
import {
  ContactDetailsTitle,
  PreparerDescription,
  PreparerDetailsTitle,
} from '../components/PreparerHelpers';
import PreparerRadioWidget from '../components/PreparerRadioWidget';

const {
  claimant,
  veteran,
  applicant,
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
  race,
} = fullSchemaPreNeed.definitions;

function MailingAddressStateTitle(props) {
  const { elementPath } = props;
  const data = useSelector(state => state.form.data || {});
  const country = get(elementPath, data);
  if (country === 'CAN') {
    return 'Province';
  }
  return 'State or territory';
}

export const applicantMailingAddressStateTitleWrapper = (
  <MailingAddressStateTitle elementPath="application.claimant.address.country" />
);
export const preparerMailingAddressStateTitleWrapper = (
  <MailingAddressStateTitle elementPath="application.applicant.view:applicantInfo.mailingAddress.country" />
);
export const sponsorMailingAddressStateTitleWrapper = (
  <MailingAddressStateTitle elementPath="application.veteran.address.country" />
);

export const applicantContactInfoWrapper = <ApplicantContactInfoDescription />;

const applicantContactInfoSubheader = (
  <h3 className="vads-u-font-size--h5">Applicant’s contact details</h3>
);

function ApplicantContactInfoDescription() {
  const data = useSelector(state => state.form.data || {});
  return isVeteran(data)
    ? applicantContactInfoDescriptionVet
    : applicantContactInfoDescriptionNonVet;
}

/** @type {FormConfig} */
const formConfig = {
  dev: {
    showNavLinks: true,
  },
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
  submissionError: SubmissionError,
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
  },
  chapters: {
    applicantInformation: {
      title: 'Applicant information',
      pages: !environment.isProduction()
        ? {
            applicantRelationshipToVet: {
              path: 'applicant-relationship-to-vet',
              uiSchema: applicantRelationshipToVet.uiSchema,
              schema: applicantRelationshipToVet.schema,
            },
            veteranApplicantDetails: {
              title: 'Applicant details',
              path: 'veteran-applicant-details',
              depends: isVeteran,
              uiSchema: veteranApplicantDetails.uiSchema,
              schema: veteranApplicantDetails.schema,
            },
            nonVeteranApplicantDetails: {
              title: 'Applicant details',
              path: 'nonVeteran-applicant-details',
              depends: formData => !isVeteran(formData),
              uiSchema: nonVeteranApplicantDetails.uiSchema,
              schema: nonVeteranApplicantDetails.schema,
            },
            applicantDemographics: {
              title: 'Applicant demographics',
              path: 'applicant-demographics',
              depends: isVeteran,
              uiSchema: applicantDemographics.uiSchema,
              schema: applicantDemographics.schema,
            },
            militaryDetails: {
              path: 'applicant-military-details',
              title: 'Military details',
              depends: isVeteran,
              uiSchema: militaryDetails.uiSchema,
              schema: militaryDetails.schema,
            },
          }
        : {
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
              title: 'Veteran information',
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
                        required: [
                          'race',
                          'gender',
                          'maritalStatus',
                          'militaryStatus',
                        ],
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
      title: 'Sponsor information',
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
                      'Sponsor’s Military Service number must be between 4 to 9 characters',
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
                      'race',
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
      title: 'Military history',
      pages: {
        // Two sets of military history pages dependent on
        // whether the applicant is the veteran or not.
        // If not, "Sponsor’s" precedes all the field labels.
        applicantMilitaryHistory: {
          title: 'Service period(s)',
          path: 'applicant-military-history',
          depends: isVeteran,
          uiSchema: applicantMilitaryHistory.uiSchema,
          schema: applicantMilitaryHistory.schema,
        },
        applicantMilitaryName: {
          path: 'applicant-military-name',
          depends: isVeteran,
          uiSchema: applicantMilitaryName.uiSchema,
          schema: applicantMilitaryName.schema,
        },
        applicantMilitaryNameInformation: {
          title: 'Previous name',
          path: 'applicant-military-name-information',
          depends: formData => isVeteranAndHasServiceName(formData),
          uiSchema: applicantMilitaryNameInformation.uiSchema,
          schema: applicantMilitaryNameInformation.schema,
        },
        sponsorMilitaryHistory: {
          path: 'sponsor-military-history',
          title: 'Sponsor’s service period(s)',
          depends: formData => !isVeteran(formData),
          uiSchema: sponsorMilitaryHistory.uiSchema,
          schema: sponsorMilitaryHistory.schema,
        },
        sponsorMilitaryName: {
          path: 'sponsor-military-name',
          depends: formData => !isVeteran(formData),
          uiSchema: sponsorMilitaryName.uiSchema,
          schema: sponsorMilitaryName.schema,
        },
        sponsorMilitaryNameInformation: {
          title: 'Sponsor’s previous name',
          path: 'sponsor-military-name-information',
          depends: formData => isNotVeteranAndHasServiceName(formData),
          uiSchema: sponsorMilitaryNameInformation.uiSchema,
          schema: sponsorMilitaryNameInformation.schema,
        },
      },
    },
    burialBenefits: {
      title: 'Burial benefits',
      pages: {
        burialBenefits: {
          path: 'burial-benefits',
          uiSchema: burialBenefits.uiSchema,
          schema: burialBenefits.schema,
        },
        currentlyBuriedPersons: {
          title: 'Name of deceased person(s)',
          path: 'current-burial-benefits',
          depends: formData => buriedWSponsorsEligibility(formData),
          uiSchema: currentlyBuriedPersons.uiSchema,
          schema: currentlyBuriedPersons.schema,
        },
      },
    },
    supportingDocuments: {
      title: 'Supporting files',
      pages: {
        supportingDocuments: {
          path: 'supporting-documents',
          editModeOnReviewPage: false,
          uiSchema: {
            'ui:description': SupportingFilesDescription,
            application: {
              preneedAttachments: fileUploadUI('Select files to upload', {
                buttonText: 'Upload file',
                addAnotherLabel: 'Upload another file',
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
                  'ui:title': 'What kind of file is this?',
                },
                attachmentName: {
                  'ui:title': 'File name',
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
      title: 'Contact information',
      pages: {
        applicantContactInformation: {
          title: 'Applicant’s contact information',
          path: 'applicant-contact-information',
          uiSchema: {
            application: {
              claimant: {
                address: merge(
                  {},
                  address.uiSchema('Applicant’s mailing address'),
                  {
                    street: {
                      'ui:title': 'Street address',
                    },
                    street2: {
                      'ui:title': 'Street address line 2',
                    },
                    state: {
                      'ui:title': applicantMailingAddressStateTitleWrapper,
                      'ui:options': {
                        hideIf: formData =>
                          !applicantsMailingAddressHasState(formData),
                      },
                    },
                  },
                ),
                'view:applicantContactInfoSubheader': {
                  'ui:description': applicantContactInfoSubheader,
                  'ui:options': {
                    displayEmptyObjectOnReview: true,
                  },
                },
                phoneNumber: phoneUI('Phone number'),
                email: emailUI(),
                'view:contactInfoDescription': {
                  'ui:description': applicantContactInfoWrapper,
                  'ui:options': {
                    displayEmptyObjectOnReview: true,
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
                    required: ['email', 'phoneNumber'],
                    properties: {
                      address: address.schema(fullSchemaPreNeed, true),
                      'view:applicantContactInfoSubheader': {
                        type: 'object',
                        properties: {},
                      },
                      phoneNumber: claimant.properties.phoneNumber,
                      email: claimant.properties.email,
                      'view:contactInfoDescription': {
                        type: 'object',
                        properties: {},
                      },
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
                address: !environment.isProduction()
                  ? merge({}, address.uiSchema('Sponsor’s mailing address'), {
                      street: {
                        'ui:title': 'Street address',
                      },
                      street2: {
                        'ui:title': 'Street address line 2',
                      },
                      state: {
                        'ui:title': sponsorMailingAddressStateTitleWrapper,
                        'ui:options': {
                          hideIf: formData =>
                            !sponsorMailingAddressHasState(formData),
                        },
                      },
                    })
                  : merge({}, address.uiSchema('Sponsor’s address'), {
                      state: {
                        'ui:title': sponsorMailingAddressStateTitleWrapper,
                        'ui:options': {
                          hideIf: formData =>
                            !sponsorMailingAddressHasState(formData),
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
                      address: address.schema(fullSchemaPreNeed),
                    },
                  },
                },
              },
            },
          },
        },
        preparer: {
          path: 'preparer',
          uiSchema: {
            application: {
              applicant: {
                applicantRelationshipToClaimant: {
                  'ui:title': 'Who is filling out this application?',
                  'ui:widget': PreparerRadioWidget,
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
                        enumNames: [
                          applicantName || 'Myself',
                          'Someone else, such as a preparer',
                        ],
                      };
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
                  applicant: {
                    type: 'object',
                    required: ['applicantRelationshipToClaimant'],
                    properties: {
                      applicantRelationshipToClaimant:
                        applicant.properties.applicantRelationshipToClaimant,
                    },
                  },
                },
              },
            },
          },
        },
        preparerDetails: {
          title: 'Preparer details',
          path: 'preparer-details',
          depends: formData => isAuthorizedAgent(formData),
          uiSchema: {
            'ui:title': PreparerDetailsTitle,
            'ui:description': PreparerDescription,
            application: {
              applicant: {
                name: {
                  first: {
                    'ui:title': "Preparer's first name",
                    'ui:required': isAuthorizedAgent,
                  },
                  middle: {
                    'ui:options': {
                      hideIf: () => true,
                    },
                  },
                  last: {
                    'ui:title': "Preparer's last name",
                    'ui:required': isAuthorizedAgent,
                  },
                  suffix: {
                    'ui:options': {
                      hideIf: () => true,
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
                  applicant: {
                    type: 'object',
                    properties: {
                      name: applicant.properties.name,
                    },
                  },
                },
              },
            },
          },
        },
        preparerContactDetails: {
          title: 'Preparer contact details',
          path: 'preparer-contact-details',
          depends: formData => isAuthorizedAgent(formData),
          uiSchema: {
            application: {
              applicant: {
                'view:applicantInfo': {
                  mailingAddress: merge(
                    {},
                    address.uiSchema("Preparer's mailing address"),
                    {
                      country: { 'ui:required': isAuthorizedAgent },
                      street: {
                        'ui:title': 'Street address',
                        'ui:required': isAuthorizedAgent,
                      },
                      street2: {
                        'ui:title': 'Street address line 2',
                      },
                      city: { 'ui:required': isAuthorizedAgent },
                      state: {
                        'ui:title': preparerMailingAddressStateTitleWrapper,
                        'ui:required': isAuthorizedAgent,
                        'ui:options': {
                          hideIf: formData =>
                            !preparerAddressHasState(formData),
                        },
                      },
                      postalCode: { 'ui:required': isAuthorizedAgent },
                    },
                  ),
                },
                'view:contactInfo': {
                  'ui:title': ContactDetailsTitle,
                  applicantPhoneNumber: merge(
                    {},
                    preparerPhoneUI('Phone number'),
                    {
                      'ui:required': isAuthorizedAgent,
                    },
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
                properties: {
                  applicant: {
                    type: 'object',
                    properties: {
                      'view:applicantInfo': {
                        type: 'object',
                        properties: {
                          mailingAddress: address.schema(fullSchemaPreNeed),
                        },
                      },
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
};

export default formConfig;
