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
  servicePeriodsUpdate,
  sponsorInfo,
} from '../pages';

import { isProductionOfTestProdEnv, sponsorInformationTitle } from '../helpers';
import guardianInformation from '../pages/guardianInformation';

export const applicantInformationField = (automatedTest = false) => {
  if (isProductionOfTestProdEnv(automatedTest)) {
    return {
      ...createApplicantInformationPage(fullSchema1995, {
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
        'minorHighSchoolQuestions',
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

export const servicePeriodsUiSchema = (automatedTest = false) => {
  return isProductionOfTestProdEnv(automatedTest)
    ? servicePeriods.uiSchema
    : servicePeriodsUpdate.uiSchema;
};

export const servicePeriodsSchema = (automatedTest = false) => {
  return isProductionOfTestProdEnv(automatedTest)
    ? servicePeriods.schema
    : servicePeriodsUpdate.schema;
};

export const newSchoolTitle = (automatedTest = false) => {
  return isProductionOfTestProdEnv(automatedTest)
    ? 'School, university, program, or training facility you want to attend'
    : 'School or training facility you want to attend';
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

export const serviceHistoryTitle = (automatedTest = false) => {
  if (isProductionOfTestProdEnv(automatedTest)) {
    return 'Service history';
  }
  return 'Applicant service history';
};
const militaryService = {
  title: serviceHistoryTitle(),
  pages: {
    servicePeriods: {
      path: 'military/service',
      title: 'Service periods',
      uiSchema: servicePeriodsUiSchema(),
      schema: servicePeriodsSchema(),
    },
  },
};

if (isProductionOfTestProdEnv()) {
  militaryService.pages.militaryHistory = {
    title: 'Military history',
    path: 'military/history',
    uiSchema: militaryHistory.uiSchema,
    schema: militaryHistory.schema,
  };
}
export const chapters = {
  applicantInformation: {
    title: 'Applicant information',
    pages: {
      applicantInformation: applicantInformationField(),
    },
  },
  guardianInformation: {
    title: 'Guardian information',
    pages: {
      guardianInformation: guardianInformation(fullSchema1995, {}),
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
  sponsorInformation: {
    title: sponsorInformationTitle(),
    pages: {
      sponsorInformation: sponsorInfo(fullSchema1995),
    },
  },
  militaryService,
  schoolSelection: {
    title: isProductionOfTestProdEnv()
      ? 'School selection'
      : 'School/training facility selection',
    pages: {
      newSchool: {
        path: 'school-selection/new-school',
        title: newSchoolTitle(),
        initialData: {
          newSchoolAddress: {},
        },
        uiSchema: newSchoolUiSchema(),
        schema: newSchoolSchema(),
      },
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
if (isProductionOfTestProdEnv()) {
  chapters.schoolSelection.pages.oldSchool = createOldSchoolPage(
    fullSchema1995,
  );
}
