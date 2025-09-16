import React from 'react';
import footerContent from 'platform/forms/components/FormFooter';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import environment from 'platform/utilities/environment';

import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import getHelp from '../../shared/components/GetFormHelp';
import transformForSubmit from './submit-transformer';

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
import marriageRecognition from '../pages/marriageRecognition';

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
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21P-0537',
  version: 0,
  prefillEnabled: true,
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
    },
  },
  title: 'Marital Status Questionnaire for DIC Recipients',
  subTitle: 'VA Form 21P-0537',
  customText: {
    appType: 'form',
  },
  hideUnauthedStartLink: true,
  defaultDefinitions: {},
  footerContent,
  chapters: {
    recipientInfoChapter: {
      title: 'Your information',
      pages: {
        recipientName: {
          path: 'recipient-info/name',
          title: 'Your name',
          uiSchema: recipientName.uiSchema,
          schema: recipientName.schema,
        },
        recipientIdentifier: {
          path: 'recipient-info/identifier',
          title: 'Your identification',
          uiSchema: recipientIdentifier.uiSchema,
          schema: recipientIdentifier.schema,
        },
      },
    },
    eligibilityScreeningChapter: {
      title: 'Marital status screening',
      pages: {
        remarriageQuestion: {
          path: 'screening/remarriage-status',
          title: 'Have you remarried?',
          uiSchema: remarriageQuestion.uiSchema,
          schema: remarriageQuestion.schema,
        },
      },
    },
    maritalDetailsChapter: {
      title: 'Marriage information',
      pages: {
        marriageInfo: {
          path: 'marital/marriage-info',
          title: 'Details about your remarriage',
          depends: formData => formData.hasRemarried === true,
          uiSchema: marriageInfo.uiSchema,
          schema: marriageInfo.schema,
        },
        spouseVeteranStatus: {
          path: 'marital/spouse-veteran',
          title: 'Is your spouse a veteran?',
          depends: formData => formData.hasRemarried === true,
          uiSchema: spouseVeteranStatus.uiSchema,
          schema: spouseVeteranStatus.schema,
        },
        spouseVeteranId: {
          path: 'marital/spouse-veteran-id',
          title: 'Spouse veteran information',
          depends: formData =>
            formData.hasRemarried === true &&
            formData.remarriage?.spouseIsVeteran === true,
          uiSchema: spouseVeteranId.uiSchema,
          schema: spouseVeteranId.schema,
        },
        terminationStatus: {
          path: 'marital/termination-status',
          title: 'Has your remarriage ended?',
          depends: formData => formData.hasRemarried === true,
          uiSchema: terminationStatus.uiSchema,
          schema: terminationStatus.schema,
        },
        terminationDetails: {
          path: 'marital/termination-details',
          title: 'Termination details',
          depends: formData =>
            formData.hasRemarried === true &&
            formData.remarriage?.hasTerminated === true,
          uiSchema: terminationDetails.uiSchema,
          schema: terminationDetails.schema,
        },
      },
    },
    contactInfoChapter: {
      title: 'Contact information',
      pages: {
        phoneAndEmail: {
          path: 'contact/phone-email',
          title: 'How can we reach you?',
          uiSchema: phoneAndEmail.uiSchema,
          schema: phoneAndEmail.schema,
        },
      },
    },
    certificationChapter: {
      title: 'Additional information',
      pages: {
        marriageRecognition: {
          path: 'additional-info/marriage-recognition',
          title: 'Important information about marriage recognition',
          depends: formData => formData.hasRemarried === true,
          uiSchema: marriageRecognition.uiSchema,
          schema: marriageRecognition.schema,
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
