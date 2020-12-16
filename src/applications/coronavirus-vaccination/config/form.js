import FormFooter from 'platform/forms/components/FormFooter';
import environment from 'platform/utilities/environment';

import Introduction from '../containers/Introduction';
import Confirmation from '../containers/Confirmation';
import { chapters } from './chapters';

import manifest from '../manifest.json';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/education_benefits_claims/10203`,
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
  prefillEnabled: true,
  prefillTransformer,
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to resume your application for education benefits.',
  },
  introduction: Introduction,
  confirmation: Confirmation,
  title: 'Apply for the Rogers STEM Scholarship',
  footerContent: FormFooter,
  chapters,
};

export default formConfig;
