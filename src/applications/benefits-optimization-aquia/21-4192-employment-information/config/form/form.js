/**
 * @module config/form
 * @description Main form configuration for VA Form 21-4192 - Request for Employment Information
 * in Connection with Claim for Disability Benefits
 */

import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import {
  TITLE,
  SUBTITLE,
} from '@bio-aquia/21-4192-employment-information/constants';
import { ConfirmationPage } from '@bio-aquia/21-4192-employment-information/containers/confirmation-page';
import { IntroductionPage } from '@bio-aquia/21-4192-employment-information/containers/introduction-page';
import { GetHelp } from '@bio-aquia/21-4192-employment-information/components/get-help';
import { transformForSubmit } from '@bio-aquia/21-4192-employment-information/config/submit-transformer';
import { PreSubmitInfo } from '@bio-aquia/21-4192-employment-information/components/pre-submit-info';
import manifest from '@bio-aquia/21-4192-employment-information/manifest.json';

// Import page configurations (uiSchema and schema)
import {
  veteranInformationUiSchema,
  veteranInformationSchema,
  veteranContactInformationUiSchema,
  veteranContactInformationSchema,
  employerInformationUiSchema,
  employerInformationSchema,
  employmentDatesUiSchema,
  employmentDatesSchema,
  employmentEarningsHoursUiSchema,
  employmentEarningsHoursSchema,
  employmentConcessionsUiSchema,
  employmentConcessionsSchema,
  employmentTerminationUiSchema,
  employmentTerminationSchema,
  employmentLastPaymentUiSchema,
  employmentLastPaymentSchema,
  dutyStatusUiSchema,
  dutyStatusSchema,
  dutyStatusDetailsUiSchema,
  dutyStatusDetailsSchema,
  benefitsInformationUiSchema,
  benefitsInformationSchema,
  benefitsDetailsUiSchema,
  benefitsDetailsSchema,
  remarksUiSchema,
  remarksSchema,
} from '../../pages';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/form214192`,
  transformForSubmit,
  trackingPrefix: '21-4192-employment-information-',
  v3SegmentedProgressBar: true,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  footerContent,
  getHelp: GetHelp,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: VA_FORM_IDS.FORM_21_4192,
  saveInProgress: {
    messages: {
      inProgress: 'Your employment information form (21-4192) is in progress.',
      expired:
        'Your saved employment information form (21-4192) has expired. If you want to submit your information, please start a new form.',
      saved: 'Your employment information form has been saved.',
    },
  },
  version: 0,
  prefillEnabled: false,
  savedFormMessages: {
    notFound: 'Please start over to submit your employment information.',
    noAuth: 'Please sign in again to continue your form.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  // Custom PreSubmitInfo component disables signature name matching validation
  // Validates basic name format (letters including accented/international characters,
  // spaces, hyphens, apostrophes, periods) but does NOT require exact match to veteran's name
  preSubmitInfo: {
    required: true,
    CustomComponent: PreSubmitInfo,
  },
  chapters: {
    veteranInformationChapter: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          path: 'veteran-information',
          title: 'Veteran Information',
          uiSchema: veteranInformationUiSchema,
          schema: veteranInformationSchema,
        },
        veteranContactInformation: {
          path: 'veteran-contact-information',
          title: 'Veteran Contact Information',
          uiSchema: veteranContactInformationUiSchema,
          schema: veteranContactInformationSchema,
        },
      },
    },
    employerInformationChapter: {
      title: "Employer's Information",
      pages: {
        employerInformation: {
          path: 'employer-information',
          title: "Employer's Information",
          uiSchema: employerInformationUiSchema,
          schema: employerInformationSchema,
        },
      },
    },
    employmentInformationChapter: {
      title: 'Employment Information',
      pages: {
        employmentDates: {
          path: 'employment-dates',
          title: 'Employment Dates',
          uiSchema: employmentDatesUiSchema,
          schema: employmentDatesSchema,
        },
        employmentEarningsHours: {
          path: 'employment-earnings-hours',
          title: 'Employment Earnings and Hours',
          uiSchema: employmentEarningsHoursUiSchema,
          schema: employmentEarningsHoursSchema,
        },
        employmentConcessions: {
          path: 'employment-concessions',
          title: 'Employment Concessions',
          uiSchema: employmentConcessionsUiSchema,
          schema: employmentConcessionsSchema,
        },
        employmentTermination: {
          path: 'employment-termination',
          title: 'Employment Termination',
          uiSchema: employmentTerminationUiSchema,
          schema: employmentTerminationSchema,
          depends: formData => !!formData?.employmentDates?.endingDate,
        },
        employmentLastPayment: {
          path: 'employment-last-payment',
          title: 'Employment Last Payment',
          uiSchema: employmentLastPaymentUiSchema,
          schema: employmentLastPaymentSchema,
          depends: formData => !!formData?.employmentDates?.endingDate,
        },
      },
    },
    dutyStatusChapter: {
      title: 'Duty Status',
      pages: {
        dutyStatus: {
          path: 'duty-status',
          title: 'Duty Status',
          uiSchema: dutyStatusUiSchema,
          schema: dutyStatusSchema,
        },
        dutyStatusDetails: {
          path: 'duty-status-details',
          title: 'Duty Status Details',
          uiSchema: dutyStatusDetailsUiSchema,
          schema: dutyStatusDetailsSchema,
          depends: formData =>
            formData?.dutyStatus?.reserveOrGuardStatus === true,
        },
      },
    },
    benefitsInformationChapter: {
      title: 'Benefits Information',
      pages: {
        benefitsInformation: {
          path: 'benefits-information',
          title: 'Benefits Information',
          uiSchema: benefitsInformationUiSchema,
          schema: benefitsInformationSchema,
        },
        benefitsDetails: {
          path: 'benefits-details',
          title: 'Benefits Details',
          uiSchema: benefitsDetailsUiSchema,
          schema: benefitsDetailsSchema,
          depends: formData =>
            formData?.benefitsInformation?.benefitEntitlement === true,
        },
      },
    },
    remarksChapter: {
      title: 'Remarks',
      pages: {
        remarks: {
          path: 'remarks',
          title: 'Remarks',
          uiSchema: remarksUiSchema,
          schema: remarksSchema,
        },
      },
    },
  },
};

export default formConfig;
