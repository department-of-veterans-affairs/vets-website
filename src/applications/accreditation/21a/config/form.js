import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';

import GetFormHelp from '../components/GetFormHelp';
import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';
import manifest from '../manifest.json';
import personalInformationChapter from '../pages/01-personal-information-chapter';
import militaryServiceChapter from '../pages/02-military-service-chapter';
import employmentInformationChapter from '../pages/03-employment-information-chapter';
import educationHistoryChapter from '../pages/04-education-history-chapter';
import lawPracticeInformationChapter from '../pages/05-law-practice-information-chapter';
import backgroundInformationChapter from '../pages/06-background-information-chapter';
import characterReferencesChapter from '../pages/07-character-references-chapter';

const formConfig = {
  formId: VA_FORM_IDS.FORM_21A,
  version: 0,
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${
    environment.API_URL
  }/accredited_representative_portal/v0/form21a`,
  trackingPrefix: '21a-',
  title: 'Apply to become a VA accredited attorney or claims agent',
  subTitle: 'VA Form 21a',
  v3SegmentedProgressBar: true,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: '',
  prefillEnabled: true,
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate has been represented correctly.',
      fullNamePath: 'fullName',
    },
  },
  saveInProgress: {
    messages: {
      inProgress:
        'Your application to become a VA accredited attorney or claims agent (21a) is in progress.',
      expired:
        'Your saved application to become a VA accredited attorney or claims agent (21a) has expired. If you want to apply to become a VA accredited attorney or claims agent, please start a new application.',
      saved:
        'Your application to become a VA accredited attorney or claims agent (21a) has been saved.',
    },
  },
  savedFormMessages: {
    notFound:
      'Please start over to apply to become a VA accredited attorney or claims agent.',
    noAuth:
      'Please sign in again to continue your application to become a VA accredited attorney or claims agent.',
  },
  defaultDefinitions: {},
  chapters: {
    personalInformationChapter,
    militaryServiceChapter,
    employmentInformationChapter,
    educationHistoryChapter,
    lawPracticeInformationChapter,
    backgroundInformationChapter,
    characterReferencesChapter,
  },
};

export default formConfig;
