import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import { states } from 'platform/forms/address';
import IntroductionPage from 'applications/caregivers/containers/IntroductionPage';
import ConfirmationPage from 'applications/caregivers/containers/ConfirmationPage';
import {
  VetInfo,
  PrimaryCaregiverInfo,
  SecondaryCaregiverInfo,
  PrimaryHealthCoverage,
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
  genderUI,
  hassecondaryCaregiverOneUI,
  hassecondaryCaregiverTwoUI,
  primaryPhoneNumberUI,
  vetRelationshipUI,
} = definitions.sharedItems;

const { vetUI, primaryCaregiverUI, secondaryCaregiverUI } = definitions;

const hassecondaryCaregiverOne = formData =>
  formData[primaryCaregiverFields.hassecondaryCaregiverOneView] === true;

const hassecondaryCaregiverTwo = formData =>
  formData[
    secondaryCaregiverFields.secondaryOne.hassecondaryCaregiverTwoView
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
  title:
    'Apply for the Program of Comprehensive Assistance for Family Caregivers',
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
          title: ' ',
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
          title: 'Contact information',
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
          title: 'VA medical center information',
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
      title: 'Primary Family Caregiver information',
      pages: {
        primaryCaregiverInfoOne: {
          path: 'primary-caregiver-1',
          title: ' ',
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
          title: 'Contact information',
          uiSchema: {
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
          title: 'Health care coverage',
          uiSchema: {
            'ui:description': PrimaryHealthCoverage,
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
      title: 'Secondary Family Caregiver Information',
      pages: {
        secondaryCaregiverOneIntro: {
          path: 'secondaryOne-caregiver-intro',
          title: ' ',
          uiSchema: {
            'ui:description': SecondaryCaregiverInfo({ additionalInfo: true }),
            [primaryCaregiverFields.hassecondaryCaregiverOneView]: hassecondaryCaregiverOneUI,
          },
          schema: {
            type: 'object',
            properties: {
              [primaryCaregiverFields.hassecondaryCaregiverOneView]: {
                type: 'boolean',
              },
            },
          },
        },
        secondaryCaregiverOne: {
          path: 'secondaryOne-caregiver-1',
          title: 'Secondary Caregiver Information',
          depends: formData => hassecondaryCaregiverOne(formData),
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
          path: 'secondaryOne-caregiver-2',
          title: 'Secondary Caregiver Information',
          depends: formData => hassecondaryCaregiverOne(formData),
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
              .hassecondaryCaregiverTwoView]: hassecondaryCaregiverTwoUI,
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
                .hassecondaryCaregiverTwoView]: {
                type: 'boolean',
              },
            },
          },
        },
        secondaryCaregiverTwo: {
          path: 'secondaryTwo-caregiver-1',
          title: 'Secondary Family Caregiver Information',
          depends: formData => hassecondaryCaregiverTwo(formData),
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
          path: 'secondaryTwo-caregiver-2',
          title: 'Contact information',
          depends: formData => hassecondaryCaregiverTwo(formData),
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
