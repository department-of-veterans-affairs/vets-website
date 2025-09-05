import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import GetFormHelp from '../components/GetFormHelp';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import nameAndDateOfBirth from './pages/nameAndDateOfBirth';
import deceasedInfo2 from './pages/deceasedInfo2';
import deceasedMilitaryDetails from './pages/deceasedMilitaryDetails';
import deceasedServicePeriods from './pages/deceasedServicePeriods';
import demographicsInfo from './pages/demographicsInfo';
import demographicsInfo2 from './pages/demographicsInfo2';
import mailingAddress from './pages/mailingAddress';
import deceasedName from './pages/deceasedName';
import deceasedPreviousName from './pages/deceasedPreviousName';
import currentlyBuried from './pages/currentlyBuried';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '40-4962-ToN-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: VA_FORM_IDS.FORM_40_4962,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your burial benefits application (40-4962) is in progress.',
    //   expired: 'Your saved burial benefits application (40-4962) has expired. If you want to apply for burial benefits, please start a new application.',
    //   saved: 'Your burial benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for burial benefits.',
    noAuth:
      'Please sign in again to continue your application for burial benefits.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  getHelp: GetFormHelp,
  chapters: {
    personalInformationChapter: {
      title: 'Your personal information',
      pages: {
        nameAndDateOfBirth: {
          path: 'name-and-date-of-birth',
          title: 'Name and date of birth',
          uiSchema: nameAndDateOfBirth.uiSchema,
          schema: nameAndDateOfBirth.schema,
        },
        deceasedInfo2: {
          path: 'deceased-info-2',
          title: 'Deceased details',
          uiSchema: deceasedInfo2.uiSchema,
          schema: deceasedInfo2.schema,
        },
        demographicsInfo: {
          path: 'demographics-info',
          title: 'Demographics',
          uiSchema: demographicsInfo.uiSchema,
          schema: demographicsInfo.schema,
        },
        demographicsInfo2: {
          path: 'demographics-info-2',
          title: 'Demographics (continued)',
          uiSchema: demographicsInfo2.uiSchema,
          schema: demographicsInfo2.schema,
        },
        mailingAddress: {
          path: 'mailing-address',
          title: 'Mailing address',
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
        },
      },
    },
    militaryHistory: {
      title: 'Military history',
      pages: {
        deceasedMilitaryDetails: {
          path: 'deceased-military-details',
          title: 'Deceased’s military details',
          uiSchema: deceasedMilitaryDetails.uiSchema,
          schema: deceasedMilitaryDetails.schema,
        },
        deceasedServicePeriods: {
          path: 'deceased-service-periods',
          title: 'Deceased’s service periods',
          uiSchema: deceasedServicePeriods.uiSchema,
          schema: deceasedServicePeriods.schema,
          showOnReviewPage: true,
        },
        deceasedName: {
          path: 'deceased-name',
          title: 'Deceased’s name',
          uiSchema: deceasedName.uiSchema,
          schema: deceasedName.schema,
        },
        deceasedPreviousName: {
          path: 'deceased-previous-name',
          title: 'Deceased’s previous name',
          uiSchema: deceasedPreviousName.uiSchema,
          schema: deceasedPreviousName.schema,
        },
      },
    },
    burialBenefits: {
      title: 'Burial benefits',
      pages: {
        burialBenefitsInfo: {
          path: 'burial-benefits-info',
          title: 'Burial benefits information',
          uiSchema: currentlyBuried.uiSchema,
          schema: currentlyBuried.schema,
        },
      },
    },
    contactInformationChapter: {
      title: 'Contact information',
      pages: {},
    },
  },
  footerContent,
};

export default formConfig;
