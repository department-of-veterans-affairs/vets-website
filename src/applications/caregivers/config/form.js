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
} = definitions.sharedItems;

const { vetUI, primaryCaregiverUI } = definitions;

const hasSecondaryCaregiverOne = formData =>
  formData[primaryCaregiverFields.hassecondaryCaregiverOneView] === true;

const hasSecondaryCaregiverTwo = formData =>
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
      title: 'Veteran/service member information',
      pages: {
        veteranInfoOne: {
          path: 'service-member-1',
          title: ' ',
          uiSchema: {
            'ui:description': VetInfo,
            [vetFields.fullName]: fullNameUI('Veteran'),
            [vetFields.ssn]: ssnUI('Veteran'),
            [vetFields.dateOfBirth]: dateOfBirthUI('Veteran'),
            [vetFields.gender]: genderUI('Veteran'),
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
            [vetFields.address]: addressWithoutCountryUI('Veteran'),
            [vetFields.primaryPhoneNumber]: primaryPhoneNumberUI('Veteran'),
            [vetFields.alternativePhoneNumber]: alternativePhoneNumberUI(
              'Veteran',
            ),
            [vetFields.email]: emailUI('Veteran'),
            [vetFields.verifyEmail]: confirmationEmailUI(
              'Veteran',
              vetFields.email,
            ),
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
            [primaryCaregiverFields.fullName]: fullNameUI(
              'Primary Family Caregiver',
            ),
            [primaryCaregiverFields.ssn]: ssnUI('Primary Family Caregiver'),
            [primaryCaregiverFields.dateOfBirth]: dateOfBirthUI(
              'Primary Family Caregiver',
            ),
            [primaryCaregiverFields.gender]: genderUI(
              'Primary Family Caregiver',
            ),
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
            [primaryCaregiverFields.address]: addressWithoutCountryUI(
              'Primary Family Caregiver',
            ),
            [primaryCaregiverFields.primaryPhoneNumber]: primaryPhoneNumberUI(
              'Primary Family Caregiver',
            ),
            [primaryCaregiverFields.alternativePhoneNumber]: alternativePhoneNumberUI(
              'Primary Family Caregiver',
            ),
            [primaryCaregiverFields.email]: emailUI('Primary Family Caregiver'),
            [primaryCaregiverFields.verifyEmail]: confirmationEmailUI(
              'Primary Family Caregiver',
              primaryCaregiverFields.email,
            ),
            [primaryCaregiverFields.vetRelationship]: vetRelationshipUI(
              'Primary Family Caregiver',
            ),
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
            [primaryCaregiverFields.hassecondaryCaregiverOneView]: hasSecondaryCaregiverOneUI,
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
          depends: formData => hasSecondaryCaregiverOne(formData),
          uiSchema: {
            'ui:description': SecondaryCaregiverInfo,
            // secondaryOne UI
            [secondaryCaregiverFields.secondaryOne.fullName]: fullNameUI(
              'Secondary One Family Caregiver',
            ),
            [secondaryCaregiverFields.secondaryOne.ssn]: ssnUI(
              'Secondary One Family Caregiver',
            ),
            [secondaryCaregiverFields.secondaryOne.dateOfBirth]: dateOfBirthUI(
              'Secondary One Family Caregiver',
            ),
            [secondaryCaregiverFields.secondaryOne.gender]: genderUI(
              'Secondary One Family Caregiver',
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
          path: 'secondaryOne-caregiver-2',
          title: 'Secondary Caregiver Information',
          depends: formData => hasSecondaryCaregiverOne(formData),
          uiSchema: {
            'ui:description': SecondaryCaregiverInfo,
            // secondaryOne UI
            [secondaryCaregiverFields.secondaryOne
              .address]: addressWithoutCountryUI(
              'Secondary One Family Caregiver',
            ),
            [secondaryCaregiverFields.secondaryOne
              .primaryPhoneNumber]: primaryPhoneNumberUI(
              'Secondary One Family Caregiver',
            ),
            [secondaryCaregiverFields.secondaryOne
              .alternativePhoneNumber]: alternativePhoneNumberUI(
              'Secondary One Family Caregiver',
            ),
            [secondaryCaregiverFields.secondaryOne.email]: emailUI(
              'Secondary One Family Caregiver',
            ),
            [secondaryCaregiverFields.secondaryOne
              .verifyEmail]: confirmationEmailUI(
              'Secondary One Family Caregiver',
              secondaryCaregiverFields.secondaryOne.email,
            ),
            [secondaryCaregiverFields.secondaryOne
              .vetRelationship]: vetRelationshipUI(
              'Secondary One Family Caregiver',
            ),
            [secondaryCaregiverFields.secondaryOne
              .hassecondaryCaregiverTwoView]: hasSecondaryCaregiverTwoUI,
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
          depends: formData => hasSecondaryCaregiverTwo(formData),
          uiSchema: {
            'ui:description': SecondaryCaregiverInfo,
            // secondaryTwo UI
            [secondaryCaregiverFields.secondaryTwo.fullName]: fullNameUI(
              'Secondary Two Family Caregiver',
            ),
            [secondaryCaregiverFields.secondaryTwo.ssn]: ssnUI(
              'Secondary Two Family Caregiver',
            ),
            [secondaryCaregiverFields.secondaryTwo.dateOfBirth]: dateOfBirthUI(
              'Secondary Two Family Caregiver',
            ),
            [secondaryCaregiverFields.secondaryTwo.gender]: genderUI(
              'Secondary Two Family Caregiver',
            ),
            [secondaryCaregiverFields.secondaryTwo
              .address]: addressWithoutCountryUI(
              'Secondary Two Family Caregiver',
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
          path: 'secondaryTwo-caregiver-2',
          title: 'Contact information',
          depends: formData => hasSecondaryCaregiverTwo(formData),
          uiSchema: {
            'ui:description': SecondaryCaregiverInfo,
            // secondaryTwo UI
            [secondaryCaregiverFields.secondaryTwo
              .address]: addressWithoutCountryUI(
              'Secondary Two Family Caregiver',
            ),
            [secondaryCaregiverFields.secondaryTwo
              .primaryPhoneNumber]: primaryPhoneNumberUI(
              'Secondary Two Family Caregiver',
            ),
            [secondaryCaregiverFields.secondaryTwo
              .alternativePhoneNumber]: alternativePhoneNumberUI(
              'Secondary Two Family Caregiver',
            ),
            [secondaryCaregiverFields.secondaryTwo.email]: emailUI(
              'Secondary Two Family Caregiver',
            ),
            [secondaryCaregiverFields.secondaryTwo
              .verifyEmail]: confirmationEmailUI(
              'Secondary Two Family Caregiver',
              secondaryCaregiverFields.secondaryTwo.email,
            ),
            [secondaryCaregiverFields.secondaryTwo
              .vetRelationship]: vetRelationshipUI(
              'Secondary Two Family Caregiver',
            ),
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
