import fullSchema0993 from 'vets-json-schema/dist/22-0993-schema.json';
import currentOrPastDateUI from 'us-forms-system/lib/js/definitions/currentOrPastDate';

const { fullName } = fullSchema0993.definitions;

import { genderLabels } from '../../../../platform/static-data/labels';

import fullNameUI from '../../../../platform/forms/definitions/fullName';

export const uiSchema = {
  'ui:title': 'Vet Tec',
  'ui:description': 'Please fill out the following fields.',
  vetTecApplication: {
    'ui:title': ' ',
    veteranFullName: fullNameUI,
    gender: {
      'ui:widget': 'radio',
      'ui:title': 'Gender',
      'ui:options': {
        labels: genderLabels,
      },
    },
    ssn: {
      'ui:title': 'Social Security Number',
    },
    dateOfBirth: currentOrPastDateUI('Date of birth'),
    email: {
      'ui:title': 'E-mail Adress',
    },
    dayTimePhone: {
      'ui:title': 'Day Time Telephone Number',
    },
    nightTimePhone: {
      'ui:title': 'Night Time Telephone Number',
    },
    appliedForVAEducationBenefits: {
      'ui:title':
        'Have you ever applied for VA education benefits? If not, you must complete and submit VA Form-22-1900 with this application',
      'ui:widget': 'yesNo',
    },
    activeDuty: {
      'ui:title': 'Are you currently on Active Duty?',
      'ui:widget': 'yesNo',
    },
    activeDutyDuringVetTec: {
      'ui:title':
        'Do you anticipate going into active duty during Vet Tec Program?',
      'ui:widget': 'yesNo',
    },
    bankAccountType: {
      'ui:title': 'Account Type',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          checking: 'Checking',
          savings: 'Savings',
        },
      },
    },
    bankAccountNumber: {
      'ui:title': 'Account Number',
    },
    bankRoutingNumber: {
      'ui:title': 'Routing Number',
    },
    vetTecProgram: {
      'ui:title': 'Select the VET TEC program and provider you wish to attend',
      'ui:options': {
        labels: {
          program1: 'Program 1',
          program2: 'Program 2',
          program3: 'Program 3',
          program4: 'Program 4',
          program5: 'Program 5',
        },
      },
    },
    vetTecProgramLocations: {
      'ui:title': 'Location of where you plan or will take training',
      city: {
        'ui:title': 'City',
      },
      state: {
        'ui:title': 'State',
      },
    },
    plannedStartDate: currentOrPastDateUI('Planned Start Date'),
    currentlyEmployed: {
      'ui:title': 'Are you currently employed?',
      'ui:widget': 'yesNo',
    },
    highTechnologyEmployment: {
      'ui:title': 'Are you currently working in the high technology industry?',
      'ui:widget': 'yesNo',
    },
    highTechnologyEmploymentType: {
      'ui:title': 'Select area',
      'ui:options': {
        expandUnder: 'highTechnologyEmployment',
        labels: {
          computerProgramming: 'Computer Programming',
          dataProcessing: 'Data Processing',
          computerSoftware: 'Computer Software',
          informationSciences: 'Information Sciences',
          mediaApplication: 'Media Application',
        },
      },
    },
    currentSalary: {
      'ui:title': 'What is your current salary?',
      'ui:options': {
        labels: {
          lessThanTwenty: '<$20,000',
          twentyToThirtyFive: '$20,001 - $35,000',
          thirtyFiveToFifty: '$35,001 - $50,000',
          fiftyToSeventyFive: '$50,001 - $75,000',
          moreThanSeventyFive: '>$75,000',
        },
      },
    },
    highestLevelofEducation: {
      'ui:title': 'What is your highest level of education?',
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    vetTecApplication: {
      type: 'object',
      properties: {
        veteranFullName: {
          type: 'object',
          properties: fullName.properties,
        },
        gender: {
          type: 'string',
          enum: ['F', 'M'],
        },
        ssn: {
          type: 'string',
        },
        dateOfBirth: {
          type: 'string',
        },
        email: {
          type: 'string',
          minLength: 6,
          maxLength: 80,
          pattern:
            '^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$',
        },
        dayTimePhone: {
          type: 'string',
          pattern: '^\\d{10}$',
        },
        nightTimePhone: {
          type: 'string',
          pattern: '^\\d{10}$',
        },
        appliedForVAEducationBenefits: {
          type: 'boolean',
        },
        activeDuty: {
          type: 'boolean',
        },
        activeDutyDuringVetTec: {
          type: 'boolean',
        },
        bankAccountType: {
          type: 'string',
          enum: ['checking', 'savings'],
        },
        bankAccountNumber: {
          type: 'string',
          minLength: 4,
          maxLength: 17,
        },
        bankRoutingNumber: {
          type: 'string',
          pattern: '^\\d{9}$',
        },
        vetTecProgram: {
          type: 'string',
          enum: ['program1', 'program2', 'program3', 'program4', 'program5'],
        },
        vetTecProgramLocations: {
          type: 'object',
          properties: {
            city: {
              type: 'string',
              maxLength: 30,
              pattern: "^([-a-zA-Z0-9'.#]([-a-zA-Z0-9'.# ])?)+$",
            },
            state: {
              type: 'string',
              //  enum: states,
            },
          },
        },
        plannedStartDate: {
          type: 'string',
        },
        currentlyEmployed: {
          type: 'boolean',
        },
        highTechnologyEmployment: {
          type: 'boolean',
        },
        highTechnologyEmploymentType: {
          type: 'string',
          enum: [
            'computerProgramming',
            'dataProcessing',
            'computerSoftware',
            'informationSciences',
            'mediaApplication',
          ],
        },
        currentSalary: {
          type: 'string',
          enum: [
            'lessThanTwenty',
            'twentyToThirtyFive',
            'thirtyFiveToFifty',
            'fiftyToSeventyFive',
            'moreThanSeventyFive',
          ],
        },
        highestLevelofEducation: {
          type: 'string',
        },
      },
    },
  },
};
