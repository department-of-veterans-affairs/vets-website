import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';
import createApplicantInformationPage from '~/platform/forms/pages/applicantInformation';
import get from '~/platform/utilities/data/get';
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
  tourOfDuty,
  sponsorInfo,
  changeAnotherBenefitPage,
} from '../pages';

import { isProductionOfTestProdEnv, sponsorInformationTitle } from '../helpers';
import guardianInformation from '../pages/guardianInformation';
import { updateApplicantInformationPage } from '../../utils/helpers';
import {
  yourInformationPage,
  benefitSwitchPage,
  sameBenefitResultPage,
  foreignSchoolResultPage,
  mgibAdResultPage,
  mgibSrResultPage,
  toeResultPage,
  deaResultPage,
  fryResultPage,
} from '../pages/mebQuestionnaire';

const isRerouteEnabledOnForm = formData => formData?.isMeb1995Reroute === true;
const isLegacyFlow = formData => !isRerouteEnabledOnForm(formData);

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
  const applicantInformationPage = {
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
  return updateApplicantInformationPage(applicantInformationPage);
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
      depends: isLegacyFlow,
    },
    toursOfDutyIsActiveDutyTrue: {
      path: 'military/service-tour-of-duty-isActiveDuty-true',
      title: 'Service periods tour Of Duty',
      depends: form =>
        isLegacyFlow(form) &&
        get('view:newService', form) &&
        form.applicantServed === 'Yes' &&
        form.isActiveDuty,
      uiSchema: tourOfDuty.uiSchema,
      schema: tourOfDuty.schemaIsActiveDuty,
    },
    toursOfDutyIsActiveDutyFalse: {
      path: 'military/service-tour-of-duty-isActiveDuty-false',
      title: 'Service periods tour Of Duty',
      depends: form =>
        isLegacyFlow(form) &&
        get('view:newService', form) &&
        form.applicantServed === 'Yes' &&
        !form.isActiveDuty,
      uiSchema: tourOfDuty.uiSchema,
      schema: tourOfDuty.schema,
    },
  },
};

if (isProductionOfTestProdEnv()) {
  militaryService.pages.militaryHistory = {
    title: 'Military history',
    path: 'military/history',
    depends: isLegacyFlow,
    uiSchema: militaryHistory.uiSchema,
    schema: militaryHistory.schema,
  };
}
export const chapters = {
  applicantInformation: {
    title: 'Applicant information',
    pages: {
      applicantInformation: {
        ...applicantInformationField(),
        depends: isLegacyFlow,
      },
    },
  },
  guardianInformation: {
    title: 'Guardian information',
    pages: {
      guardianInformation: {
        ...guardianInformation(fullSchema1995, {}),
        depends: isLegacyFlow,
      },
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
        depends: isLegacyFlow,
      },
      changeAnotherBenefit: {
        title: 'Education benefit selection',
        path: 'benefits/education-benefit',
        uiSchema: changeAnotherBenefitPage.uiSchema,
        schema: changeAnotherBenefitPage.schema,
        depends: formData =>
          isLegacyFlow(formData) && formData?.rudisillReview === 'No',
      },
    },
  },
  sponsorInformation: {
    title: sponsorInformationTitle(),
    pages: {
      sponsorInformation: {
        ...sponsorInfo(fullSchema1995),
        depends: isLegacyFlow,
      },
    },
  },
  militaryService,
  schoolSelection: {
    title: isProductionOfTestProdEnv()
      ? 'School selection'
      : 'School/training facility selection',
    depends: isLegacyFlow,
    pages: {
      newSchool: {
        path: 'school-selection/new-school',
        title: newSchoolTitle(),
        initialData: {
          newSchoolAddress: {},
        },
        uiSchema: newSchoolUiSchema(),
        schema: newSchoolSchema(),
        depends: isLegacyFlow,
      },
    },
  },
  personalInformation: {
    title: 'Personal information',
    pages: {
      contactInformation: {
        ...createContactInformationPage(fullSchema1995),
        depends: isLegacyFlow,
      },
      dependents: {
        title: 'Dependents',
        path: 'personal-information/dependents',
        depends: form =>
          isLegacyFlow(form) &&
          isProductionOfTestProdEnv() &&
          form['view:hasServiceBefore1978'] === true,
        uiSchema: dependents.uiSchema,
        schema: dependents.schema,
      },
      directDeposit: {
        ...directDepositField(),
        depends: isLegacyFlow,
      },
    },
  },
};
if (isProductionOfTestProdEnv()) {
  chapters.schoolSelection.pages.oldSchool = {
    ...createOldSchoolPage(fullSchema1995),
    depends: isLegacyFlow,
  };
}

export const mebChapters = {
  questionnaire: {
    title: 'Determine your path',
    hideFormNavProgress: true,
    pages: {
      mebYourInformation: {
        path: 'questionnaire/your-information',
        title: 'Your information',
        depends: formData => isRerouteEnabledOnForm(formData),
        ...yourInformationPage(),
      },
      mebBenefitSelection: {
        path: 'questionnaire/benefit-selection',
        title: 'Benefit you want to change to',
        depends: formData =>
          isRerouteEnabledOnForm(formData) &&
          formData.mebWhatDoYouWantToDo === 'switch-benefit',
        ...benefitSwitchPage(),
      },
      sameBenefitResult: {
        path: 'results/same-benefit',
        title:
          "Dependent's Application for VA Education Benefits (VA Form 22-5490)",
        depends: formData =>
          isRerouteEnabledOnForm(formData) &&
          formData.mebWhatDoYouWantToDo === 'same-benefit',
        ...sameBenefitResultPage(),
      },
      foreignSchoolResult: {
        path: 'results/foreign-school',
        title: 'Ask VA',
        depends: formData =>
          isRerouteEnabledOnForm(formData) &&
          formData.mebWhatDoYouWantToDo === 'foreign-school',
        ...foreignSchoolResultPage(),
      },
      mgibAdResult: {
        path: 'results/mgib-ad',
        title: 'Application for VA Education Benefits (VA Form 22-1990)',
        depends: formData =>
          isRerouteEnabledOnForm(formData) &&
          formData.mebWhatDoYouWantToDo === 'switch-benefit' &&
          formData.mebBenefitSelection === 'mgib-ad',
        ...mgibAdResultPage(),
      },
      mgibSrResult: {
        path: 'results/mgib-sr',
        title: 'Application for VA Education Benefits (VA Form 22-1990)',
        depends: formData =>
          isRerouteEnabledOnForm(formData) &&
          formData.mebWhatDoYouWantToDo === 'switch-benefit' &&
          formData.mebBenefitSelection === 'mgib-sr',
        ...mgibSrResultPage(),
      },
      toeResult: {
        path: 'results/toe',
        title: 'Application for VA Education Benefits (VA Form 22-1990e)',
        depends: formData =>
          isRerouteEnabledOnForm(formData) &&
          formData.mebWhatDoYouWantToDo === 'switch-benefit' &&
          formData.mebBenefitSelection === 'toe',
        ...toeResultPage(),
      },
      deaResult: {
        path: 'results/dea',
        title: 'Application for VA Education Benefits (VA Form 22-5490)',
        depends: formData =>
          isRerouteEnabledOnForm(formData) &&
          formData.mebWhatDoYouWantToDo === 'switch-benefit' &&
          formData.mebBenefitSelection === 'dea',
        ...deaResultPage(),
      },
      fryResult: {
        path: 'results/fry',
        title: 'Application for VA Education Benefits (VA Form 22-5490)',
        depends: formData =>
          isRerouteEnabledOnForm(formData) &&
          formData.mebWhatDoYouWantToDo === 'switch-benefit' &&
          formData.mebBenefitSelection === 'fry',
        ...fryResultPage(),
      },
    },
  },
};

export const allChapters = {
  ...chapters,
  ...mebChapters,
};
