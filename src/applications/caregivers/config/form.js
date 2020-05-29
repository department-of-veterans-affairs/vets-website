import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { states } from 'platform/forms/address';
import IntroductionPage from 'applications/caregivers/containers/IntroductionPage';
import ConfirmationPage from 'applications/caregivers/containers/ConfirmationPage';
import NeedHelpFooter from 'applications/caregivers/components/NeedHelpFooter';
import PreSubmitInfo from 'applications/caregivers/components/PreSubmitInfo';
import { medicalCentersByState } from 'applications/caregivers/helpers';
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
} from '../definitions/caregiverUI';

const plannedClinic = fullSchema.properties.veteran.properties.plannedClinic;

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
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'caregiver-1010cg',
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
          uiSchema: {
            'ui:description': VetInfo({ headerInfo: true }),
            [vetFields.fullName]: fullNameUI(vetUI.vetInputLabel),
            [vetFields.ssn]: ssnUI(vetUI.vetInputLabel),
            [vetFields.dateOfBirth]: dateOfBirthUI(vetUI.vetInputLabel),
            [vetFields.gender]: genderUI(vetUI.vetInputLabel),
          },
          schema: {
            type: 'object',
            required: [
              vetFields.dateOfBirth,
              vetFields.fullName,
              vetFields.ssn,
              vetFields.gender,
            ],
            properties: {
              [vetFields.fullName]: veteranProps.fullName,
              [vetFields.ssn]: veteranProps.ssnOrTin,
              [vetFields.dateOfBirth]: veteranProps.dateOfBirth,
              [vetFields.gender]: veteranProps.gender,
            },
          },
        },
        veteranInfoTwo: {
          path: 'vet-2',
          title: contactInfoTitle,
          uiSchema: {
            'ui:description': VetInfo({
              pageTitle: contactInfoTitle,
              headerInfo: true,
            }),
            [vetFields.address]: addressWithoutCountryUI(vetUI.vetInputLabel),
            [vetFields.primaryPhoneNumber]: primaryPhoneNumberUI(
              vetUI.vetInputLabel,
            ),
            [vetFields.alternativePhoneNumber]: alternativePhoneNumberUI(
              vetUI.vetInputLabel,
            ),
            [vetFields.email]: emailUI(vetUI.vetInputLabel),
            [vetFields.verifyEmail]: confirmationEmailUI(
              vetUI.vetInputLabel,
              vetFields.email,
            ),
          },
          schema: {
            type: 'object',
            required: [vetFields.address, vetFields.primaryPhoneNumber],
            properties: {
              [vetFields.address]: address,
              [vetFields.primaryPhoneNumber]: phone,
              [vetFields.alternativePhoneNumber]: phone,
              [vetFields.email]: veteranProps.email,
              [vetFields.verifyEmail]: veteranProps.email,
            },
          },
        },
        veteranInfoThree: {
          path: 'vet-3',
          title: 'VA medical center',
          uiSchema: {
            'ui:description': VetInfo({
              pageTitle: 'VA medical center',
            }),
            [vetFields.previousTreatmentFacility]:
              vetUI.previousTreatmentFacilityUI,
            [vetFields.preferredFacilityView]: {
              ...vetUI[vetFields.preferredFacilityView],
            },
            [vetFields.preferredFacilityInfoView]: vetUI.preferredFacilityInfo,
          },
          schema: {
            type: 'object',
            properties: {
              // TODO: update using full schema
              [vetFields.previousTreatmentFacility]: {
                type: 'object',
                additionalProperties: false,
                required: ['name', 'type'],
                properties: {
                  name: {
                    type: 'string',
                  },
                  type: {
                    type: 'string',
                    enum: ['hospital', 'clinic'],
                  },
                },
              },
              // dynamic properties for filtering facilities dropDown
              [vetFields.preferredFacilityView]: {
                type: 'object',
                required: [
                  vetFields.preferredFacilityStateView,
                  vetFields.plannedClinic,
                ],
                properties: {
                  [vetFields.preferredFacilityStateView]: {
                    type: 'string',
                    enum: states.USA.map(state => state.value).filter(
                      state => !!medicalCentersByState[state],
                    ),
                  },
                  [vetFields.plannedClinic]: Object.assign({}, plannedClinic, {
                    enum: [],
                  }),
                },
              },
              // facility additional info section - noop property
              [vetFields.preferredFacilityInfoView]: {
                type: 'string',
              },
            },
          },
        },
      },
    },
    primaryCaregiverChapter: {
      title: 'Primary Family Caregiver information',
      pages: {
        primaryCaregiverInfoOne: {
          path: 'primary-1',
          title: 'Primary Family Caregiver information',
          uiSchema: {
            'ui:description': () =>
              PrimaryCaregiverInfo({ additionalInfo: true }),
            [primaryCaregiverFields.fullName]: fullNameUI(
              primaryCaregiverUI.primaryInputLabel,
            ),
            [primaryCaregiverFields.ssn]: ssnUI(
              primaryCaregiverUI.primaryInputLabel,
            ),
            [primaryCaregiverFields.dateOfBirth]: dateOfBirthUI(
              primaryCaregiverUI.primaryInputLabel,
            ),
            [primaryCaregiverFields.gender]: genderUI(
              primaryCaregiverUI.primaryInputLabel,
            ),
          },
          schema: {
            type: 'object',
            required: [
              primaryCaregiverFields.fullName,
              primaryCaregiverFields.ssn,
              primaryCaregiverFields.dateOfBirth,
              primaryCaregiverFields.gender,
            ],
            properties: {
              [primaryCaregiverFields.fullName]: primaryCaregiverProps.fullName,
              [primaryCaregiverFields.ssn]: primaryCaregiverProps.ssnOrTin,
              [primaryCaregiverFields.dateOfBirth]:
                primaryCaregiverProps.dateOfBirth,
              [primaryCaregiverFields.gender]: primaryCaregiverProps.gender,
            },
          },
        },
        primaryCaregiverInfoTwo: {
          path: 'primary-2',
          title: contactInfoTitle,
          uiSchema: {
            'ui:description': () =>
              PrimaryCaregiverInfo({ pageTitle: contactInfoTitle }),
            [primaryCaregiverFields.address]: addressWithoutCountryUI(
              primaryCaregiverUI.primaryInputLabel,
            ),
            [primaryCaregiverFields.primaryPhoneNumber]: primaryPhoneNumberUI(
              primaryCaregiverUI.primaryInputLabel,
            ),
            [primaryCaregiverFields.alternativePhoneNumber]: alternativePhoneNumberUI(
              primaryCaregiverUI.primaryInputLabel,
            ),
            [primaryCaregiverFields.email]: emailUI(
              primaryCaregiverUI.primaryInputLabel,
            ),
            [primaryCaregiverFields.verifyEmail]: confirmationEmailUI(
              primaryCaregiverUI.primaryInputLabel,
              primaryCaregiverFields.email,
            ),
            [primaryCaregiverFields.vetRelationship]: vetRelationshipUI(
              primaryCaregiverUI.primaryInputLabel,
            ),
          },
          schema: {
            type: 'object',
            required: [
              primaryCaregiverFields.address,
              primaryCaregiverFields.primaryPhoneNumber,
              primaryCaregiverFields.vetRelationship,
            ],
            properties: {
              [primaryCaregiverFields.address]: address,
              [primaryCaregiverFields.primaryPhoneNumber]:
                primaryCaregiverProps.primaryPhoneNumber,
              [primaryCaregiverFields.alternativePhoneNumber]:
                primaryCaregiverProps.alternativePhoneNumber,
              [primaryCaregiverFields.email]: primaryCaregiverProps.email,
              [primaryCaregiverFields.verifyEmail]: primaryCaregiverProps.email,
              [primaryCaregiverFields.vetRelationship]:
                primaryCaregiverProps.vetRelationship,
            },
          },
        },
        primaryCaregiverInfoThree: {
          path: 'primary-3',
          title: 'Health care coverage',
          uiSchema: {
            'ui:description': PrimaryHealthCoverage({
              pageTitle: 'Health care coverage',
            }),
            [primaryCaregiverFields.medicaidEnrolled]:
              primaryCaregiverUI.medicaidEnrolledUI,
            [primaryCaregiverFields.medicareEnrolled]:
              primaryCaregiverUI.medicareEnrolledUI,
            [primaryCaregiverFields.tricareEnrolled]:
              primaryCaregiverUI.tricareEnrolledUI,
            [primaryCaregiverFields.champvaEnrolled]:
              primaryCaregiverUI.champvaEnrolledUI,
            [primaryCaregiverFields.otherHealthInsurance]:
              primaryCaregiverUI.otherHealthInsuranceUI,
            [primaryCaregiverFields.otherHealthInsuranceName]:
              primaryCaregiverUI.otherHealthInsuranceNameUI,
          },
          schema: {
            type: 'object',
            required: [
              primaryCaregiverFields.medicaidEnrolled,
              primaryCaregiverFields.medicareEnrolled,
              primaryCaregiverFields.tricareEnrolled,
              primaryCaregiverFields.champvaEnrolled,
              primaryCaregiverFields.otherHealthInsurance,
            ],
            properties: {
              [primaryCaregiverFields.medicaidEnrolled]:
                primaryCaregiverProps.medicaidEnrolled,
              [primaryCaregiverFields.medicareEnrolled]:
                primaryCaregiverProps.medicareEnrolled,
              [primaryCaregiverFields.tricareEnrolled]:
                primaryCaregiverProps.tricareEnrolled,
              [primaryCaregiverFields.champvaEnrolled]:
                primaryCaregiverProps.champvaEnrolled,
              [primaryCaregiverFields.otherHealthInsurance]: {
                type: 'boolean',
              },
              [primaryCaregiverFields.otherHealthInsuranceName]:
                primaryCaregiverProps.otherHealthInsuranceName,
            },
          },
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
              pathTitle: contactInfoTitle,
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
