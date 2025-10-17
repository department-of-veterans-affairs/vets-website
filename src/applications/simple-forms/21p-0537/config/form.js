import React from 'react';
import footerContent from 'platform/forms/components/FormFooter';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import environment from 'platform/utilities/environment';

import { PersonalInformation } from 'platform/forms-system/src/js/components/PersonalInformation/PersonalInformation';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import getHelp from '../../shared/components/GetFormHelp';
import transformForSubmit from './submit-transformer';
import prefillTransformer from './prefill-transformer';
import { pageFocusScroll } from '../helpers';

// Import page configurations
import recipientIdentifier from '../pages/recipientIdentifier';
import recipientName from '../pages/recipientName';
import remarriageQuestion from '../pages/remarriageQuestion';
import marriageInfo from '../pages/marriageInfo';
import spouseVeteranStatus from '../pages/spouseVeteranStatus';
import spouseVeteranId from '../pages/spouseVeteranId';
import terminationStatus from '../pages/terminationStatus';
import terminationDetails from '../pages/terminationDetails';
import phoneAndEmail from '../pages/phoneAndEmail';

// Statement of truth body for the review page
const statementOfTruthBody = (
  <>
    <p>
      I certify that the information provided is true and correct to the best of
      my knowledge.
    </p>
    <p>
      I understand that VA may propose to terminate my DIC benefits if I have
      remarried and am not eligible to continue receiving benefits.
    </p>
  </>
);

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/simple_forms_api/v1/simple_forms`,
  transformForSubmit,
  trackingPrefix: '21p-0537-dic-marital-status-',
  useCustomScrollAndFocus: true,
  v3SegmentedProgressBar: true,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21P-0537',
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
  savedFormMessages: {
    notFound: 'Please start over to complete the marital status questionnaire.',
    noAuth: 'Please sign in again to continue your application.',
  },
  saveInProgress: {
    messages: {
      inProgress:
        'Your marital status questionnaire (21P-0537) is in progress.',
      expired:
        'Your saved marital status questionnaire (21P-0537) has expired. Please start a new form.',
      saved: 'Your marital status questionnaire has been saved.',
    },
  },
  preSubmitInfo: {
    statementOfTruth: {
      body: statementOfTruthBody,
      messageAriaDescribedby:
        'I certify that the information provided is true and correct to the best of my knowledge.',
      fullNamePath: 'recipientName',
      useProfileFullName: true,
    },
  },
  title: 'Verify your marital status for DIC benefits',
  subTitle: 'Marital Status Questionnaire (VA Form 21P-0537)',
  customText: {
    appType: 'form',
  },
  defaultDefinitions: {},
  footerContent,
  chapters: {
    contactInfoChapter: {
      title: 'Your contact information',
      pages: {
        personalInformation: {
          path: 'contact/name',
          title: 'Your name',
          CustomPage: props => <PersonalInformation {...props} />,
          CustomPageReview: null,
          hideOnReview: true,
          scrollAndFocusTarget: pageFocusScroll(),
          schema: {
            type: 'object',
            properties: {}, // Must be present even if empty
          },
          uiSchema: {},
        },
        phoneAndEmail: {
          path: 'contact/phone-email',
          title: 'Your phone number and email address',
          uiSchema: phoneAndEmail.uiSchema,
          schema: phoneAndEmail.schema,
          scrollAndFocusTarget: pageFocusScroll(),
        },
      },
    },
    veteranInfoChapter: {
      title: 'Deceased Veteran information',
      pages: {
        veteranName: {
          path: 'veteran-info/name',
          title: "Deceased Veteran's name",
          uiSchema: recipientName.uiSchema,
          schema: recipientName.schema,
          scrollAndFocusTarget: pageFocusScroll(),
        },
        veteranIdentifier: {
          path: 'veteran-info/identifier',
          title: "Deceased Veteran's identification information",
          uiSchema: recipientIdentifier.uiSchema,
          schema: recipientIdentifier.schema,
          scrollAndFocusTarget: pageFocusScroll(),
        },
      },
    },
    eligibilityScreeningChapter: {
      title: 'Marital status',
      pages: {
        remarriageQuestion: {
          path: 'screening/remarriage-status',
          title: 'Have you remarried?',
          uiSchema: remarriageQuestion.uiSchema,
          schema: remarriageQuestion.schema,
          scrollAndFocusTarget: pageFocusScroll(),
        },
      },
    },
    maritalDetailsChapter: {
      title: 'Remarriage information',
      pages: {
        marriageInfo: {
          path: 'marital/marriage-info',
          title: 'Details about your remarriage',
          depends: formData => formData.hasRemarried === true,
          uiSchema: marriageInfo.uiSchema,
          schema: marriageInfo.schema,
          scrollAndFocusTarget: pageFocusScroll(),
        },
        spouseVeteranStatus: {
          path: 'marital/spouse-veteran',
          title: 'Is your spouse a Veteran?',
          depends: formData => formData.hasRemarried === true,
          uiSchema: spouseVeteranStatus.uiSchema,
          schema: spouseVeteranStatus.schema,
          scrollAndFocusTarget: pageFocusScroll(),
        },
        spouseVeteranId: {
          path: 'marital/spouse-veteran-id',
          title: "Spouse's identification information",
          depends: formData =>
            formData.hasRemarried === true &&
            formData.remarriage?.spouseIsVeteran === true,
          uiSchema: spouseVeteranId.uiSchema,
          schema: spouseVeteranId.schema,
          scrollAndFocusTarget: pageFocusScroll(),
        },
        terminationStatus: {
          path: 'marital/termination-status',
          title: 'Has your remarriage ended?',
          depends: formData => formData.hasRemarried === true,
          uiSchema: terminationStatus.uiSchema,
          schema: terminationStatus.schema,
          scrollAndFocusTarget: pageFocusScroll(),
        },
        terminationDetails: {
          path: 'marital/termination-details',
          title: 'Details on end of remarriage',
          depends: formData =>
            formData.hasRemarried === true &&
            formData.remarriage?.hasTerminated === true,
          uiSchema: terminationDetails.uiSchema,
          schema: terminationDetails.schema,
          scrollAndFocusTarget: pageFocusScroll(),
        },
      },
    },
  },
  downtime: {
    dependencies: [externalServices.lighthouseBenefitsIntake],
  },
  getHelp,
};
export default formConfig;
