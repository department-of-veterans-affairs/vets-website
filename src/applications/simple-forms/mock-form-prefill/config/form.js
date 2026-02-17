// @ts-check
import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import {
  profilePersonalInfoPage,
  profileContactInfoPages,
  transformEmailForSubmit,
} from 'platform/forms-system/src/js/patterns/prefill';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { prefillTransformer } from './prefill-transformer';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'mock-prefill-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  // eslint-disable-next-line no-shadow
  transformForSubmit: (formConfig, form, options) => {
    let formData = form;
    // transformers can be chained here
    formData = transformEmailForSubmit(formData);
    return transformForSubmit(formConfig, formData, options);
  },
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate has been represented correctly.',
      fullNamePath: 'fullName',
    },
  },
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
    disableWindowUnloadInCI: true,
  },
  ...minimalHeaderFormConfigOptions({
    breadcrumbList: [
      { href: '/', label: 'VA.gov home' },
      {
        href: '/mock-form-prefill',
        label: 'Mock form prefill',
      },
    ],
  }),
  formId: VA_FORM_IDS.FORM_MOCK_PREFILL,
  saveInProgress: {
    messages: {
      inProgress:
        'Your mock prefill testing application (FORM_MOCK_PREFILL) is in progress.',
      expired:
        'Your saved mock prefill testing application (FORM_MOCK_PREFILL) has expired. If you want to apply for mock prefill testing, please start a new application.',
      saved: 'Your mock prefill testing application has been saved.',
    },
  },
  version: 0,
  // or prefill-transformer from PR
  // https://github.com/department-of-veterans-affairs/vets-website/commit/7f49c3bdc4d1aeda2a81f74cd2735e93ff9a55fa#diff-3af1e5e44b3300d11a660f138dcdc67d2a15d1317c96c392139ba2801929fd87R1-R46
  prefillTransformer,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for mock prefill testing.',
    noAuth:
      'Please sign in again to continue your application for mock prefill testing.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    contactInfo: {
      title: 'Veteran information',
      pages: {
        ...profilePersonalInfoPage(),
        ...profileContactInfoPages({
          contactInfoRequiredKeys: ['mailingAddress'],
        }),
      },
    },
  },
  // getHelp,
  footerContent,
};

export default formConfig;
