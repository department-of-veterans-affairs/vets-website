import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import profileContactInfo from 'platform/forms-system/src/js/definitions/profileContactInfo';
import { getContent } from 'platform/forms-system/src/js/utilities/data/profile';
import { TITLE } from '../constants';
import manifest from '../manifest.json';
import ConfirmationPage from '../containers/ConfirmationPage';

const allContactInformationKeys = ['address', 'email', 'phone'];

const content = getContent('form');
content.title = '';
content.description = null;

const profileContactInfoPage = profileContactInfo({
  contactPath: 'contact-information',
  included: allContactInformationKeys,
  contactInfoRequiredKeys: allContactInformationKeys,
  addressKey: 'address',
  mobilePhoneKey: 'phone',
  contactInfoUiSchema: {},
  disableMockContactInfo: true,
  contactSectionHeadingLevel: 'h2',
  editContactInfoHeadingLevel: 'h2',
  content,
});

profileContactInfoPage.confirmContactInfo.onNavForward = ({ goPath }) => {
  goPath('confirmation');
};

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'welcome-va-setup-review-information-',
  introduction: null,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: VA_FORM_IDS.FORM_WELCOME_VA_SETUP_REVIEW_INFORMATION,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your welcome va setup review information form application (00-0000) is in progress.',
    //   expired: 'Your saved welcome va setup review information form application (00-0000) has expired. If you want to apply for welcome va setup review information form, please start a new application.',
    //   saved: 'Your welcome va setup review information form application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for welcome va setup review information form.',
    noAuth:
      'Please sign in again to continue your application for welcome va setup review information form.',
  },
  title: TITLE,
  defaultDefinitions: {},
  chapters: {
    infoPage: {
      pages: {
        ...profileContactInfoPage,
      },
    },
  },
  customText: {
    finishAppLaterMessage: ' ',
    submitButtonText: 'Finish',
  },
  formOptions: {
    noTopNav: true,
  },
  // getHelp,
  footerContent,
};

export default formConfig;
