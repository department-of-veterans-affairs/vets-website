import { VA_FORM_IDS } from 'platform/forms/constants';
import CallVBACenter from 'platform/static-data/CallVBACenter';
import React from 'react';
import { SUBTITLE, TITLE } from '../constants';
import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';
import manifest from '../manifest.json';

import chooseDemo from '../pages/chooseDemo';
import newConditionsJustConditionsPages from '../pages/newConditionsJustConditionsPages';
import newConditionsPages from '../pages/newConditionsPages';

const FormFooter = () => (
  <div className="row vads-u-margin-bottom--2">
    <div className="usa-width-two-thirds medium-8 columns">
      <va-need-help>
        <div slot="content">
          <div>
            <p className="help-talk">
              For help filling out this form, or if the form isn’t working
              right, please <CallVBACenter />
            </p>
          </div>
        </div>
      </va-need-help>
    </div>
  </div>
);

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'new-conditions',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  footerContent: FormFooter,
  // dev: {
  //   showNavLinks: true,
  //   collapsibleNavLinks: true,
  // },
  formId: VA_FORM_IDS.FORM_21_526EZ,
  saveInProgress: {
    messages: {
      inProgress:
        'Your disability compensation application (21-526EZ) is in progress.',
      expired:
        'Your saved disability compensation application (21-526EZ) has expired. If you want to apply for disability compensation, please start a new application.',
      saved: 'Your disability compensation application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for disability compensation.',
    noAuth:
      'Please sign in again to continue your application for disability compensation.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  v3SegmentedProgressBar: true,
  defaultDefinitions: {},
  chapters: {
    newConditionsChapter: {
      title: 'Conditions',
      pages: {
        chooseDemo,
        ...newConditionsPages,
        ...newConditionsJustConditionsPages,
      },
    },
  },
};

export default formConfig;
