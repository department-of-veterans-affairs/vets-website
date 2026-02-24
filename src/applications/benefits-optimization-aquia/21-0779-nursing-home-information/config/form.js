import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import {
  SUBTITLE,
  TITLE,
} from '@bio-aquia/21-0779-nursing-home-information/constants';
import { ConfirmationPage } from '@bio-aquia/21-0779-nursing-home-information/containers/confirmation-page';
import { IntroductionPage } from '@bio-aquia/21-0779-nursing-home-information/containers/introduction-page';
import manifest from '@bio-aquia/21-0779-nursing-home-information/manifest.json';
import { transform } from '@bio-aquia/21-0779-nursing-home-information/config/transform';
import { customSubmit } from '@bio-aquia/shared/utils';
import { GetHelp } from '@bio-aquia/21-0779-nursing-home-information/components/get-help';
import { preSubmitSignatureConfig } from '@bio-aquia/21-0779-nursing-home-information/components/pre-submit-signature';
import {
  nursingOfficialInformationUiSchema,
  nursingOfficialInformationSchema,
  nursingHomeDetailsUiSchema,
  nursingHomeDetailsSchema,
  claimantQuestionUiSchema,
  claimantQuestionSchema,
  claimantPersonalInfoUiSchema,
  claimantPersonalInfoSchema,
  claimantIdentificationInfoUiSchema,
  claimantIdentificationInfoSchema,
  veteranPersonalInfoUiSchema,
  veteranPersonalInfoSchema,
  veteranIdentificationInfoUiSchema,
  veteranIdentificationInfoSchema,
  certificationLevelOfCareUiSchema,
  certificationLevelOfCareSchema,
  admissionDateUiSchema,
  admissionDateSchema,
  medicaidFacilityUiSchema,
  medicaidFacilitySchema,
  medicaidApplicationUiSchema,
  medicaidApplicationSchema,
  medicaidStatusUiSchema,
  medicaidStatusSchema,
  medicaidStartDateUiSchema,
  medicaidStartDateSchema,
  monthlyCostsUiSchema,
  monthlyCostsSchema,
} from '@bio-aquia/21-0779-nursing-home-information/pages';
import { isPatientSpouseOrParentOrChild } from '../utils';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/form210779`,
  transformForSubmit: transform,
  submit: customSubmit,
  trackingPrefix: '21-0779-nursing-home-information-',
  v3SegmentedProgressBar: true,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  footerContent,
  getHelp: GetHelp,
  preSubmitInfo: preSubmitSignatureConfig,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: VA_FORM_IDS.FORM_21_0779,
  saveInProgress: {
    messages: {
      inProgress:
        'Your nursing home information request (21-0779) is in progress.',
      expired:
        'Your saved nursing home information request (21-0779) has expired. If you want to submit your information, please start a new request.',
      saved: 'Your nursing home information request has been saved.',
    },
  },
  version: 0,
  prefillEnabled: false,
  savedFormMessages: {},
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    nursingOfficialPersonalChapter: {
      title: 'Your personal information',
      pages: {
        nursingOfficialInformation: {
          path: 'nursing-official-information',
          title: 'Nursing home official personal information',
          uiSchema: nursingOfficialInformationUiSchema,
          schema: nursingOfficialInformationSchema,
        },
      },
    },
    nursingHomeChapter: {
      title: 'Nursing home information',
      pages: {
        nursingHomeDetails: {
          path: 'nursing-home-details',
          title: 'Nursing home facility details',
          uiSchema: nursingHomeDetailsUiSchema,
          schema: nursingHomeDetailsSchema,
        },
      },
    },
    patientInformationChapter: {
      title: 'Patient information',
      pages: {
        claimantQuestion: {
          path: 'claimant-question',
          title: 'Patient information',
          uiSchema: claimantQuestionUiSchema,
          schema: claimantQuestionSchema,
        },
        claimantPersonalInfo: {
          path: 'claimant-personal-info',
          title: 'Claimant personal information',
          uiSchema: claimantPersonalInfoUiSchema,
          schema: claimantPersonalInfoSchema,
          depends: isPatientSpouseOrParentOrChild,
        },
        claimantIdentificationInfo: {
          path: 'claimant-identification-info',
          title: 'Claimant identification',
          uiSchema: claimantIdentificationInfoUiSchema,
          schema: claimantIdentificationInfoSchema,
          depends: isPatientSpouseOrParentOrChild,
        },
        veteranPersonalInfo: {
          path: 'veteran-personal-info',
          title: 'Veteran personal information',
          uiSchema: veteranPersonalInfoUiSchema,
          schema: veteranPersonalInfoSchema,
        },
        veteranIdentificationInfo: {
          path: 'veteran-identification-info',
          title: 'Veteran identification',
          uiSchema: veteranIdentificationInfoUiSchema,
          schema: veteranIdentificationInfoSchema,
        },
      },
    },
    levelOfCareChapter: {
      title: 'Level of care',
      pages: {
        certificationLevelOfCare: {
          path: 'certification-level-of-care',
          title: 'Level of care certification',
          uiSchema: certificationLevelOfCareUiSchema,
          schema: certificationLevelOfCareSchema,
        },
        admissionDate: {
          path: 'admission-date',
          title: 'Date of admission',
          uiSchema: admissionDateUiSchema,
          schema: admissionDateSchema,
        },
      },
    },
    medicaidChapter: {
      title: 'Medicaid',
      pages: {
        medicaidFacility: {
          path: 'medicaid-facility',
          title: 'Medicaid facility status',
          uiSchema: medicaidFacilityUiSchema,
          schema: medicaidFacilitySchema,
        },
        medicaidApplication: {
          path: 'medicaid-application',
          title: 'Medicaid application status',
          uiSchema: medicaidApplicationUiSchema,
          schema: medicaidApplicationSchema,
        },
        medicaidStatus: {
          path: 'medicaid-status',
          title: 'Medicaid status',
          uiSchema: medicaidStatusUiSchema,
          schema: medicaidStatusSchema,
        },
        medicaidStartDate: {
          path: 'medicaid-start-date',
          title: 'Medicaid start date',
          uiSchema: medicaidStartDateUiSchema,
          schema: medicaidStartDateSchema,
          depends: formData =>
            formData?.medicaidStatus?.currentlyCoveredByMedicaid === true,
        },
      },
    },
    costsChapter: {
      title: 'Cost information',
      pages: {
        monthlyCosts: {
          path: 'monthly-costs',
          title: 'Monthly costs',
          uiSchema: monthlyCostsUiSchema,
          schema: monthlyCostsSchema,
        },
      },
    },
  },
};

export default formConfig;
export { formConfig };
