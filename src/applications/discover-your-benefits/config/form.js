// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import footerContent from 'platform/forms/components/FormFooter';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import getHelp from '../components/GetFormHelp';
import PreSubmitInfo from '../containers/PreSubmitInfo';
import { submitHandler } from '../utils/helpers';
import {
  militaryBranchComponentTypes,
  militaryBranchTypes,
} from '../constants/benefits';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import ConfirmationPageCopy from '../containers/ConfirmationPageCopy';

// pages
import goals from '../pages/goals';
import disabilityRating from '../pages/disabilityRating';
import militaryService from '../pages/militaryService';
import activeDuty from '../pages/activeDuty';
import militaryBranch, {
  getBranchComponentPages,
} from '../pages/militaryBranch';
import militaryServiceTimeServed from '../pages/militaryServiceTimeServed';
import titleTenServiceTime from '../pages/titleTenTimeServed';
import militaryServiceCompleted from '../pages/militaryServiceCompleted';
import separation from '../pages/separation';
import characterOfDischarge from '../pages/characterOfDischarge';

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

export const isOnReviewPage = currentLocation => {
  return currentLocation?.pathname.includes('/review-and-submit');
};

export const isOnConfirmationPage = currentLocation => {
  return currentLocation?.pathname.includes('/confirmation');
};

export const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submit: submitHandler,
  trackingPrefix: 'discover-your-benefits-',
  introduction: IntroductionPage,
  // Need to insert a feature flag here
  confirmation: !environment.isProduction()
    ? ConfirmationPage
    : ConfirmationPageCopy,
  v3SegmentedProgressBar: true,
  stepLabels: 'Goals;Service;Separation;Discharge;Disability;Review',
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
  title: 'Discover your benefits',
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
        militaryServiceTimeServed: {
          path: 'service/time-served',
          title: 'Length of service',
          uiSchema: militaryServiceTimeServed.uiSchema,
          schema: militaryServiceTimeServed.schema,
        },
        militaryBranch: {
          path: 'service/branch-served',
          title: 'Branch',
          uiSchema: militaryBranch.uiSchema,
          schema: militaryBranch.schema,
        },
        ...getBranchComponentPages(),
        titleTenActiveDuty: {
          path: 'service/active-duty',
          title: 'Title 10 service',
          uiSchema: activeDuty.uiSchema,
          schema: activeDuty.schema,
          depends: formData => {
            return Object.values(militaryBranchTypes).some(pageName => {
              return (
                formData[pageName]?.[
                  militaryBranchComponentTypes.NATIONAL_GUARD_SERVICE
                ] ||
                formData[pageName]?.[
                  militaryBranchComponentTypes.RESERVE_SERVICE
                ]
              );
            });
          },
        },
        titleTenTimeServed: {
          path: 'service/title-ten',
          title: 'Length of Title 10 service',
          uiSchema: titleTenServiceTime.uiSchema,
          schema: titleTenServiceTime.schema,
          depends: formData => {
            return formData.titleTenActiveDuty === true;
          },
        },
        militaryService: {
          path: 'service/current',
          title: 'Military service',
          uiSchema: militaryService.uiSchema,
          schema: militaryService.schema,
          onNavForward: ({ formData, goPath }) => {
            if (formData.militaryServiceCurrentlyServing === true) {
              goPath(
                formConfig.chapters.chapter4.pages.characterOfDischarge.path,
              );
            } else {
              goPath(formConfig.chapters.chapter3.pages.separation.path);
            }
          },
        },
        militaryServiceCompleted: {
          path: 'service/completed',
          title: 'Military Service Completed',
          uiSchema: militaryServiceCompleted.uiSchema,
          schema: militaryServiceCompleted.schema,
          // Hide this question incase we need it later. The previous question skips this, but the 'depends' statement makes it show up on the review page even if
          // the question doesn't show up in the questionnaire.
          depends: formData => {
            return (
              environment.isTest() &&
              formData.militaryServiceCurrentlyServing === true
            );
          },
          onNavForward: ({ formData, goPath }) => {
            if (formData.militaryServiceCurrentlyServing === true) {
              goPath(
                formConfig.chapters.chapter4.pages.characterOfDischarge.path,
              );
            } else {
              goPath(formConfig.chapters.chapter3.pages.separation.path);
            }
          },
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
          path: 'discharge',
          title: 'Character of discharge',
          uiSchema: characterOfDischarge.uiSchema,
          schema: characterOfDischarge.schema,
          onNavBack: ({ formData, goPath }) => {
            if (formData.militaryServiceCurrentlyServing === true) {
              goPath(formConfig.chapters.chapter2.pages.militaryService.path);
            } else {
              goPath(formConfig.chapters.chapter3.pages.separation.path);
            }
          },
        },
      },
    },
    chapter5: {
      title: 'Disability',
      pages: {
        disabilityRating: {
          path: 'disability',
          title: 'Disability',
          uiSchema: disabilityRating.uiSchema,
          schema: disabilityRating.schema,
        },
      },
    },
  },
  footerContent,
  getHelp,
};

export default formConfig;
