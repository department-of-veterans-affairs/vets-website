// we're not using JSON schema for this form
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import footerContent from 'platform/forms/components/FormFooter';
import getHelp from '../../shared/components/GetFormHelp';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import preparerTypePg from '../pages/preparerType';
import idInfoThirdPartyVetPg from '../pages/idInfoThirdPartyVeteran';
import idInfoThirdPartyNonVetPg from '../pages/idInfoThirdPartyNonVeteran';
import nameAndDobPg from '../pages/nameAndDateofBirth';
import idInfoPg from '../pages/idInfo';
import livingSituationPg from '../pages/livingSituation';
import livingSituationThirdPartyVetPg from '../pages/livingSituationThirdPartyVeteran';
import livingSituationThirdPartyNonVetPg from '../pages/livingSituationThirdPartyNonVeteran';
import { PREPARER_TYPES, SUBTITLE, TITLE } from './constants';
import {
  getMockData,
  getPersonalInformationChapterTitle,
  getLivingSituationChapterTitle,
} from '../helpers';

// export isLocalhost() to facilitate unit-testing
export function isLocalhost() {
  return environment.isLocalhost();
}

// mock-data import for local development
import testData from '../tests/e2e/fixtures/data/veteran.json';

const mockData = testData.data;

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  dev: {
    showNavLinks: !window.Cypress,
  },
  trackingPrefix: 'pp-10207-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '20-10207',
  hideUnauthedStartLink: true,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your priority processing request application (20-10207) is in progress.',
    //   expired: 'Your saved priority processing request application (20-10207) has expired. If you want to apply for priority processing request, please start a new application.',
    //   saved: 'Your priority processing request application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for priority processing request.',
    noAuth:
      'Please sign in again to continue your application for priority processing request.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  v3SegmentedProgressBar: true,
  chapters: {
    preparerTypeChapter: {
      title: 'Your identity',
      pages: {
        preparerTypePage: {
          path: 'preparer-type',
          title: 'Which of these best describes you?',
          uiSchema: preparerTypePg.uiSchema,
          schema: preparerTypePg.schema,
          pageClass: 'preparer-type',
          // we want req'd fields prefilled for LOCAL testing/previewing
          // one single initialData prop here will suffice for entire form
          initialData: getMockData(mockData, isLocalhost),
        },
        thirdPartyVeteranIdentityPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_VETERAN,
          path: 'third-party-veteran-identity',
          title: 'Name and third-party type',
          uiSchema: idInfoThirdPartyVetPg.uiSchema,
          schema: idInfoThirdPartyVetPg.schema,
          pageClass: 'third-party-veteran-identity',
        },
        thirdPartyNonVeteranIdentityPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
          path: 'third-party-non-veteran-identity',
          title: 'Name and third-party type',
          uiSchema: idInfoThirdPartyNonVetPg.uiSchema,
          schema: idInfoThirdPartyNonVetPg.schema,
          pageClass: 'third-party-non-veteran-identity',
        },
      },
    },
    personalInformationChapter: {
      title: ({ formData }) => getPersonalInformationChapterTitle(formData),
      pages: {
        nameAndDateOfBirthPage: {
          path: 'name-and-date-of-birth',
          title: 'Name and date of birth',
          uiSchema: nameAndDobPg.uiSchema,
          schema: nameAndDobPg.schema,
          pageClass: 'name-and-date-of-birth',
        },
        identificationInformationPage: {
          path: 'identification-information',
          title: 'Identification information',
          uiSchema: idInfoPg.uiSchema,
          schema: idInfoPg.schema,
          pageClass: 'identification-information',
        },
      },
    },
    livingSituationChapter: {
      title: ({ formData }) => getLivingSituationChapterTitle(formData),
      pages: {
        livingSituationPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.VETERAN ||
            formData.preparerType === PREPARER_TYPES.NON_VETERAN,
          path: 'living-situation',
          title: 'Your living situation',
          uiSchema: livingSituationPg.uiSchema,
          schema: livingSituationPg.schema,
          pageClass: 'living-situation',
        },
        livingSituationThirdPartyVeteranPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_VETERAN,
          path: 'living-situation-third-party-veteran',
          title: 'Veteran’s living situation',
          uiSchema: livingSituationThirdPartyVetPg.uiSchema,
          schema: livingSituationThirdPartyVetPg.schema,
          pageClass: 'living-situation-third-party-veteran',
        },
        livingSituationThirdPartyNonVeteranPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
          path: 'living-situation-third-party-non-veteran',
          title: 'Claimant’s living situation',
          uiSchema: livingSituationThirdPartyNonVetPg.uiSchema,
          schema: livingSituationThirdPartyNonVetPg.schema,
          pageClass: 'living-situation-third-party-non-veteran',
        },
      },
    },
  },
  footerContent,
  getHelp,
};

export default formConfig;
