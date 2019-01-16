import environment from '../../../../platform/utilities/environment';

import preSubmitInfo from '../../../../platform/forms/preSubmitInfo';

import FormFooter from '../../../../platform/forms/components/FormFooter';

import GetFormHelp from '../../components/GetFormHelp';
import ErrorText from '../../components/ErrorText';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { vetTecInfo } from '../pages';

import { prefillTransformer, transform } from '../helpers';

const formConfig = {
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/education_benefits_claims/0994`,
  trackingPrefix: 'edu-0994-',
  formId: '22-0994',
  version: 1,
  migrations: [],
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
  title: 'Apply for Vet Tec Benefits',
  subTitle: 'Form 22-0994',
  preSubmitInfo,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  chapters: {
    applicantInformation: {
      title: 'Vet Tec Application',
      pages: {
        vetTecInfo: {
          title: 'Vet Tec Application',
          path: 'vet-tec-application',
          uiSchema: vetTecInfo.uiSchema,
          schema: vetTecInfo.schema,
        },
      },
    },
  },
};

export default formConfig;
