import get from '@department-of-veterans-affairs/platform-forms-system/get';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import SubmissionError from '../../shared/components/SubmissionError';
import FormFooter from '../components/FormFooter';
import content from '../locales/en/content.json';

import {
  certifierRoleSchema,
  certifierNameSchema,
  certifierAddressSchema,
  signerContactInfoPage,
  SignerContactInfoPage,
  certifierRelationshipSchema,
} from '../chapters/signerInformation';

import transformForSubmit from './submitTransformer';

import {
  sponsorNameDobSchema,
  sponsorIdentificationSchema,
  sponsorStatus,
  sponsorStatusDetails,
  sponsorAddress,
  sponsorContactInfo,
  sponsorIntroSchema,
} from '../chapters/sponsorInformation';
import { applicantPages } from '../chapters/applicantInformation';
import ohiIntroduction from '../chapters/medicareInformation/ohiIntroduction';
import medicareIntroduction from '../chapters/medicareInformation/medicareIntroduction';
import {
  medicarePages,
  medicareStatusPage,
  medicareProofOfIneligibilityPage,
} from '../chapters/medicareInformation';
import healthInsuranceIntroduction from '../chapters/healthInsuranceInformation/healthInsuranceIntroduction';
import { healthInsurancePages } from '../chapters/healthInsuranceInformation';
import AddressSelectionPage, {
  NOT_SHARED,
} from '../components/FormPages/AddressSelectionPage';
import AddressSelectionReviewPage from '../components/FormReview/AddressSelectionReviewPage';

// import mockData from '../tests/e2e/fixtures/data/representative.json';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  transformForSubmit,
  submitUrl: `${environment.API_URL}/ivc_champva/v1/forms/10-10d-ext`,
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      fullNamePath: _formData => 'certifierName',
    },
  },
  trackingPrefix: '10-10d-extended-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  submissionError: SubmissionError,
  footerContent: FormFooter,
  customText: { appType: 'form' },
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
    disableWindowUnloadInCI: true,
  },
  formOptions: {
    useWebComponentForNavigation: true,
    filterInactiveNestedPageData: true,
  },
  ...minimalHeaderFormConfigOptions({
    breadcrumbList: [
      {
        href: `/family-and-caregiver-benefits`,
        label: `Family and caregiver benefits`,
      },
      {
        href: `/family-and-caregiver-benefits/health-and-disability/`,
        label: `Health and disability benefits for family and caregivers`,
      },
      {
        href: `/family-and-caregiver-benefits/health-and-disability/champva`,
        label: `CHAMPVA benefits`,
      },
      {
        href: `#content`,
        label: `Apply for CHAMPVA benefits`,
      },
    ],
    homeVeteransAffairs: true,
    wrapping: true,
  }),
  formId: VA_FORM_IDS.FORM_10_10D_EXTENDED,
  downtime: {
    dependencies: [externalServices.pega, externalServices.form1010dExt],
  },
  saveInProgress: {
    messages: {
      inProgress: 'Your CHAMPVA benefits application (10-10D) is in progress.',
      expired:
        'Your saved CHAMPVA benefits application (10-10D) has expired. If you want to apply for CHAMPVA benefits, please start a new application.',
      saved: 'Your CHAMPVA benefits application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: false,
  savedFormMessages: {
    notFound:
      'Please start over to apply for CHAMPVA application (includes 10-7959c).',
    noAuth:
      'Please sign in again to continue your application for CHAMPVA application (includes 10-7959c).',
  },
  title: content['form-title'],
  subTitle: content['form-subtitle'],
  defaultDefinitions: {},
  chapters: {
    certifierInformation: {
      title: 'Your information',
      pages: {
        page1: {
          // initialData: mockData.data,
          path: 'who-is-applying',
          title: 'Which of these best describes you?',
          ...certifierRoleSchema,
        },
        page2: {
          path: 'your-name',
          title: 'Your name',
          ...certifierNameSchema,
        },
        page3: {
          path: 'your-mailing-address',
          title: 'Your mailing address',
          ...certifierAddressSchema,
        },
        page4: {
          path: 'your-contact-information',
          title: 'Your contact information',
          CustomPage: SignerContactInfoPage,
          CustomPageReview: null,
          ...signerContactInfoPage,
        },
        page5: {
          path: 'your-relationship-to-applicant',
          title: 'Your relationship to applicant',
          depends: formData => get('certifierRole', formData) === 'other',
          ...certifierRelationshipSchema,
        },
      },
    },
    sponsorInformation: {
      title: 'Veteran information',
      pages: {
        page5a: {
          path: 'veteran-information-overview',
          title: 'Veteran information',
          ...sponsorIntroSchema,
        },
        page6: {
          path: 'veteran-name-and-date-of-birth',
          title: 'Veteran’s name and date of birth',
          ...sponsorNameDobSchema,
        },
        page7: {
          path: 'veteran-social-security-number',
          title: `Veteran’s identification information`,
          ...sponsorIdentificationSchema,
        },
        page8: {
          path: 'veteran-life-status',
          title: 'Veteran’s status',
          depends: formData => get('certifierRole', formData) !== 'sponsor',
          ...sponsorStatus,
        },
        page9: {
          path: 'veteran-death-information',
          title: 'Veteran’s status details',
          depends: formData =>
            get('certifierRole', formData) !== 'sponsor' &&
            get('sponsorIsDeceased', formData),
          ...sponsorStatusDetails,
        },
        page10b0: {
          path: 'veteran-address',
          title: 'Veteran’s address',
          depends: formData =>
            !get('sponsorIsDeceased', formData) &&
            get('certifierRole', formData) !== 'sponsor' &&
            get('street', formData?.certifierAddress),
          CustomPage: props => {
            const opts = { ...props, dataKey: 'sponsorAddress' };
            return AddressSelectionPage(opts);
          },
          CustomPageReview: AddressSelectionReviewPage,
          uiSchema: {},
          schema: blankSchema,
        },
        page10: {
          path: 'veteran-mailing-address',
          title: 'Veteran’s mailing address',
          depends: formData =>
            !get('sponsorIsDeceased', formData) &&
            get('view:sharesAddressWith', formData) === NOT_SHARED,
          ...sponsorAddress,
        },
        page11: {
          path: 'veteran-contact-information',
          title: 'Veteran’s contact information',
          depends: formData => !get('sponsorIsDeceased', formData),
          ...sponsorContactInfo,
        },
      },
    },
    applicantInformation: {
      title: 'Applicant information',
      pages: applicantPages,
    },
    medicareInformation: {
      title: 'Other Health Insurance Certification: Medicare information',
      pages: {
        ohiIntro: {
          path: 'medicare-and-other-health-insurance',
          title: 'Report Medicare and other health insurance',
          ...ohiIntroduction,
        },
        medicareIntro: {
          path: 'report-medicare',
          title: 'Report Medicare',
          ...medicareIntroduction,
        },
        ...medicarePages,
        page22: medicareStatusPage,
        page23: medicareProofOfIneligibilityPage,
      },
    },
    healthInsuranceInformation: {
      title:
        'Other Health Insurance Certification: Health insurance information',
      pages: {
        healthInsuranceIntro: {
          path: 'report-other-health-insurance',
          title: 'Report other health insurance',
          ...healthInsuranceIntroduction,
        },
        ...healthInsurancePages,
      },
    },
  },
};

export default formConfig;
