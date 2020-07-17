import ConfirmationPage from 'applications/caregivers/containers/ConfirmationPage';
import environment from 'platform/utilities/environment';
import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import IntroductionPage from 'applications/caregivers/containers/IntroductionPage';
import NeedHelpFooter from 'applications/caregivers/components/NeedHelpFooter';
import PreSubmitInfo from 'applications/caregivers/components/PreSubmitInfo';
import {
  medicalCentersByState,
  submitTransform,
} from 'applications/caregivers/helpers';
import { states } from 'platform/forms/address';
import {
  PrimaryCaregiverInfo,
  PrimaryHealthCoverage,
  SecondaryCaregiverInfo,
  VetInfo,
} from 'applications/caregivers/components/AdditionalInfo';
import {
  primaryCaregiverFields,
  secondaryCaregiverFields,
  vetFields,
} from 'applications/caregivers/definitions/constants';
import definitions, {
  addressWithoutCountryUI,
  confirmationEmailUI,
} from 'applications/caregivers/definitions/caregiverUI';

const plannedClinic = fullSchema.properties.veteran.properties.plannedClinic;
import {
  vetInfoPage,
  vetContactInfoPage,
  vetMedicalCenterPage,
  primaryInfoPage,
  primaryContactInfoPage,
  primaryMedicalPage,
} from './pages';

const {
  veteran,
  primaryCaregiver,
  secondaryCaregiverOne,
  secondaryCaregiverTwo,
} = fullSchema.properties;
const veteranProps = veteran.properties;
const primaryCaregiverProps = primaryCaregiver.properties;
const secondaryCaregiverOneProps = secondaryCaregiverOne.properties;
const secondaryCaregiverTwoProps = secondaryCaregiverTwo.properties;

const {
  address,
  date,
  email,
  phone,
  gender,
  vetRelationship,
  ssn,
  fullName,
} = fullSchema.definitions;

const {
  alternativePhoneNumberUI,
  dateOfBirthUI,
  emailUI,
  fullNameUI,
  genderUI,
  hasSecondaryCaregiverOneUI,
  hasSecondaryCaregiverTwoUI,
  primaryPhoneNumberUI,
  ssnUI,
  vetRelationshipUI,
  contactInfoTitle,
} = definitions.sharedItems;

const { vetUI, primaryCaregiverUI, secondaryCaregiversUI } = definitions;

const hasSecondaryCaregiverOne = formData =>
  formData[primaryCaregiverFields.hasSecondaryCaregiverOneView] === true;

const hasSecondaryCaregiverTwo = formData =>
  formData[
    secondaryCaregiverFields.secondaryOne.hasSecondaryCaregiverTwoView
  ] === true;

/* Chapters
 * 1 - Vet/Service Member (required)
 * 2 - Primary Family Caregiver (required)
 * 3 - Secondary & secondaryTwo Family Caregiver (optional -- up to 2 conditionally)
 */
const formConfig = {
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/caregivers_assistance_claims`,
  transformForSubmit: submitTransform,
  trackingPrefix: 'caregivers-10-10cg-',
  introduction: IntroductionPage,
  footerContent: NeedHelpFooter,
  preSubmitInfo: PreSubmitInfo,
  confirmation: ConfirmationPage,
  formId: '10-10CG',
  version: 0,
  prefillEnabled: false,
  title:
    'Apply for the Program of Comprehensive Assistance for Family Caregivers',
  subTitle: 'Form 10-10CG',
  defaultDefinitions: {
    address,
    addressWithoutCountryUI,
    date,
    email,
    fullName,
    gender,
    phone,
    ssn,
    vetRelationship,
  },
  chapters: {
    veteranChapter: {
      title: 'Veteran or service member information',
      pages: {
        veteranInfoOne: {
          path: 'vet-1',
          title: 'Veteran information',
          uiSchema: vetInfoPage.uiSchema,
          schema: vetInfoPage.schema,
        },
        veteranInfoTwo: {
          path: 'vet-2',
          title: contactInfoTitle,
          uiSchema: vetContactInfoPage.uiSchema,
          schema: vetContactInfoPage.schema,
        },
        veteranInfoThree: {
          path: 'vet-3',
          title: 'VA medical center',
          uiSchema: vetMedicalCenterPage.uiSchema,
          schema: vetMedicalCenterPage.schema,
        },
      },
    },
    primaryCaregiverChapter: {
      title: 'Primary Family Caregiver information',
      pages: {
        primaryCaregiverInfoOne: {
          path: 'primary-1',
          title: 'Primary Family Caregiver information',
          uiSchema: primaryInfoPage.uiSchema,
          schema: primaryInfoPage.schema,
        },
        primaryCaregiverInfoTwo: {
          path: 'primary-2',
          title: contactInfoTitle,
          uiSchema: primaryContactInfoPage.uiSchema,
          schema: primaryContactInfoPage.schema,
        },
        primaryCaregiverInfoThree: {
          path: 'primary-3',
          title: 'Health care coverage',
          uiSchema: primaryMedicalPage.uiSchema,
          schema: primaryMedicalPage.schema,
        },
      },
    },
    secondaryCaregiversChapter: {
      title: 'Secondary Family Caregiver information',
      depends: formData => hasSecondaryCaregiverOne(formData),
      pages: {
        secondaryCaregiverOneIntro: {
          path: 'secondary-one-1',
          title: 'Secondary Family Caregiver information',
          uiSchema: {
            'ui:description': SecondaryCaregiverInfo({
              additionalInfo: true,
              headerInfo: true,
            }),
            [primaryCaregiverFields.hasSecondaryCaregiverOneView]: hasSecondaryCaregiverOneUI,
          },
          schema: {
            type: 'object',
            properties: {
              [primaryCaregiverFields.hasSecondaryCaregiverOneView]: {
                type: 'boolean',
              },
            },
          },
        },
        secondaryCaregiverOne: {
          path: 'secondary-one-2',
          title: 'Secondary Family Caregiver information',
          depends: formData => hasSecondaryCaregiverOne(formData),
          uiSchema: {
            'ui:description': SecondaryCaregiverInfo({ headerInfo: true }),
            // secondaryOne UI
            [secondaryCaregiverFields.secondaryOne.fullName]: fullNameUI(
              secondaryCaregiversUI.secondaryOneInputLabel,
            ),
            [secondaryCaregiverFields.secondaryOne.ssn]: ssnUI(
              secondaryCaregiversUI.secondaryOneInputLabel,
            ),
            [secondaryCaregiverFields.secondaryOne.dateOfBirth]: dateOfBirthUI(
              secondaryCaregiversUI.secondaryOneInputLabel,
            ),
            [secondaryCaregiverFields.secondaryOne.gender]: genderUI(
              secondaryCaregiversUI.secondaryOneInputLabel,
            ),
          },
          schema: {
            type: 'object',
            required: [
              secondaryCaregiverFields.secondaryOne.fullName,
              secondaryCaregiverFields.secondaryOne.ssn,
              secondaryCaregiverFields.secondaryOne.dateOfBirth,
              secondaryCaregiverFields.secondaryOne.gender,
            ],
            properties: {
              // secondaryOne properties
              [secondaryCaregiverFields.secondaryOne.fullName]:
                secondaryCaregiverOneProps.fullName,
              [secondaryCaregiverFields.secondaryOne.ssn]:
                secondaryCaregiverOneProps.ssnOrTin,
              [secondaryCaregiverFields.secondaryOne.dateOfBirth]:
                secondaryCaregiverOneProps.dateOfBirth,
              [secondaryCaregiverFields.secondaryOne.gender]:
                secondaryCaregiverOneProps.gender,
            },
          },
        },
        secondaryCaregiverOneThree: {
          path: 'secondary-one-3',
          title: 'Secondary Family Caregiver information',
          depends: formData => hasSecondaryCaregiverOne(formData),
          uiSchema: {
            'ui:description': SecondaryCaregiverInfo({
              pageTitle: contactInfoTitle,
            }),
            // secondaryOne UI
            [secondaryCaregiverFields.secondaryOne
              .address]: addressWithoutCountryUI(
              secondaryCaregiversUI.secondaryOneInputLabel,
            ),
            [secondaryCaregiverFields.secondaryOne
              .primaryPhoneNumber]: primaryPhoneNumberUI(
              secondaryCaregiversUI.secondaryOneInputLabel,
            ),
            [secondaryCaregiverFields.secondaryOne
              .alternativePhoneNumber]: alternativePhoneNumberUI(
              secondaryCaregiversUI.secondaryOneInputLabel,
            ),
            [secondaryCaregiverFields.secondaryOne.email]: emailUI(
              secondaryCaregiversUI.secondaryOneInputLabel,
            ),
            [secondaryCaregiverFields.secondaryOne
              .verifyEmail]: confirmationEmailUI(
              secondaryCaregiversUI.secondaryOneInputLabel,
              secondaryCaregiverFields.secondaryOne.email,
            ),
            [secondaryCaregiverFields.secondaryOne
              .vetRelationship]: vetRelationshipUI(
              secondaryCaregiversUI.secondaryOneInputLabel,
            ),
            [secondaryCaregiverFields.secondaryOne
              .hasSecondaryCaregiverTwoView]: hasSecondaryCaregiverTwoUI,
          },
          schema: {
            type: 'object',
            required: [
              secondaryCaregiverFields.secondaryOne.address,
              secondaryCaregiverFields.secondaryOne.vetRelationship,
              secondaryCaregiverFields.secondaryOne.primaryPhoneNumber,
            ],
            properties: {
              // secondaryOne properties
              [secondaryCaregiverFields.secondaryOne.address]: address,
              [secondaryCaregiverFields.secondaryOne.primaryPhoneNumber]:
                secondaryCaregiverOneProps.primaryPhoneNumber,
              [secondaryCaregiverFields.secondaryOne.alternativePhoneNumber]:
                secondaryCaregiverOneProps.alternativePhoneNumber,
              [secondaryCaregiverFields.secondaryOne.email]:
                secondaryCaregiverOneProps.email,
              [secondaryCaregiverFields.secondaryOne.verifyEmail]:
                secondaryCaregiverOneProps.email,
              [secondaryCaregiverFields.secondaryOne.vetRelationship]:
                secondaryCaregiverOneProps.vetRelationship,
              [secondaryCaregiverFields.secondaryOne
                .hasSecondaryCaregiverTwoView]: {
                type: 'boolean',
              },
            },
          },
        },
      },
    },
    secondaryCaregiversTwoChapter: {
      title: secondaryCaregiversUI.secondaryTwoChapterTitle,
      depends: formData => hasSecondaryCaregiverTwo(formData),
      pages: {
        secondaryCaregiverTwo: {
          path: 'secondary-two-1',
          title: 'Secondary Family Caregiver (2) information',
          depends: formData => hasSecondaryCaregiverTwo(formData),
          uiSchema: {
            'ui:description': SecondaryCaregiverInfo,
            // secondaryTwo UI
            [secondaryCaregiverFields.secondaryTwo.fullName]: fullNameUI(
              secondaryCaregiversUI.secondaryTwoInputLabel,
            ),
            [secondaryCaregiverFields.secondaryTwo.ssn]: ssnUI(
              secondaryCaregiversUI.secondaryTwoInputLabel,
            ),
            [secondaryCaregiverFields.secondaryTwo.dateOfBirth]: dateOfBirthUI(
              secondaryCaregiversUI.secondaryTwoInputLabel,
            ),
            [secondaryCaregiverFields.secondaryTwo.gender]: genderUI(
              secondaryCaregiversUI.secondaryTwoInputLabel,
            ),
            [secondaryCaregiverFields.secondaryTwo
              .address]: addressWithoutCountryUI(
              secondaryCaregiversUI.secondaryTwoInputLabel,
            ),
          },
          schema: {
            type: 'object',
            required: [
              secondaryCaregiverFields.secondaryTwo.fullName,
              secondaryCaregiverFields.secondaryTwo.ssn,
              secondaryCaregiverFields.secondaryTwo.dateOfBirth,
              secondaryCaregiverFields.secondaryTwo.gender,
            ],
            properties: {
              // secondaryTwo properties
              [secondaryCaregiverFields.secondaryTwo.fullName]:
                secondaryCaregiverTwoProps.fullName,
              [secondaryCaregiverFields.secondaryTwo.ssn]:
                secondaryCaregiverTwoProps.ssnOrTin,
              [secondaryCaregiverFields.secondaryTwo.dateOfBirth]:
                secondaryCaregiverTwoProps.dateOfBirth,
              [secondaryCaregiverFields.secondaryTwo.gender]:
                secondaryCaregiverTwoProps.gender,
            },
          },
        },
        secondaryCaregiverTwoTwo: {
          path: 'secondary-two-2',
          title: secondaryCaregiversUI.secondaryTwoChapterTitle,
          depends: formData => hasSecondaryCaregiverTwo(formData),
          uiSchema: {
            'ui:description': SecondaryCaregiverInfo({
              pageTitle: contactInfoTitle,
            }),
            // secondaryTwo UI
            [secondaryCaregiverFields.secondaryTwo
              .address]: addressWithoutCountryUI(
              secondaryCaregiversUI.secondaryTwoInputLabel,
            ),
            [secondaryCaregiverFields.secondaryTwo
              .primaryPhoneNumber]: primaryPhoneNumberUI(
              secondaryCaregiversUI.secondaryTwoInputLabel,
            ),
            [secondaryCaregiverFields.secondaryTwo
              .alternativePhoneNumber]: alternativePhoneNumberUI(
              secondaryCaregiversUI.secondaryTwoInputLabel,
            ),
            [secondaryCaregiverFields.secondaryTwo.email]: emailUI(
              secondaryCaregiversUI.secondaryTwoInputLabel,
            ),
            [secondaryCaregiverFields.secondaryTwo
              .verifyEmail]: confirmationEmailUI(
              secondaryCaregiversUI.secondaryTwoInputLabel,
              secondaryCaregiverFields.secondaryTwo.email,
            ),
            [secondaryCaregiverFields.secondaryTwo
              .vetRelationship]: vetRelationshipUI(
              secondaryCaregiversUI.secondaryTwoInputLabel,
            ),
          },
          schema: {
            type: 'object',
            required: [
              secondaryCaregiverFields.secondaryTwo.address,
              secondaryCaregiverFields.secondaryTwo.primaryPhoneNumber,
              secondaryCaregiverFields.secondaryTwo.vetRelationship,
            ],
            properties: {
              // secondaryTwo properties
              [secondaryCaregiverFields.secondaryTwo.address]: address,
              [secondaryCaregiverFields.secondaryTwo.primaryPhoneNumber]:
                secondaryCaregiverTwoProps.primaryPhoneNumber,
              [secondaryCaregiverFields.secondaryTwo.alternativePhoneNumber]:
                secondaryCaregiverTwoProps.alternativePhoneNumber,
              [secondaryCaregiverFields.secondaryTwo.email]:
                secondaryCaregiverTwoProps.email,
              [secondaryCaregiverFields.secondaryTwo.verifyEmail]:
                secondaryCaregiverTwoProps.email,
              [secondaryCaregiverFields.secondaryTwo.vetRelationship]:
                secondaryCaregiverTwoProps.vetRelationship,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
