import fullSchema from 'vets-json-schema/dist/686C-674-V2-schema.json';
import environment from 'platform/utilities/environment';
import FormFooter from 'platform/forms/components/FormFooter';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TASK_KEYS } from './constants';
import { isChapterFieldRequired } from './helpers';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetFormHelp from '../components/GetFormHelp';
import ReviewDependents from '../components/ReviewDependents';
import { submit } from './submit';

import manifest from '../manifest.json';
import prefillTransformer from './prefill-transformer';

// Chapter imports
import {
  veteranInformation,
  veteranAddress,
  veteranContactInformation,
  checkVeteranPension,
} from './chapters/veteran-information';
import {
  addDependentOptions,
  removeDependentOptions,
  addOrRemoveDependents,
} from './chapters/taskWizard';
import { householdIncome } from './chapters/household-income';

import { spouseAdditionalEvidence } from './chapters/additional-information/spouseAdditionalEvidence';
import { childAdditionalEvidence as finalChildAdditionalEvidence } from './chapters/additional-information/childAdditionalEvidence';

import {
  removeDependentsPicklistOptions,
  removeDependentsPicklistFollowupPages,
} from './chapters/formConfigRemovePicklist';
import addChild from './chapters/report-add-child';
import report674 from './chapters/formConfig674';
import { addSpouse } from './chapters/formConfigAdd';
import {
  reportDivorce,
  reportStepchildNotInHousehold,
  deceasedDependents,
  reportChildMarriage,
  reportChildStoppedAttendingSchool,
} from './chapters/formConfigRemoveV2';

import {
  spouseEvidence,
  childEvidence,
  showPensionRelatedQuestions,
  showPensionBackupPath,
  showV3Picklist,
  noV3Picklist,
  showOptionsSelection,
  isAddingDependents,
  isRemovingDependents,
} from './utilities';
import migrations from './migrations';
import reviewDependents from './chapters/picklist/reviewDependents';

export const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/dependents_applications`,
  submit,
  trackingPrefix: 'disability-21-686c-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  preSubmitInfo: {
    statementOfTruth: {
      body: 'I confirm that the identifying information in this form is accurate has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate has been represented correctly.',
      useProfileFullName: true,
    },
  },
  formId: VA_FORM_IDS.FORM_21_686CV2,
  formOptions: {
    focusOnAlertRole: true,
    useWebComponentForNavigation: true,
  },
  saveInProgress: {
    messages: {
      inProgress: 'Your application is in progress',
      expired:
        'Your saved application has expired. If you want to apply for dependent status, start a new application.',
      saved: 'Your application has been saved',
    },
  },
  savedFormMessages: {
    notFound:
      'Start your application to add or remove a dependent on your VA benefits.',
    noAuth:
      'Sign in again to continue your application to add or remove a dependent on your VA benefits.',
  },
  version: migrations.length,
  v3SegmentedProgressBar: true,
  migrations,
  prefillEnabled: true,
  prefillTransformer,
  verifyRequiredPrefill: true,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  downtime: {
    requiredForPrefill: true,
    dependencies: [
      externalServices.bgs,
      externalServices.global,
      externalServices.mvi,
      externalServices.vaProfile,
      externalServices.vbms,
    ],
  },
  title: 'Add or remove a dependent on VA benefits',
  subTitle: 'VA Forms 21-686c and 21-674',
  defaultDefinitions: { ...fullSchema.definitions },
  chapters: {
    veteranInformation: {
      title: 'Veteran’s information',
      pages: {
        veteranInformation: {
          path: 'veteran-information',
          title: 'Veteran information',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
          initialData: {
            // Set in prefill, but included here because we're seeing v2
            // submissions without it
            useV2: true,
          },
        },
        veteranAddress: {
          path: 'veteran-address',
          title: 'Veteran address',
          uiSchema: veteranAddress.uiSchema,
          schema: veteranAddress.schema,
        },
        veteranContactInformation: {
          path: 'veteran-contact-information',
          title: 'Veteran contact information',
          uiSchema: veteranContactInformation.uiSchema,
          schema: veteranContactInformation.schema,
        },
      },
    },

    optionSelection: {
      title: ({ formData }) =>
        showV3Picklist(formData)
          ? 'Manage dependents'
          : 'Add or remove dependents',
      pages: {
        reviewDependents: {
          title: 'Review your VA Dependents',
          path: 'review-dependents',
          CustomPage: ReviewDependents,
          CustomPageReview: null,
          uiSchema: reviewDependents.uiSchema,
          schema: reviewDependents.schema,
        },
        addOrRemoveDependents: {
          title: 'What would you like to do?',
          path: 'options-selection',
          depends: showOptionsSelection,
          uiSchema: addOrRemoveDependents.uiSchema,
          schema: addOrRemoveDependents.schema,
        },
        addDependentOptions: {
          title: 'Add a dependent',
          path: 'options-selection/add-dependents',
          uiSchema: addDependentOptions.uiSchema,
          schema: addDependentOptions.schema,
          depends: isAddingDependents,
        },

        removeDependentOptions: {
          title: 'Remove a dependent',
          path: 'options-selection/remove-dependents',
          uiSchema: removeDependentOptions.uiSchema,
          schema: removeDependentOptions.schema,
          depends: formData =>
            noV3Picklist(formData) && isRemovingDependents(formData),
        },

        checkVeteranPension: {
          title: 'Check Veteran Pension',
          path: 'check-veteran-pension',
          uiSchema: checkVeteranPension.uiSchema,
          schema: checkVeteranPension.schema,
          depends: formData => showPensionBackupPath(formData),
        },

        removeDependentsPicklistOptions,
      },
    },

    removeDependentsPicklistFollowupPages,

    addSpouse,
    addChild,
    report674,
    reportDivorce,
    reportStepchildNotInHousehold,
    deceasedDependents,
    reportChildMarriage,
    reportChildStoppedAttendingSchool,

    householdIncome: {
      title: 'Your net worth',
      pages: {
        householdIncome: {
          depends: formData => showPensionRelatedQuestions(formData),
          path: 'net-worth',
          title: 'Information about your net worth',
          uiSchema: householdIncome.uiSchema,
          schema: householdIncome.schema,
        },
      },
    },

    additionalEvidence: {
      title: 'Additional information',
      pages: {
        marriageAdditionalEvidence: {
          depends: formData => {
            const { needsSpouseUpload } = spouseEvidence(formData);
            return (
              isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
              isAddingDependents(formData) &&
              needsSpouseUpload
            );
          },
          title: 'Submit supporting evidence to add your spouse',
          path: 'add-spouse-evidence',
          uiSchema: spouseAdditionalEvidence.uiSchema,
          schema: spouseAdditionalEvidence.schema,
        },

        childAdditionalEvidence: {
          depends: formData => {
            const { needsChildUpload } = childEvidence(formData);
            return (
              (isChapterFieldRequired(formData, TASK_KEYS.addChild) ||
                isChapterFieldRequired(formData, TASK_KEYS.addDisabledChild)) &&
              isAddingDependents(formData) &&
              needsChildUpload
            );
          },
          title: 'Upload your supporting evidence to add your child',
          path: 'add-child-evidence',
          uiSchema: finalChildAdditionalEvidence.uiSchema,
          schema: finalChildAdditionalEvidence.schema,
        },
      },
    },
  },
};

export default formConfig;
