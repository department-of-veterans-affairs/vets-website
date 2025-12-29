import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import authorizingOfficialName from '../pages/authorizingOfficialName';
import whatToExpect from '../pages/whatToExpect';
import acknowledgement1 from '../pages/acknowledgement1';
import acknowledgement2 from '../pages/acknowledgement2';
import acknowledgement3 from '../pages/acknowledgement3';
import acknowledgement4 from '../pages/acknowledgement4';
import acknowledgement5 from '../pages/acknowledgement5';
import hasVaFacilityCode from '../pages/hasVaFacilityCode';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'edu-0976-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
    disableWindowUnloadInCI: true,
  },
  formId: '22-0976',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your Approval of a Program in a Foreign Country application (22-0976) is in progress.',
    //   expired: 'Your saved Approval of a Program in a Foreign Country application (22-0976) has expired. If you want to apply for Approval of a Program in a Foreign Country, please start a new application.',
    //   saved: 'Your Approval of a Program in a Foreign Country application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for Approval of a Program in a Foreign Country.',
    noAuth:
      'Please sign in again to continue your application for Approval of a Program in a Foreign Country.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    authorizingOfficialAndAcknowledgements: {
      title: 'Authorizing official details and acknowledgements',
      pages: {
        authorizingOfficialName: {
          path: 'authorizing-official-name',
          title: 'Authorizing official name',
          uiSchema: authorizingOfficialName.uiSchema,
          schema: authorizingOfficialName.schema,
        },
        whatToExpect: {
          path: 'what-to-expect',
          title: 'What to expect',
          uiSchema: whatToExpect.uiSchema,
          schema: whatToExpect.schema,
        },
        acknowledgement1: {
          path: 'acknowledgement-1',
          title: 'Acknowledgement 1',
          uiSchema: acknowledgement1.uiSchema,
          schema: acknowledgement1.schema,
        },
        acknowledgement2: {
          path: 'acknowledgement-2',
          title: 'Acknowledgement 2',
          uiSchema: acknowledgement2.uiSchema,
          schema: acknowledgement2.schema,
        },
        acknowledgement3: {
          path: 'acknowledgement-3',
          title: 'Acknowledgement 3',
          uiSchema: acknowledgement3.uiSchema,
          schema: acknowledgement3.schema,
        },
        acknowledgement4: {
          path: 'acknowledgement-4',
          title: 'Acknowledgement 4',
          uiSchema: acknowledgement4.uiSchema,
          schema: acknowledgement4.schema,
        },
        acknowledgement5: {
          path: 'acknowledgement-5',
          title: 'Acknowledgement 5',
          uiSchema: acknowledgement5.uiSchema,
          schema: acknowledgement5.schema,
        },
      },
    },
    institutionDetails: {
      title: 'Institution details',
      pages: {
        hasVaFacilityCode: {
          path: 'has-va-facility-code',
          title: 'Has VA facility code',
          uiSchema: hasVaFacilityCode.uiSchema,
          schema: hasVaFacilityCode.schema,
        },
      },
    },
  },
};

export default formConfig;
