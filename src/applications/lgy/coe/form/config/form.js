import preSubmitInfo from 'platform/forms/preSubmitInfo';
import FormFooter from 'platform/forms/components/FormFooter';
import environment from 'platform/utilities/environment';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { GetFormHelp } from '../components/GetFormHelp';
import manifest from '../manifest.json';
import { customCOEsubmit } from './helpers';
import { definitions } from './schemaImports';

// chapter schema imports
import {
  applicantInformation,
  personalInformation,
} from './chapters/applicant';

import {
  additionalInformation,
  mailingAddress,
} from './chapters/contact-information';

import { serviceStatus, serviceHistory } from './chapters/service';

import { loanScreener, loanHistory } from './chapters/loans';

import { fileUpload } from './chapters/documents';

import certificateUse from '../pages/certificateUse';
import { certificateUseOptions } from '../constants';
import hadPriorLoans from '../pages/hadPriorLoans';
// TODO: When schema is migrated to vets-json-schema, remove common
// definitions from form schema and get them from common definitions instead
import disabilitySeparation from '../pages/disabilitySeparation';
import preDischargeClaim from '../pages/preDischargeClaim';
import purpleHeartRecipient from '../pages/purpleHeartRecipient';
import serviceStatus2 from '../pages/serviceStatus2';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/coe/submit_coe_claim`,
  transformForSubmit: customCOEsubmit,
  trackingPrefix: '26-1880-',
  customText: {
    appAction: 'your COE request',
    appSavedSuccessfullyMessage: 'Your request has been saved.',
    appType: 'request',
    continueAppButtonText: 'Continue your request',
    finishAppLaterMessage: 'Finish this request later',
    startNewAppButtonText: 'Start a new request',
    reviewPageTitle: 'Review your request',
  },
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: '26-1880',
  version: 0,
  prefillEnabled: true,
  footerContent: FormFooter,
  preSubmitInfo,
  getHelp: GetFormHelp,
  savedFormMessages: {
    notFound: 'Start over to request benefits.',
    noAuth: 'Sign in again to continue your request for benefits.',
  },
  saveInProgress: {
    messages: {
      inProgress:
        'Your Certificate of Eligibility form (26-1880) is in progress.',
      expired:
        'Your saved Certificate of Eligibility form (26-1880) has expired. If you want to request Chapter 31 benefits, start a new request.',
      saved: 'Your Certificate of Eligibility request has been saved.',
    },
  },
  title: 'Request a VA home loan Certificate of Eligibility (COE)',
  subTitle: 'VA Form 26-1880',
  useCustomScrollAndFocus: true,
  defaultDefinitions: definitions,
  chapters: {
    applicantInformationChapter: {
      title: data => {
        return data.formData['view:coeFormRebuildCveteam']
          ? 'Your information'
          : 'Your personal information on file';
      },
      pages: {
        applicantInformationSummary: {
          path: 'applicant-information',
          // There seems to be a bug where the depends clause is ignored for the first item in the form
          // depends: formData => {
          //   console.log('the value 2:', formData);
          //   return !formData['view:coeFormRebuildCveteam'];
          // },
          title: 'Your personal information on file',
          uiSchema: applicantInformation.uiSchema,
          schema: applicantInformation.schema,
        },
        yourInformation: personalInformation,
      },
    },
    contactInformationChapter: {
      title: 'Your contact information',
      pages: {
        mailingAddress: {
          path: 'mailing-address',
          title: mailingAddress.title,
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
          updateFormData: mailingAddress.updateFormData,
        },
        additionalInformation: {
          path: 'additional-contact-information',
          title: additionalInformation.title,
          uiSchema: additionalInformation.uiSchema,
          schema: additionalInformation.schema,
        },
      },
    },
    serviceHistoryChapter: {
      title: data => {
        return data.formData['view:coeFormRebuildCveteam']
          ? 'Military history'
          : 'Your service history';
      },
      pages: {
        serviceStatus: {
          path: 'service-status',
          title: 'Service status',
          depends: formData => {
            return !formData['view:coeFormRebuildCveteam'];
          },
          uiSchema: serviceStatus.uiSchema,
          schema: serviceStatus.schema,
        },
        serviceStatus2: {
          path: 'service-status-2',
          title: 'Service status',
          depends: formData => {
            return formData['view:coeFormRebuildCveteam'];
          },
          uiSchema: serviceStatus2.uiSchema,
          schema: serviceStatus2.schema,
        },
        disabilitySeparationPage: {
          path: 'disability-separation',
          title: 'Separation',
          depends: formData => {
            return formData['view:coeFormRebuildCveteam'];
          },
          uiSchema: disabilitySeparation.uiSchema,
          schema: disabilitySeparation.schema,
        },
        pendingPredischargeClaimPage: {
          path: 'pending-pre-discharge-claim',
          title: 'Pending pre-discharge claim',
          depends: formData => {
            return formData['view:coeFormRebuildCveteam'];
          },
          uiSchema: preDischargeClaim.uiSchema,
          schema: preDischargeClaim.schema,
        },
        purpleHeartRecipientPage: {
          path: 'purple-heart-recipient',
          title: 'Purple Heart recipient',
          depends: formData => {
            return formData['view:coeFormRebuildCveteam'];
          },
          uiSchema: purpleHeartRecipient.uiSchema,
          schema: purpleHeartRecipient.schema,
        },
        serviceHistory: {
          path: 'service-history',
          title: 'Service history',
          uiSchema: serviceHistory.uiSchema,
          schema: serviceHistory.schema,
        },
      },
    },
    loansChapter: {
      title: data => {
        return data.formData['view:coeFormRebuildCveteam']
          ? 'Loan history'
          : 'Your VA loan history';
      },
      pages: {
        loanScreener: {
          path: 'existing-loan-screener',
          title: 'Existing loans',
          depends: formData => {
            return !formData['view:coeFormRebuildCveteam'];
          },
          uiSchema: loanScreener.uiSchema,
          schema: loanScreener.schema,
        },
        loanHistory: {
          path: 'loan-history',
          title: 'VA-backed loan history',
          uiSchema: loanHistory.uiSchema,
          schema: loanHistory.schema,
          depends: formData =>
            !formData['view:coeFormRebuildCveteam'] &&
            formData?.vaLoanIndicator,
        },
        certificateUse: {
          path: 'certificate-use',
          title: 'Certificate use',
          depends: formData => {
            return formData['view:coeFormRebuildCveteam'];
          },
          uiSchema: certificateUse.uiSchema,
          schema: certificateUse.schema,
        },
        hadPriorLoans: {
          path: 'prior-loans',
          title: 'Previous VA home loans',
          depends: formData => {
            return (
              formData['view:coeFormRebuildCveteam'] &&
              [
                certificateUseOptions.ENTITLEMENT_INQUIRY_ONLY,
                certificateUseOptions.HOME_PURCHASE,
                certificateUseOptions.CASH_OUT_REFINANCE,
              ].includes(formData?.loanHistory?.certificateUse)
            );
          },
          uiSchema: hadPriorLoans.uiSchema,
          schema: hadPriorLoans.schema,
        },
      },
    },
    documentsChapter: {
      title: 'Your supporting documents',
      pages: {
        upload: {
          path: 'upload-supporting-documents',
          title: 'Upload your documents',
          uiSchema: fileUpload.uiSchema,
          schema: fileUpload.schema,
        },
      },
    },
  },
};

export default formConfig;
