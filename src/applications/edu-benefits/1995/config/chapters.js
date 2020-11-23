import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';
import createContactInformationPage from '../../pages/contactInformation';
import createOldSchoolPage from '../../pages/oldSchool';
import createDirectDepositChangePage from '../../pages/directDepositChange';
import createApplicantInformationPage from 'platform/forms/pages/applicantInformation';
import environment from 'platform/utilities/environment';

import {
  benefitSelection,
  dependents,
  militaryHistory,
  newSchool,
  servicePeriods,
} from '../pages';

export const chapters = {
  applicantInformation: {
    // Prod flag for #15720
    title: environment.isProduction()
      ? 'Applicant Information'
      : 'Applicant information',
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
    // Prod flag for #15720
    title: environment.isProduction()
      ? 'Education Benefit'
      : 'Education benefit',
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
    // Prod flag for #15720
    title: environment.isProduction() ? 'Military History' : 'Military history',
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
    // Prod flag for #15720
    title: environment.isProduction() ? 'School Selection' : 'School selection',
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
    // Prod flag for #15720
    title: environment.isProduction()
      ? 'Personal Information'
      : 'Personal information',
    pages: {
      contactInformation: createContactInformationPage(fullSchema1995),
      dependents: {
        title: 'Dependents',
        path: 'personal-information/dependents',
        depends: form => form['view:hasServiceBefore1978'] === true,
        uiSchema: dependents.uiSchema,
        schema: dependents.schema,
      },
      directDeposit: createDirectDepositChangePage(fullSchema1995),
    },
  },
};
