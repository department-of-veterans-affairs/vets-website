import environment from 'platform/utilities/environment';

import footerContent from 'platform/forms/components/FormFooter';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';
import {
  checkValidPagePath,
  getNextPagePath,
} from 'platform/forms-system/src/js/routing';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import getHelp from '../../shared/components/GetFormHelp';
import transformForSubmit from './submit-transformer';

import informationRequiredPage from '../pages/informationRequired';
import personalInformation from '../pages/personalInformation';
import contactInformation from '../pages/contactInformation';
import applicationInformation from '../pages/applicationInformation';
import certification from '../pages/certification';
import vehicleReceipt from '../pages/vehicleReceipt';

const handleFormLoaded = props => {
  const {
    returnUrl,
    router,
    routes,
    formData,
    formConfig: loadedFormConfig,
  } = props;
  const pageList = routes?.[routes.length - 1]?.pageList || [];
  const introPath = `${loadedFormConfig?.urlPrefix || '/'}introduction`;
  const fallbackPath =
    getNextPagePath(pageList, formData, introPath) || introPath;
  const safeReturnUrl =
    returnUrl && checkValidPagePath(pageList, formData, returnUrl)
      ? returnUrl
      : fallbackPath;

  router.push(safeReturnUrl);
};

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/automobile_adaptive_equipment/v0/form4502`,
  trackingPrefix: 'ss-4502-',
  defaultDefinitions: {},
  dev: {
    collapsibleNavLinks: true,
    showNavLinks: true,
  },
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the information in this form is accurate and has been represented correctly.',
      fullNamePath: 'veteran.fullName',
    },
  },
  formId: '21-4502',
  saveInProgress: {
    messages: {
      inProgress:
        'Your application for automobile or adaptive equipment is in progress.',
      expired:
        'Your saved application for automobile or adaptive equipment has expired.',
      saved:
        'Your application for automobile or adaptive equipment has been saved.',
    },
  },
  onFormLoaded: handleFormLoaded,
  version: 0,
  prefillEnabled: true,
  transformForSubmit,
  savedFormMessages: {
    notFound:
      'Please start over to complete your application for automobile or adaptive equipment.',
    noAuth:
      'Please sign in again to continue your application for automobile or adaptive equipment.',
  },
  hideUnauthedStartLink: true,
  title:
    'Application for Automobile or Other Conveyance and Adaptive Equipment (VA 21-4502)',
  subTitle: 'Please complete this form as accurately as you can.',
  customText: {
    appType: 'veteran application',
    submitButtonText: 'Submit',
  },
  ...minimalHeaderFormConfigOptions({
    breadcrumbList: [
      { href: '/', label: 'VA.gov home' },
      { href: '/disability', label: 'Disability' },
      {
        href: '/disability/eligibility',
        label: 'Eligibility',
      },
      {
        href: '/disability/eligibility/automobile-adaptive-equipment',
        label: 'Automobile or adaptive equipment',
      },
    ],
  }),

  chapters: {
    informationRequiredChapter: {
      title: 'Information we are required to share',
      pages: {
        informationRequiredPage,
      },
    },
    veteranIdChapter: {
      title: 'Veteran identification and contact',
      pages: {
        personalInformationPage: {
          path: 'personal-information',
          title: 'Personal information',
          uiSchema: personalInformation.uiSchema,
          schema: personalInformation.schema,
        },
        contactInformationPage: {
          path: 'contact-information',
          title: 'Contact information',
          uiSchema: contactInformation.uiSchema,
          schema: contactInformation.schema,
        },
      },
    },
    applicationInfoChapter: {
      title: 'Application information',
      pages: {
        applicationInformationPage: {
          path: 'application-information',
          title: 'Service and conveyance details',
          uiSchema: applicationInformation.uiSchema,
          schema: applicationInformation.schema,
        },
      },
    },
    certificationChapter: {
      title: 'Certification',
      pages: {
        certificationPage: {
          path: 'certification',
          title: 'Certification and signature',
          uiSchema: certification.uiSchema,
          schema: certification.schema,
        },
      },
    },
    vehicleReceiptChapter: {
      title: 'Vehicle receipt (optional)',
      pages: {
        vehicleReceiptPage: {
          path: 'vehicle-receipt',
          title: 'Receipt for automobile or conveyance',
          uiSchema: vehicleReceipt.uiSchema,
          schema: vehicleReceipt.schema,
        },
      },
    },
  },
  downtime: {
    dependencies: [externalServices.lighthouseBenefitsIntake],
  },
  footerContent,
  getHelp,
};

export default formConfig;
