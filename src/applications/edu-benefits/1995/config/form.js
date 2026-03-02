import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { urlMigration } from '../../config/migrations';

import GetFormHelp1995 from '../components/GetFormHelp1995';

import { mebChapters } from './chapters';

import manifest from '../manifest.json';
import IntroductionPageRedirect from '../containers/IntroductionPageRedirect';

const baseConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  trackingPrefix: 'edu-1995-',
  formId: VA_FORM_IDS.FORM_22_1995,
  disableSave: true,
  version: 1,
  migrations: [urlMigration('/1995')],
  title: 'Change your education benefits',
  footerContent: FormFooter,
  getHelp: GetFormHelp1995,
  introduction: IntroductionPageRedirect,
};

export default {
  ...baseConfig,
  chapters: mebChapters,
};
