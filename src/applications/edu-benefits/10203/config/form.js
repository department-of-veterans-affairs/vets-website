import React from 'react';
import fullSchema from 'vets-json-schema/dist/22-10203-schema.json';

import { transform } from '../submit-transformer';
import { prefillTransformer } from '../prefill-transformer';
import submitForm from '../submitForm';

import { urlMigration } from '../../config/migrations';

import FormFooter from 'platform/forms/components/FormFooter';
import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import GetFormHelp from '../../components/GetFormHelp';
import ErrorText from '../../components/ErrorText';
import oldPreSubmitInfo from 'platform/forms/preSubmitInfo';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { chapters } from './chapters';

import manifest from '../manifest.json';

const isActiveDuty = form => {
  return form.data?.isActiveDuty;
};

const newPreSubmitInfo = {
  required: true,
  notice: (
    <div>
      <strong>Note:</strong> According to federal law, there are criminal
      penalties, including a fine and/or imprisonment for up to 5 years, for
      withholding information or for providing incorrect information. (See 18
      U.S.C. 1001)
      {isActiveDuty() ? (
        <div>
          <p>
            <b>By submitting this form</b> you certify that:
          </p>
          <ul>
            <li>
              All statements in this application are true and correct to the
              best of your knowledge and belief.
            </li>
            <li>
              As an active-duty service member, you have consulted with an
              Education Service Officer (ESO) regarding your education program.
            </li>
          </ul>
        </div>
      ) : (
        <div>
          <p>
            <b>By submitting this form</b> you certify that all statements in
            this application are true and correct to the best of your knowledge
            and belief.
          </p>
        </div>
      )}
    </div>
  ),
  field: 'privacyAgreementAccepted',
  label: (
    <span>
      I have read and accept the{' '}
      <a
        aria-label="Privacy policy, will open in new tab"
        target="_blank"
        href="/privacy-policy/"
      >
        privacy policy
      </a>
    </span>
  ),
  error: 'You must accept the privacy policy before continuing.',
};

const preSubmitInfo = form =>
  environment.isProduction() ? oldPreSubmitInfo : newPreSubmitInfo(form);

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/education_benefits_claims/10203`,
  submit: submitForm,
  trackingPrefix: 'edu-10203-',
  formId: VA_FORM_IDS.FORM_22_10203,
  saveInProgress: {
    messages: {
      inProgress:
        'Your Rogers STEM Scholarship application (22-10203) is in progress.',
      expired:
        'Your saved Rogers STEM Scholarship application (22-10203) has expired. If you want to apply for Rogers STEM Scholarship, please start a new application.',
      saved: 'Your Rogers STEM Scholarship application has been saved.',
    },
  },
  version: 1,
  migrations: [urlMigration('/10203')],
  prefillEnabled: true,
  prefillTransformer,
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to resume your application for education benefits.',
  },
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  defaultDefinitions: {
    ...fullSchema.definitions,
  },
  title: 'Apply for the Rogers STEM Scholarship',
  subTitle: 'Form 22-10203',
  preSubmitInfo: preSubmitInfo,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  chapters,
};

export default formConfig;
