import environment from 'platform/utilities/environment';

import FormFooter from 'platform/forms/components/FormFooter';
import preSubmitInfo from 'platform/forms/preSubmitInfo';
import { VA_FORM_IDS } from 'platform/forms/constants';

import { externalServices as services } from 'platform/monitoring/DowntimeNotification';

import submitFormFor from '../../all-claims/config/submitForm';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetFormHelp from '../../components/GetFormHelp';
import ErrorText from '../../components/ErrorText';
import FormSavedPage from '../../all-claims/containers/FormSavedPage';

import { directToCorrectForm } from '../../all-claims/utils';

import prefillTransformer from '../../all-claims/prefill-transformer';

import { transform } from '../../all-claims/submit-transformer';

import { veteranInfoDescription } from '../../all-claims/content/veteranDetails';
import { alternateNames, contactInformation } from '../../all-claims/pages';

import migrations from '../../all-claims/migrations';

import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

const formConfig = {
  urlPrefix: '/',
  intentToFileUrl: '/evss_claims/intent_to_file/compensation',
  submitUrl: `${
    environment.API_URL
  }/v0/disability_compensation_form/submit_all_claim`,
  submit: submitFormFor('disability-526EZ'),
  trackingPrefix: 'disability-526EZ-',
  downtime: {
    requiredForPrefill: true,
    dependencies: [services.evss, services.emis, services.mvi, services.vet360],
  },
  formId: VA_FORM_IDS.FORM_21_526EZ,
  onFormLoaded: directToCorrectForm,
  version: migrations.length,
  migrations,
  prefillTransformer,
  prefillEnabled: true,
  verifyRequiredPrefill: true,
  savedFormMessages: {
    notFound: 'Please start over to file for benefits delivery at discharge.',
    noAuth:
      'Please sign in again to resume your application for benefits delivery at discharge.',
  },
  formSavedPage: FormSavedPage,
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  defaultDefinitions: {
    ...fullSchema.definitions,
  },
  title: 'File for Benefits Delivery at Discharge',
  subTitle: 'Benefits Delivery at Discharge (BDD)',
  preSubmitInfo,
  chapters: {
    veteranDetails: {
      title: isReviewPage => `${isReviewPage ? 'Review ' : ''}Service Member`,
      pages: {
        veteranInformation: {
          title: 'Veteran information',
          path: 'veteran-information',
          uiSchema: { 'ui:description': veteranInfoDescription },
          schema: { type: 'object', properties: {} },
        },
        contactInformation: {
          title: 'Veteran contact information',
          path: 'contact-information',
          uiSchema: contactInformation.uiSchema,
          schema: contactInformation.schema,
        },
        alternateNames: {
          title: 'Service under another name',
          path: 'alternate-names',
          uiSchema: alternateNames.uiSchema,
          schema: alternateNames.schema,
        },
      },
    },
  },
};

export default formConfig;
