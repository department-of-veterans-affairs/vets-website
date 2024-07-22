// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import footerContent from 'platform/forms/components/FormFooter';
import getHelp from '../../simple-forms/shared/components/GetFormHelp';
import PreSubmitInfo from '../containers/PreSubmitInfo';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// pages
import goals from '../pages/goals';
import disabilityRating from '../pages/disabilityRating';
import militaryService from '../pages/militaryService';
import separation from '../pages/separation';
import giBillStatus from '../pages/giBillStatus';
import characterOfDischarge from '../pages/characterOfDischarge';

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

const isOnReviewPage = currentLocation => {
  return currentLocation?.pathname.includes('/review-and-submit');
};

const isOnConfirmationPage = currentLocation => {
  return currentLocation?.pathname.includes('/confirmation');
};

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'benefit-eligibility-questionnaire-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  stepLabels: 'Goals;Service;Separation;Discharge;Disability;GI Bill',
  formId: 'T-QSTNR',
  customText: {
    submitButtonText: 'Submit',
  },
  preSubmitInfo: {
    CustomComponent: PreSubmitInfo,
    required: true,
    field: 'privacyAgreementAccepted',
  },
  saveInProgress: {
    messages: {
      inProgress: 'Your benefits questionnaire is in progress.',
      expired:
        'Your saved benefits questionnaire has expired. If you want to continue, please start a new questionnaire.',
      saved: 'Your benefits questionnaire has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  title: ({ currentLocation }) => {
    if (isOnConfirmationPage(currentLocation)) {
      return 'Your benefits and resources';
    }
    if (isOnReviewPage(currentLocation)) {
      return 'Review your entries';
    }
    return 'Complete the benefit eligibility questionnaire';
  },
  subTitle: ({ currentLocation }) => {
    if (
      isOnReviewPage(currentLocation) ||
      isOnConfirmationPage(currentLocation)
    )
      return '';
    return 'Please answer the questions to help us recommend helpful resources and benefits.';
  },
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    chapter1: {
      title: 'Goals',
      pages: {
        goals: {
          path: 'goals',
          title: 'Goals',
          uiSchema: goals.uiSchema,
          schema: goals.schema,
        },
      },
    },
    chapter2: {
      title: 'Service',
      pages: {
        militaryService: {
          path: 'military-service',
          title: 'Military Service',
          uiSchema: militaryService.uiSchema,
          schema: militaryService.schema,
        },
      },
    },
    chapter3: {
      title: 'Separation',
      pages: {
        separation: {
          path: 'separation',
          title: 'Separation',
          uiSchema: separation.uiSchema,
          schema: separation.schema,
        },
      },
    },
    chapter4: {
      title: 'Character of Discharge',
      pages: {
        characterOfDischarge: {
          path: 'character-of-discharge',
          title: 'Character of Discharge',
          uiSchema: characterOfDischarge.uiSchema,
          schema: characterOfDischarge.schema,
        },
      },
    },
    chapter5: {
      title: 'Disability',
      pages: {
        disabilityRating: {
          path: 'disability-rating',
          title: 'Disability Rating',
          uiSchema: disabilityRating.uiSchema,
          schema: disabilityRating.schema,
        },
      },
    },
    chapter5: {
      title: 'GI Bill Status',
      pages: {
        giBillStatus: {
          path: 'gi-bill-status',
          title: 'gi-bill-status',
          uiSchema: giBillStatus.uiSchema,
          schema: giBillStatus.schema,
        },
    },
  },
  },
  footerContent,
  getHelp,
};

export default formConfig;
