import _ from 'lodash/fp';

import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';

import * as address from 'platform/forms/definitions/address';

import educationTypeUISchema from '../../definitions/educationType';
import serviceBefore1977UI from '../../definitions/serviceBefore1977';
import * as toursOfDuty from '../../definitions/toursOfDuty.jsx';

import createContactInformationPage from '../../pages/contactInformation';
import createOldSchoolPage from '../../pages/oldSchool';
import createDirectDepositChangePage from '../../pages/directDepositChange';
import createApplicantInformationPage from 'platform/forms/pages/applicantInformation';

import { showSchoolAddress } from '../../utils/helpers';
import { display10203StemFlow, displayStemEligibility } from '../helpers';

import { activeDuty, benefitSelection, stem, stemEligibility } from '../pages';
import { validateWhiteSpace } from 'platform/forms/validations';

const {
  civilianBenefitsAssistance,
  educationObjective,
  nonVaAssistance,
} = fullSchema1995.properties;

const { educationType, serviceBefore1977 } = fullSchema1995.definitions;

export const chapters = {
  applicantInformation: {
    title: 'Applicant Information',
    pages: {
      applicantInformation: createApplicantInformationPage(fullSchema1995, {
        isVeteran: true,
        fields: [
          'veteranFullName',
          'veteranSocialSecurityNumber',
          'view:noSSN',
          'vaFileNumber',
        ],
        required: ['veteranFullName'],
      }),
    },
  },
  benefitSelection: {
    title: 'Education Benefit',
    pages: {
      benefitSelection: {
        title: 'Education benefit selection',
        path: 'benefits/eligibility',
        uiSchema: benefitSelection.uiSchema,
        schema: benefitSelection.schema,
      },
      // related to 1995-STEM
      stem: {
        title: 'Rogers STEM Scholarship',
        path: 'benefits/stem',
        uiSchema: stem.uiSchema,
        schema: stem.schema,
      },
      // related to 1995-STEM
      stemEligibility: {
        title: 'Rogers STEM Scholarship eligibility',
        path: 'benefits/stem-eligibility',
        pageClass: 'vads-u-max-width--100 vads-u-vads-u-width--full',
        depends: form => displayStemEligibility(form), // 1995-STEM related
        uiSchema: stemEligibility.uiSchema,
        schema: stemEligibility.schema,
      },
    },
  },
  militaryService: {
    title: 'Military History',
    pages: {
      // 1995-STEM related
      activeDuty: {
        title: 'Active Duty',
        path: 'active-duty',
        depends: display10203StemFlow, // 1995-STEM related
        uiSchema: activeDuty.uiSchema,
        schema: activeDuty.schema,
      },
      servicePeriods: {
        path: 'military/service',
        title: 'Service periods',
        depends: form => !display10203StemFlow(form), // 1995-STEM related
        uiSchema: {
          'view:newService': {
            'ui:title':
              'Do you have any new periods of service to record since you last applied for education benefits?',
            'ui:widget': 'yesNo',
          },
          toursOfDuty: _.merge(toursOfDuty.uiSchema, {
            'ui:options': { expandUnder: 'view:newService' },
          }),
        },
        schema: {
          type: 'object',
          properties: {
            'view:newService': {
              type: 'boolean',
            },
            toursOfDuty: fullSchema1995.properties.toursOfDuty,
          },
        },
      },
      militaryHistory: {
        title: 'Military history',
        path: 'military/history',
        depends: form => !display10203StemFlow(form), // 1995-STEM related
        uiSchema: {
          'view:hasServiceBefore1978': {
            'ui:title':
              'Do you have any periods of service that began before 1978?',
            'ui:widget': 'yesNo',
          },
        },
        schema: {
          type: 'object',
          properties: {
            'view:hasServiceBefore1978': {
              type: 'boolean',
            },
          },
        },
      },
    },
  },
  schoolSelection: {
    title: 'School Selection',
    pages: {
      newSchool: {
        path: 'school-selection/new-school',
        title:
          'School, university, program, or training facility you want to attend',
        initialData: {
          newSchoolAddress: {},
        },
        uiSchema: {
          'ui:title':
            'School, university, program, or training facility you want to attend',
          // Broken up because we need to fit educationType between name and address
          // Put back together again in transform()
          newSchoolName: {
            'ui:title': 'Name of school, university, or training facility',
            'ui:validations': [
              (errors, newSchoolName) => {
                validateWhiteSpace(errors, newSchoolName);
              },
            ],
          },
          educationType: educationTypeUISchema,
          newSchoolAddress: _.merge(address.uiSchema(), {
            'ui:options': {
              hideIf: formData => !showSchoolAddress(formData.educationType),
            },
          }),
          educationObjective: {
            'ui:title':
              'Education or career goal (for example, “Get a bachelor’s degree in criminal justice” or “Get an HVAC technician certificate” or “Become a police officer.”)',
            'ui:widget': 'textarea',
          },
          nonVaAssistance: {
            'ui:title':
              'Are you getting, or do you expect to get any money (including, but not limited to, federal tuition assistance) from the Armed Forces or public health services for any part of your coursework or training?',
            'ui:widget': 'yesNo',
          },
          civilianBenefitsAssistance: {
            'ui:title':
              'Are you getting benefits from the U.S. Government as a civilian employee during the same time as you’re seeking benefits from VA?',
            'ui:widget': 'yesNo',
          },
        },
        schema: {
          type: 'object',
          required: ['educationType', 'newSchoolName'],
          properties: {
            newSchoolName: {
              type: 'string',
            },
            educationType,
            newSchoolAddress: address.schema(fullSchema1995),
            educationObjective,
            nonVaAssistance,
            civilianBenefitsAssistance,
          },
        },
      },
      oldSchool: createOldSchoolPage(fullSchema1995),
    },
  },
  personalInformation: {
    title: 'Personal Information',
    pages: {
      contactInformation: createContactInformationPage(fullSchema1995),
      dependents: {
        title: 'Dependents',
        path: 'personal-information/dependents',
        depends: form =>
          !display10203StemFlow(form) &&
          form['view:hasServiceBefore1978'] === true,
        uiSchema: {
          serviceBefore1977: serviceBefore1977UI,
        },
        schema: {
          type: 'object',
          properties: {
            serviceBefore1977,
          },
        },
      },
      directDeposit: createDirectDepositChangePage(fullSchema1995),
    },
  },
};
