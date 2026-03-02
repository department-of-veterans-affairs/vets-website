import {
  yourInformationPage,
  benefitSwitchPage,
  sameBenefitSelectionPage,
  buildResultPage,
} from '../pages/mebQuestionnaire';

export const mebChapters = {
  questionnaire: {
    title: 'Determine your path',
    hideFormNavProgress: true,
    pages: {
      mebYourInformation: {
        path: 'questionnaire/your-information',
        title: 'Your information',
        hideSaveLinkAndStatus: true,
        ...yourInformationPage(),
      },
      mebBenefitSelection: {
        path: 'questionnaire/benefit-selection',
        title: 'Benefit you want to change to',
        depends: formData => formData.mebWhatDoYouWantToDo === 'switch-benefit',
        hideSaveLinkAndStatus: true,
        ...benefitSwitchPage(),
      },
      sameBenefitSelection: {
        path: 'questionnaire/same-benefit-selection',
        title: 'Which benefit have you most recently used?',
        depends: formData =>
          formData.mebWhatDoYouWantToDo === 'same-benefit' &&
          !formData.currentBenefitType,
        hideSaveLinkAndStatus: true,
        ...sameBenefitSelectionPage(),
      },
      sameBenefitResult: {
        path: 'results/same-benefit',
        title:
          "Dependents' Application for VA Education Benefits (VA Form 22-5490)",
        depends: formData =>
          formData.mebWhatDoYouWantToDo === 'same-benefit' &&
          (formData.currentBenefitType || formData.mebSameBenefitSelection),
        hideSaveLinkAndStatus: true,
        hideNavButtons: true,
        ...buildResultPage(),
      },
      foreignSchoolResult: {
        path: 'results/foreign-school',
        depends: formData => formData.mebWhatDoYouWantToDo === 'foreign-school',
        hideSaveLinkAndStatus: true,
        hideNavButtons: true,
        ...buildResultPage(),
      },
      mgibAdResult: {
        path: 'results/mgib-ad',
        title: 'Application for VA Education Benefits (VA Form 22-1990)',
        depends: formData =>
          formData.mebWhatDoYouWantToDo === 'switch-benefit' &&
          formData.mebBenefitSelection === 'mgib-ad',
        hideSaveLinkAndStatus: true,
        hideNavButtons: true,
        ...buildResultPage(),
      },
      mgibSrResult: {
        path: 'results/mgib-sr',
        title: 'Application for VA Education Benefits (VA Form 22-1990)',
        depends: formData =>
          formData.mebWhatDoYouWantToDo === 'switch-benefit' &&
          formData.mebBenefitSelection === 'mgib-sr',
        hideSaveLinkAndStatus: true,
        hideNavButtons: true,
        ...buildResultPage(),
      },
      toeResult: {
        path: 'results/toe',
        title: 'Application for VA Education Benefits (VA Form 22-1990e)',
        depends: formData =>
          formData.mebWhatDoYouWantToDo === 'switch-benefit' &&
          formData.mebBenefitSelection === 'toe',
        hideSaveLinkAndStatus: true,
        hideNavButtons: true,
        ...buildResultPage(),
      },
      deaResult: {
        path: 'results/dea',
        title: 'Application for VA Education Benefits (VA Form 22-5490)',
        depends: formData =>
          formData.mebWhatDoYouWantToDo === 'switch-benefit' &&
          formData.mebBenefitSelection === 'dea',
        hideSaveLinkAndStatus: true,
        hideNavButtons: true,
        ...buildResultPage(),
      },
      fryResult: {
        path: 'results/fry',
        title: 'Application for VA Education Benefits (VA Form 22-5490)',
        depends: formData =>
          formData.mebWhatDoYouWantToDo === 'switch-benefit' &&
          formData.mebBenefitSelection === 'fry',
        hideSaveLinkAndStatus: true,
        hideNavButtons: true,
        ...buildResultPage(),
      },
      pgibResult: {
        path: 'results/pgib',
        title: 'Application for VA Education Benefits (VA Form 22-1990)',
        depends: formData =>
          formData.mebWhatDoYouWantToDo === 'switch-benefit' &&
          formData.mebBenefitSelection === 'pgib',
        hideSaveLinkAndStatus: true,
        hideNavButtons: true,
        ...buildResultPage(),
      },
    },
  },
};
