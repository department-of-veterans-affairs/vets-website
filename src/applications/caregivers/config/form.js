import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import { states } from 'platform/forms/address';
import IntroductionPage from 'applications/caregivers/containers/IntroductionPage';
import ConfirmationPage from 'applications/caregivers/containers/ConfirmationPage';
import {
  VetInfo,
  PrimaryCaregiverInfo,
  SecondaryCaregiverInfo,
} from 'applications/caregivers/components/AdditionalInfo';
import {
  primaryCaregiverFields,
  secondaryCaregiverFields,
  vetFields,
} from 'applications/caregivers/definitions/constants';
import NeedHelpFooter from 'applications/caregivers/components/NeedHelpFooter';
import PreSubmitInfo from 'applications/caregivers/components/PreSubmitInfo';
import { medicalCentersByState } from 'applications/caregivers/helpers';
import definitions, {
  confirmationEmail,
  addressWithoutCountry,
} from '../definitions/caregiverUI';

const plannedClinic = fullSchema.properties.veteran.properties.plannedClinic;

const {
  veteran,
  primaryCaregiver,
  secondaryOneCaregiver,
  secondaryTwoCaregiver,
} = fullSchema.properties;
const veteranProps = veteran.properties;
const primaryCaregiverProps = primaryCaregiver.properties;
const secondaryOneCaregiverProps = secondaryOneCaregiver.properties;
const secondaryTwoCaregiverProps = secondaryTwoCaregiver.properties;

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
  genderUI,
  hasSecondaryOneCaregiverUI,
  hasSecondaryTwoCaregiverUI,
  primaryPhoneNumberUI,
  vetRelationshipUI,
} = definitions.sharedItems;

const { vetUI, primaryCaregiverUI, secondaryCaregiverUI } = definitions;

const hasSecondaryOneCaregiver = formData =>
  formData[primaryCaregiverFields.hasSecondaryOneCaregiverView] === true;

const hasSecondaryTwoCaregiver = formData =>
  formData[
    secondaryCaregiverFields.secondaryOne.hasSecondaryTwoCaregiverView
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
  trackingPrefix: 'caregiver-',
  introduction: IntroductionPage,
  footerContent: NeedHelpFooter,
  preSubmitInfo: PreSubmitInfo,
  confirmation: ConfirmationPage,
  formId: '10-10CG',
  version: 0,
  prefillEnabled: false,
  title: 'Apply for family caregiver benefits',
  subTitle: 'Form 10-10CG',
  defaultDefinitions: {
    address,
    addressWithoutCountry,
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
      title: 'Veteran/service member information',
      pages: {
        veteranInfoOne: {
          path: 'service-member-1',
          title: 'Veteran Information',
          uiSchema: {
            'ui:description': VetInfo,
            [vetFields.fullName]: fullNameUI,
            [vetFields.ssn]: vetUI.ssnUI,
            [vetFields.dateOfBirth]: dateOfBirthUI,
            [vetFields.gender]: genderUI,
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
          path: 'service-member-2',
          title: 'Veteran Information (Continued)',
          uiSchema: {
            'ui:description': VetInfo,
            [vetFields.address]: addressWithoutCountry,
            [vetFields.primaryPhoneNumber]: primaryPhoneNumberUI,
            [vetFields.alternativePhoneNumber]: alternativePhoneNumberUI,
            [vetFields.email]: emailUI,
            [vetFields.verifyEmail]: confirmationEmail(vetFields.email),
          },
          schema: {
            type: 'object',
            required: [vetFields.address],
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
          path: 'service-member-3',
          title: 'Veteran Information (Continued)',
          uiSchema: {
            'ui:description': VetInfo,
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
      title: 'PRIMARY FAMILY CAREGIVER',
      pages: {
        primaryCaregiverInfoOne: {
          path: 'primary-caregiver-1',
          title: 'Primary Caregiver Information',
          uiSchema: {
            'ui:description': () =>
              PrimaryCaregiverInfo({ additionalInfo: true }),
            [primaryCaregiverFields.fullName]: fullNameUI,
            [primaryCaregiverFields.ssn]: primaryCaregiverUI.ssnUI,
            [primaryCaregiverFields.dateOfBirth]: dateOfBirthUI,
            [primaryCaregiverFields.gender]: genderUI,
          },
          schema: {
            type: 'object',
            required: [
              primaryCaregiverFields.fullName,
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
          path: 'primary-caregiver-2',
          title: 'Primary Caregiver Information (Continued)',
          uiSchema: {
            'ui:description': PrimaryCaregiverInfo({ additionalInfo: true }),
            [primaryCaregiverFields.address]: addressWithoutCountry,
            [primaryCaregiverFields.primaryPhoneNumber]: primaryPhoneNumberUI,
            [primaryCaregiverFields.alternativePhoneNumber]: alternativePhoneNumberUI,
            [primaryCaregiverFields.email]: emailUI,
            [primaryCaregiverFields.verifyEmail]: confirmationEmail(
              primaryCaregiverFields.email,
            ),
            [primaryCaregiverFields.vetRelationship]: vetRelationshipUI,
          },
          schema: {
            type: 'object',
            required: [
              primaryCaregiverFields.address,
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
          path: 'primary-caregiver-3',
          title: 'Primary Caregiver Information (Continued)',
          uiSchema: {
            'ui:description': PrimaryCaregiverInfo,
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
            required: [primaryCaregiverFields.otherHealthInsurance],
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
      title: 'SECONDARY CAREGIVERS',
      pages: {
        secondaryOneCaregiverIntro: {
          path: 'secondaryOne-caregiver-intro',
          title: 'Secondary Caregiver Information',
          uiSchema: {
            'ui:description': SecondaryCaregiverInfo,
            [primaryCaregiverFields.hasSecondaryOneCaregiverView]: hasSecondaryOneCaregiverUI,
          },
          schema: {
            type: 'object',
            properties: {
              [primaryCaregiverFields.hasSecondaryOneCaregiverView]: {
                type: 'boolean',
              },
            },
          },
        },
        secondaryOneCaregiver: {
          path: 'secondaryOne-caregiver-1',
          title: 'Secondary Caregiver Information',
          depends: formData => hasSecondaryOneCaregiver(formData),
          uiSchema: {
            'ui:description': SecondaryCaregiverInfo,
            // secondaryOne UI
            [secondaryCaregiverFields.secondaryOne.fullName]:
              secondaryCaregiverUI.secondaryOne.fullNameUI,
            [secondaryCaregiverFields.secondaryOne.ssn]:
              secondaryCaregiverUI.secondaryOne.ssnUI,
            [secondaryCaregiverFields.secondaryOne.dateOfBirth]: dateOfBirthUI,
            [secondaryCaregiverFields.secondaryOne.gender]: genderUI,
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
                secondaryOneCaregiverProps.fullName,
              [secondaryCaregiverFields.secondaryOne.ssn]:
                secondaryOneCaregiverProps.ssnOrTin,
              [secondaryCaregiverFields.secondaryOne.dateOfBirth]:
                secondaryOneCaregiverProps.dateOfBirth,
              [secondaryCaregiverFields.secondaryOne.gender]:
                secondaryOneCaregiverProps.gender,
            },
          },
        },
        secondaryOneCaregiverThree: {
          path: 'secondaryOne-caregiver-2',
          title: 'Secondary Caregiver Information',
          depends: formData => hasSecondaryOneCaregiver(formData),
          uiSchema: {
            'ui:description': SecondaryCaregiverInfo,
            // secondaryOne UI
            [secondaryCaregiverFields.secondaryOne
              .address]: addressWithoutCountry,
            [secondaryCaregiverFields.secondaryOne
              .primaryPhoneNumber]: primaryPhoneNumberUI,
            [secondaryCaregiverFields.secondaryOne
              .alternativePhoneNumber]: alternativePhoneNumberUI,
            [secondaryCaregiverFields.secondaryOne.email]: emailUI,
            [secondaryCaregiverFields.secondaryOne
              .verifyEmail]: confirmationEmail(
              secondaryCaregiverFields.secondaryOne.email,
            ),
            [secondaryCaregiverFields.secondaryOne
              .vetRelationship]: vetRelationshipUI,
            [secondaryCaregiverFields.secondaryOne
              .hasSecondaryTwoCaregiverView]: hasSecondaryTwoCaregiverUI,
          },
          schema: {
            type: 'object',
            required: [
              secondaryCaregiverFields.secondaryOne.address,
              secondaryCaregiverFields.secondaryOne.vetRelationship,
            ],
            properties: {
              // secondaryOne properties
              [secondaryCaregiverFields.secondaryOne.address]: address,
              [secondaryCaregiverFields.secondaryOne.primaryPhoneNumber]:
                secondaryOneCaregiverProps.primaryPhoneNumber,
              [secondaryCaregiverFields.secondaryOne.alternativePhoneNumber]:
                secondaryOneCaregiverProps.alternativePhoneNumber,
              [secondaryCaregiverFields.secondaryOne.email]:
                secondaryOneCaregiverProps.email,
              [secondaryCaregiverFields.secondaryOne.verifyEmail]:
                secondaryOneCaregiverProps.email,
              [secondaryCaregiverFields.secondaryOne.vetRelationship]:
                secondaryOneCaregiverProps.vetRelationship,
              [secondaryCaregiverFields.secondaryOne
                .hasSecondaryTwoCaregiverView]: {
                type: 'boolean',
              },
            },
          },
        },
        secondaryTwoCaregiverOne: {
          path: 'secondaryTwo-caregiver-1',
          title: 'Secondary Caregiver Information',
          depends: formData => hasSecondaryTwoCaregiver(formData),
          uiSchema: {
            'ui:description': SecondaryCaregiverInfo,
            // secondaryTwo UI
            [secondaryCaregiverFields.secondaryTwo.fullName]:
              secondaryCaregiverUI.secondaryTwo.fullNameUI,
            [secondaryCaregiverFields.secondaryTwo.ssn]:
              secondaryCaregiverUI.secondaryTwo.ssnUI,
            [secondaryCaregiverFields.secondaryTwo.dateOfBirth]:
              secondaryCaregiverUI.secondaryTwo.dateOfBirthUI,
            [secondaryCaregiverFields.secondaryTwo.gender]:
              secondaryCaregiverUI.secondaryTwo.genderUI,
            [secondaryCaregiverFields.secondaryTwo
              .address]: addressWithoutCountry,
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
                secondaryTwoCaregiverProps.fullName,
              [secondaryCaregiverFields.secondaryTwo.ssn]:
                secondaryTwoCaregiverProps.ssnOrTin,
              [secondaryCaregiverFields.secondaryTwo.dateOfBirth]:
                secondaryTwoCaregiverProps.dateOfBirth,
              [secondaryCaregiverFields.secondaryTwo.gender]:
                secondaryTwoCaregiverProps.gender,
            },
          },
        },
        secondaryTwoCaregiverTwo: {
          path: 'secondaryTwo-caregiver-2',
          title: 'Secondary Caregiver Information',
          depends: formData => hasSecondaryTwoCaregiver(formData),
          uiSchema: {
            'ui:description': SecondaryCaregiverInfo,
            // secondaryTwo UI
            [secondaryCaregiverFields.secondaryTwo
              .address]: addressWithoutCountry,
            [secondaryCaregiverFields.secondaryTwo.primaryPhoneNumber]:
              secondaryCaregiverUI.secondaryTwo.primaryPhoneNumberUI,
            [secondaryCaregiverFields.secondaryTwo.alternativePhoneNumber]:
              secondaryCaregiverUI.secondaryTwo.alternativePhoneNumberUI,
            [secondaryCaregiverFields.secondaryTwo.email]:
              secondaryCaregiverUI.secondaryTwo.emailUI,
            [secondaryCaregiverFields.secondaryTwo
              .verifyEmail]: confirmationEmail(
              secondaryCaregiverFields.secondaryTwo.email,
            ),
            [secondaryCaregiverFields.secondaryTwo.vetRelationship]:
              secondaryCaregiverUI.secondaryTwo.vetRelationshipUI,
          },
          schema: {
            type: 'object',
            required: [
              secondaryCaregiverFields.secondaryOne.address,
              secondaryCaregiverFields.secondaryOne.vetRelationship,
            ],
            properties: {
              // secondaryTwo properties
              [secondaryCaregiverFields.secondaryTwo.address]: address,
              [secondaryCaregiverFields.secondaryTwo.primaryPhoneNumber]:
                secondaryTwoCaregiverProps.primaryPhoneNumber,
              [secondaryCaregiverFields.secondaryTwo.alternativePhoneNumber]:
                secondaryTwoCaregiverProps.alternativePhoneNumber,
              [secondaryCaregiverFields.secondaryTwo.email]:
                secondaryTwoCaregiverProps.email,
              [secondaryCaregiverFields.secondaryTwo.verifyEmail]:
                secondaryTwoCaregiverProps.email,
              [secondaryCaregiverFields.secondaryTwo.vetRelationship]:
                secondaryTwoCaregiverProps.vetRelationship,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
