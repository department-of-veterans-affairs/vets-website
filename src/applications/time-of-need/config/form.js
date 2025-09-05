import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import GetFormHelp from '../components/GetFormHelp';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import currentlyBuried from './pages/currentlyBuried';
import deceasedInfo2 from './pages/deceasedInfo2';
import deceasedMilitaryDetails from './pages/deceasedMilitaryDetails';
import deceasedName from './pages/deceasedName';
import deceasedPreviousName from './pages/deceasedPreviousName';
import demographicsInfo from './pages/demographicsInfo';
import demographicsInfo2 from './pages/demographicsInfo2';
import desiredCemetery from './pages/desiredCemetery';
import funeralHomeAddress from './pages/funeralHomeAddress';
import funeralHomeContact from './pages/funeralHomeContact';
import funeralHomeDetails from './pages/funeralHomeDetails';
import intermentDetails from './pages/intermentDetails';
import mailingAddress from './pages/mailingAddress';
import nameAndDateOfBirth from './pages/nameAndDateOfBirth';
import preparerContact from './pages/preparerContact';
import preparerName from './pages/preparerName';
import { burialBenefitsPagesVeteran } from './pages/burialBenefitsPages';
import { deceasedServicePeriodsPages } from './pages/deceasedServicePeriodsPages';
import { intermentDateRangesPages } from './pages/intermentDateRangesPages';
import {
  SupportingFilesDescription,
  fileUploadUi,
  timeOfNeedAttachments,
} from './pages/supportingDocuments';

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
  initialData: {
    currentlyBuriedPersons: [],
    servicePeriods: [],
    desiredIntermentDateRanges: [], // added
  },
  defaultDefinitions: {
    currentlyBuriedPersons: [],
  },
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
        // Removed legacy deceasedServicePeriods single page
        // Spread new array builder pages:
        ...deceasedServicePeriodsPages,
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
          depends: { servedUnderAnotherName: true },
        },
      },
    },
    burialBenefits: {
      title: 'Burial benefits',
      pages: {
        burialBenefitsInfo: {
          path: 'currently-buried',
          title: 'Currently buried',
          uiSchema: currentlyBuried.uiSchema,
          schema: currentlyBuried.schema,
        },
        // Stand-alone array builder pages (no conditional dependency)
        ...burialBenefitsPagesVeteran,
        desiredCemetery: {
          path: 'desired-cemetery',
          title: 'Desired cemetery for burial of deceased',
          uiSchema: desiredCemetery.uiSchema,
          schema: desiredCemetery.schema,
        },
      },
    },
    interment: {
      title: 'Interment details',
      pages: {
        // Move intermentDetails first
        intermentDetails: {
          path: 'interment-details',
          title: 'Interment details',
          uiSchema: intermentDetails.uiSchema,
          schema: intermentDetails.schema,
        },
        // Then the desired date/time range array builder pages
        ...intermentDateRangesPages,
      },
    },
    funeralHome: {
      title: 'Funeral home information',
      pages: {
        funeralHomeDetails: {
          path: 'funeral-home-details',
          title: 'Funeral home details',
          uiSchema: funeralHomeDetails.uiSchema,
          schema: funeralHomeDetails.schema,
        },
        funeralHomeAddress: {
          path: 'funeral-home-address',
          title: 'Funeral home address',
          uiSchema: funeralHomeAddress.uiSchema,
          schema: funeralHomeAddress.schema,
        },
        funeralHomeContact: {
          path: 'funeral-home-contact',
          title: 'Funeral home contact information',
          uiSchema: funeralHomeContact.uiSchema,
          schema: funeralHomeContact.schema,
        },
      },
    },
    supportingDocuments: {
      title: 'Supporting files',
      pages: {
        supportingDocuments: {
          title: 'Upload supporting files',
          path: 'supporting-documents',
          editModeOnReviewPage: false,
          uiSchema: {
            'ui:description': SupportingFilesDescription,
            application: {
              timeOfNeedAttachments: fileUploadUi({ required: false }),
            },
          },
          schema: {
            type: 'object',
            properties: {
              application: {
                type: 'object',
                properties: {
                  timeOfNeedAttachments, // renamed schema property
                },
              },
            },
          },
        },
      },
    },
    preparerInformation: {
      title: 'Preparer information',
      pages: {
        preparerName: {
          path: 'preparer-name',
          title: 'Preparer’s name',
          uiSchema: preparerName.uiSchema,
          schema: preparerName.schema,
        },
        preparerContact: {
          path: 'preparer-contact',
          title: 'Preparer’s contact information',
          uiSchema: preparerContact.uiSchema,
          schema: preparerContact.schema,
        },
      },
    },
  },
  footerContent,
};

export default formConfig;
