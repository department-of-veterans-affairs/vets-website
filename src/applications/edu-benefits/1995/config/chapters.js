import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';
import createApplicantInformationPage from 'platform/forms/pages/applicantInformation';
import createContactInformationPage from '../../pages/contactInformation';
import createOldSchoolPage from '../../pages/oldSchool';
import createDirectDepositChangePage from '../../pages/directDepositChange';
import createDirectDepositChangePageUpdate from '../../pages/directDepositChangeUpdate';

import {
  applicantInformationUpdate,
  benefitSelection,
  benefitSelectionUpdate,
  dependents,
  militaryHistory,
  newSchool,
  newSchoolUpdate,
  servicePeriods,
} from '../pages';

import { isProductionOfTestProdEnv } from '../helpers';

export const applicantInformationField = (automatedTest = false) => {
  if (isProductionOfTestProdEnv(automatedTest)) {
    return {
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
    };
  }
  return {
    ...createApplicantInformationPage(fullSchema1995, {
      isVeteran: true,
      fields: [
        'veteranFullName',
        'veteranSocialSecurityNumber',
        'view:noSSN',
        'vaFileNumber',
        'dateOfBirth',
        'applicantGender',
      ],
      required: [
        'veteranFullName',
        'veteranSocialSecurityNumber',
        'dateOfBirth',
      ],
    }),
    uiSchema: applicantInformationUpdate.uiSchema,
  };
};

export const benefitSelectionUiSchema = (automatedTest = false) => {
  return isProductionOfTestProdEnv(automatedTest)
    ? benefitSelection.uiSchema
    : benefitSelectionUpdate.uiSchema;
};

export const benefitSelectionSchema = (automatedTest = false) => {
  return isProductionOfTestProdEnv(automatedTest)
    ? benefitSelection.schema
    : benefitSelectionUpdate.schema;
};

export const newSchoolUiSchema = (automatedTest = false) => {
  return isProductionOfTestProdEnv(automatedTest)
    ? newSchool.uiSchema
    : newSchoolUpdate.uiSchema;
};

export const newSchoolSchema = (automatedTest = false) => {
  return isProductionOfTestProdEnv(automatedTest)
    ? newSchool.schema
    : newSchoolUpdate.schema;
};

export const directDepositField = (automatedTest = false) => {
  return isProductionOfTestProdEnv(automatedTest)
    ? createDirectDepositChangePage(fullSchema1995)
    : createDirectDepositChangePageUpdate(fullSchema1995);
};

export const chapters = {
  applicantInformation: {
    title: 'Applicant information',
    pages: {
      applicantInformation: applicantInformationField(),
    },
  },
  benefitSelection: {
    title: 'Education benefit',
    pages: {
      benefitSelection: {
        title: 'Education benefit selection',
        path: 'benefits/eligibility',
        uiSchema: benefitSelectionUiSchema(),
        schema: benefitSelectionSchema(),
      },
    },
  },
  militaryService: {
    title: 'Service history',
    pages: {
      servicePeriods: {
        path: 'military/service',
        title: 'Service periods',
        uiSchema: servicePeriods.uiSchema,
        schema: servicePeriods.schema,
      },
      militaryHistory: {
        title: 'Military history',
        depends: () => isProductionOfTestProdEnv(),
        path: 'military/history',
        uiSchema: militaryHistory.uiSchema,
        schema: militaryHistory.schema,
      },
    },
  },
  schoolSelection: {
    title: 'School selection',
    pages: {
      newSchool: {
        path: 'school-selection/new-school',
        title:
          'School, university, program, or training facility you want to attend',
        initialData: {
          newSchoolAddress: {},
        },
        uiSchema: newSchoolUiSchema(),
        schema: newSchoolSchema(),
      },
      oldSchool: createOldSchoolPage(fullSchema1995),
    },
  },
  personalInformation: {
    title: 'Personal information',
    pages: {
      contactInformation: createContactInformationPage(fullSchema1995),
      dependents: {
        title: 'Dependents',
        path: 'personal-information/dependents',
        depends: form => {
          return (
            isProductionOfTestProdEnv() &&
            form['view:hasServiceBefore1978'] === true
          );
        },
        uiSchema: dependents.uiSchema,
        schema: dependents.schema,
      },
      directDeposit: directDepositField(),
    },
  },
};
