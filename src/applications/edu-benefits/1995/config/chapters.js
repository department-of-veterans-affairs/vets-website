import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';

import serviceBefore1977UI from '../../definitions/serviceBefore1977';

import createContactInformationPage from '../../pages/contactInformation';
import createOldSchoolPage from '../../pages/oldSchool';
import createDirectDepositChangePage from '../../pages/directDepositChange';

import {
  applicantInformation,
  benefitSelection,
  militaryHistory,
  newSchool,
  servicePeriods,
} from '../pages';

const { serviceBefore1977 } = fullSchema1995.definitions;

export const chapters = {
  applicantInformation: {
    title: 'Applicant Information',
    pages: {
      applicantInformation: applicantInformation.page,
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
    },
  },
  militaryService: {
    title: 'Military History',
    pages: {
      servicePeriods: {
        path: 'military/service',
        title: 'Service periods',
        uiSchema: servicePeriods.uiSchema,
        schema: servicePeriods.schema,
      },
      militaryHistory: {
        title: 'Military history',
        path: 'military/history',
        uiSchema: militaryHistory.uiSchema,
        schema: militaryHistory.schema,
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
        uiSchema: newSchool.uiSchema,
        schema: newSchool.schema,
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
        depends: form => form['view:hasServiceBefore1978'] === true,
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
