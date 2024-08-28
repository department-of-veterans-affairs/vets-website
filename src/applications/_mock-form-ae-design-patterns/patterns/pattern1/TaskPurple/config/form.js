import { VA_FORM_IDS } from 'platform/forms/constants';
import profileContactInfo from './profileContactInfo';
import { customText } from '../content/saveInProgress';

import manifest from '../../../../manifest.json';

import IntroductionPage from '../IntroductionPage';
import ConfirmationPage from '../../../../shared/components/pages/ConfirmationPage';
import { taskCompletePage } from '../../../../shared/config/taskCompletePage';
import { GetFormHelp } from '../GetFormHelp';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/1/task-purple/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'task-purple',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_MOCK_AE_DESIGN_PATTERNS,
  getHelp: GetFormHelp,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your mock form ae design patterns benefits application (00-1234) is in progress.',
    //   expired: 'Your saved mock form ae design patterns benefits application (00-1234) has expired. If you want to apply for mock form ae design patterns benefits, please start a new application.',
    //   saved: 'Your mock form ae design patterns benefits application has been saved.',
    // },
  },
  version: 0,
  prefillTransformer(pages, formData, metadata) {
    const transformedData = {
      veteranSocialSecurityNumber:
        formData?.data?.attributes?.veteran?.ssn || null,
    };
    return {
      metadata,
      formData: transformedData,
      pages,
    };
  },
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for mock form ae design patterns benefits.',
    noAuth:
      'Please sign in again to continue your application for mock form ae design patterns benefits.',
  },
  customText,
  title: 'Request a Board Appeal',
  subTitle: 'VA Form 10182 (Notice of Disagreement)',
  defaultDefinitions: {},
  chapters: {
    contactInfo: {
      title: 'Veteran information',
      pages: {
        ...profileContactInfo({
          contactInfoPageKey: 'confirmContactInfo3',
          contactPath: 'veteran-information',
          contactInfoRequiredKeys: [
            'mailingAddress',
            'email',
            'homePhone',
            'mobilePhone',
          ],
          included: ['homePhone', 'mailingAddress', 'email', 'mobilePhone'],
        }),
        taskCompletePage,
      },
    },
  },
};

export default formConfig;
