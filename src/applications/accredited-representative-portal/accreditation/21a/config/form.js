// eslint-disable-next-line @department-of-veterans-affairs/no-cross-app-imports
import wrappedFormConfig from 'applications/accreditation/21a/config/form';

import manifest from '../../../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';

const formConfig = {
  ...wrappedFormConfig,
  rootUrl: manifest.rootUrl,
  introduction: IntroductionPage,
};

export default formConfig;
