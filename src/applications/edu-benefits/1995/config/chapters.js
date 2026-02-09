import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';
import createApplicantInformationPage from '~/platform/forms/pages/applicantInformation';
import get from '~/platform/utilities/data/get';
import createContactInformationPage from '../../pages/contactInformation';
import createDirectDepositChangePageUpdate from '../../pages/directDepositChangeUpdate';

import {
  applicantInformationUpdate,
  dependents,
  newSchoolUpdate,
  servicePeriodsUpdate,
  tourOfDuty,
  sponsorInfo,
  changeAnotherBenefitPage,
} from '../pages';
import * as benefitSelectionUpdate from '../pages/benefitSelectionUpdate';

import { sponsorInformationTitle } from '../helpers';
import guardianInformation from '../pages/guardianInformation';
import { updateApplicantInformationPage } from '../../utils/helpers';
import {
  yourInformationPage,
  benefitSwitchPage,
  sameBenefitSelectionPage,
  sameBenefitResultPage,
  foreignSchoolResultPage,
  mgibAdResultPage,
  mgibSrResultPage,
  toeResultPage,
  deaResultPage,
  fryResultPage,
  pgibResultPage,
} from '../pages/mebQuestionnaire';

/**
 * Checks if form is in reroute (questionnaire) mode
 * @param {Object} formData - The form data object
 * @returns {boolean} True if reroute mode is enabled
 */
const isRerouteEnabledOnForm = formData => formData?.isMeb1995Reroute === true;

/**
 * Checks if user is in Rudisill review flow
 * Checks both formData and sessionStorage for the flag
 * @param {Object} formData - The form data object
 * @returns {boolean} True if Rudisill flow is active
 */
const isRudisillFlow = formData =>
  formData?.isRudisillFlow === true ||
  sessionStorage.getItem('isRudisillFlow') === 'true';

/**
 * Determines if legacy form pages should be shown
 * Legacy flow is active when reroute is disabled OR user is in Rudisill flow
 * @param {Object} formData - The form data object
 * @returns {boolean} True if legacy pages should be displayed
 */
const isLegacyFlow = formData =>
  !isRerouteEnabledOnForm(formData) || isRudisillFlow(formData);

export const applicantInformationField = () => {
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

export const directDepositField = () => {
  return createDirectDepositChangePageUpdate(fullSchema1995);
};

const militaryService = {
  title: 'Applicant service history',
  pages: {
    servicePeriods: {
      path: 'military/service',
      title: 'Service periods',
      uiSchema: servicePeriodsUpdate.uiSchema,
      schema: servicePeriodsUpdate.schema,
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
    depends: formData => {
      const page = guardianInformation(fullSchema1995, {});
      return isLegacyFlow(formData) && page.depends(formData);
    },
    pages: {
      guardianInformation: (() => {
        const page = guardianInformation(fullSchema1995, {});
        const originalDepends = page.depends;
        return {
          ...page,
          depends: formData =>
            isLegacyFlow(formData) && originalDepends(formData),
        };
      })(),
    },
  },
  benefitSelection: {
    title: 'Education benefit',
    pages: {
      benefitSelection: {
        title: 'Education benefit selection',
        path: 'benefits/eligibility',
        uiSchema: benefitSelectionUpdate.uiSchema,
        schema: benefitSelectionUpdate.schema,
        depends: isLegacyFlow,
        updateFormData: (oldFormData, newFormData) => {
          // Clear sponsor and benefit fields when rudisillReview changes to Yes
          if (newFormData.rudisillReview === 'Yes') {
            return {
              ...newFormData,
              changeAnotherBenefit: undefined,
              benefitAppliedFor: undefined,
              sponsorFullName: undefined,
              sponsorSocialSecurityNumber: undefined,
              vaFileNumber: undefined,
              'view:noSSN': undefined,
            };
          }
          return newFormData;
        },
      },
      changeAnotherBenefit: {
        title: 'Change to another benefit',
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
    depends: formData => {
      const page = sponsorInfo(fullSchema1995);
      return isLegacyFlow(formData) && page.depends(formData);
    },
    pages: {
      sponsorInformation: (() => {
        const page = sponsorInfo(fullSchema1995);
        const originalDepends = page.depends;
        return {
          ...page,
          depends: formData =>
            isLegacyFlow(formData) && originalDepends(formData),
        };
      })(),
    },
  },
  militaryService,
  schoolSelection: {
    title: 'School/training facility selection',
    pages: {
      newSchool: {
        path: 'school-selection/new-school',
        title: 'School or training facility you want to attend',
        initialData: {
          newSchoolAddress: {},
        },
        uiSchema: newSchoolUpdate.uiSchema,
        schema: newSchoolUpdate.schema,
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
          isLegacyFlow(form) && form['view:hasServiceBefore1978'] === true,
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

export const mebChapters = {
  questionnaire: {
    title: 'Determine your path',
    depends: formData => isRerouteEnabledOnForm(formData),
    pages: {
      mebYourInformation: {
        path: 'questionnaire/your-information',
        title: 'Your information',
        depends: formData => isRerouteEnabledOnForm(formData),
        hideSaveLinkAndStatus: true,
        ...yourInformationPage(),
      },
      mebBenefitSelection: {
        path: 'questionnaire/benefit-selection',
        depends: formData =>
          isRerouteEnabledOnForm(formData) &&
          formData.mebWhatDoYouWantToDo === 'switch-benefit',
        hideSaveLinkAndStatus: true,
        ...benefitSwitchPage(),
      },
      sameBenefitSelection: {
        path: 'questionnaire/same-benefit-selection',
        title: 'Which benefit have you most recently used?',
        depends: formData =>
          isRerouteEnabledOnForm(formData) &&
          formData.mebWhatDoYouWantToDo === 'same-benefit' &&
          !formData.currentBenefitType,
        hideSaveLinkAndStatus: true,
        ...sameBenefitSelectionPage(),
      },
      sameBenefitResult: {
        path: 'results/same-benefit',
        title:
          "Dependent's Application for VA Education Benefits (VA Form 22-5490)",
        depends: formData =>
          isRerouteEnabledOnForm(formData) &&
          formData.mebWhatDoYouWantToDo === 'same-benefit' &&
          (formData.currentBenefitType || formData.mebSameBenefitSelection),
        hideSaveLinkAndStatus: true,
        hideNavButtons: true,
        ...sameBenefitResultPage(),
      },
      foreignSchoolResult: {
        path: 'results/foreign-school',
        depends: formData =>
          isRerouteEnabledOnForm(formData) &&
          formData.mebWhatDoYouWantToDo === 'foreign-school',
        hideSaveLinkAndStatus: true,
        hideNavButtons: true,
        ...foreignSchoolResultPage(),
      },
      mgibAdResult: {
        path: 'results/mgib-ad',
        title: 'Application for VA Education Benefits (VA Form 22-1990)',
        depends: formData =>
          isRerouteEnabledOnForm(formData) &&
          formData.mebWhatDoYouWantToDo === 'switch-benefit' &&
          formData.mebBenefitSelection === 'mgib-ad',
        hideSaveLinkAndStatus: true,
        hideNavButtons: true,
        ...mgibAdResultPage(),
      },
      mgibSrResult: {
        path: 'results/mgib-sr',
        title: 'Application for VA Education Benefits (VA Form 22-1990)',
        depends: formData =>
          isRerouteEnabledOnForm(formData) &&
          formData.mebWhatDoYouWantToDo === 'switch-benefit' &&
          formData.mebBenefitSelection === 'mgib-sr',
        hideSaveLinkAndStatus: true,
        hideNavButtons: true,
        ...mgibSrResultPage(),
      },
      toeResult: {
        path: 'results/toe',
        title: 'Application for VA Education Benefits (VA Form 22-1990e)',
        depends: formData =>
          isRerouteEnabledOnForm(formData) &&
          formData.mebWhatDoYouWantToDo === 'switch-benefit' &&
          formData.mebBenefitSelection === 'toe',
        hideSaveLinkAndStatus: true,
        hideNavButtons: true,
        ...toeResultPage(),
      },
      deaResult: {
        path: 'results/dea',
        title: 'Application for VA Education Benefits (VA Form 22-5490)',
        depends: formData =>
          isRerouteEnabledOnForm(formData) &&
          formData.mebWhatDoYouWantToDo === 'switch-benefit' &&
          formData.mebBenefitSelection === 'dea',
        hideSaveLinkAndStatus: true,
        hideNavButtons: true,
        ...deaResultPage(),
      },
      fryResult: {
        path: 'results/fry',
        title: 'Application for VA Education Benefits (VA Form 22-5490)',
        depends: formData =>
          isRerouteEnabledOnForm(formData) &&
          formData.mebWhatDoYouWantToDo === 'switch-benefit' &&
          formData.mebBenefitSelection === 'fry',
        hideSaveLinkAndStatus: true,
        hideNavButtons: true,
        ...fryResultPage(),
      },
      pgibResult: {
        path: 'results/pgib',
        title: 'Application for VA Education Benefits (VA Form 22-1990)',
        depends: formData =>
          isRerouteEnabledOnForm(formData) &&
          formData.mebWhatDoYouWantToDo === 'switch-benefit' &&
          formData.mebBenefitSelection === 'pgib',
        hideSaveLinkAndStatus: true,
        hideNavButtons: true,
        ...pgibResultPage(),
      },
    },
  },
};

export const allChapters = {
  ...chapters,
  ...mebChapters,
};
