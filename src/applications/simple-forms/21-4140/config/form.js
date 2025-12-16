// @ts-check
import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import transformForSubmit from '../../shared/config/submit-transformer';
import getHelp from '../../shared/components/GetFormHelp';

import nameAndDateOfBirth from '../pages/nameAndDateOfBirth';
import identificationInformation from '../pages/identificationInformation';
import address from '../pages/address';
import phoneAndEmailAddress from '../pages/phoneAndEmailAddress';
import { employersPages } from '../pages/employers';
import EmploymentCheckPage from '../containers/EmploymentCheckPage';
import EmploymentCheckReview from '../containers/EmploymentCheckReview';
import {
  shouldShowEmploymentSection,
  shouldShowUnemploymentSection,
} from '../utils/employment';

import employed from '../pages/employed';
import unemployed from '../pages/unemployed';
import evidence from '../pages/evidence';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/simple_forms_api/v1/simple_forms`,
  trackingPrefix: '21-4140-income-verification-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  transformForSubmit,
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate has been represented correctly.',
      fullNamePath: 'fullName',
    },
  },
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
    disableWindowUnloadInCI: true,
  },
  formId: VA_FORM_IDS.FORM_21_4140,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your Employment Questionnaire (VA Form 21-4140) application (21-4140) is in progress.',
    //   expired: 'Your saved Employment Questionnaire (VA Form 21-4140) application (21-4140) has expired. If you want to apply for Employment Questionnaire (VA Form 21-4140), please start a new application.',
    //   saved: 'Your Employment Questionnaire (VA Form 21-4140) application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for Employment Questionnaire (VA Form 21-4140).',
    noAuth:
      'Please sign in again to continue your application for Employment Questionnaire (VA Form 21-4140).',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    personalInformationChapter: {
      title: 'Your personal information',
      pages: {
        nameAndDateOfBirth: {
          path: 'name-and-date-of-birth',
          title: 'Your name and date of birth',
          uiSchema: nameAndDateOfBirth.uiSchema,
          schema: nameAndDateOfBirth.schema,
        },
      },
    },
    identificationInformationChapter: {
      title: 'Your identification information',
      pages: {
        identificationInformation: {
          path: 'identification-information',
          title: 'Your identification information Numbers',
          uiSchema: identificationInformation.uiSchema,
          schema: identificationInformation.schema,
        },
      },
    },
    mailingInformationChapter: {
      title: 'Your mailing information',
      pages: {
        address: {
          path: 'address',
          title: 'Your mailing address',
          uiSchema: address.uiSchema,
          schema: address.schema,
        },
      },
    },
    contactInformationChapter: {
      title: 'Your contact information',
      pages: {
        phoneAndEmailAddress: {
          path: 'phone-and-email-address',
          title: 'Your phone and email address',
          uiSchema: phoneAndEmailAddress.uiSchema,
          schema: phoneAndEmailAddress.schema,
        },
      },
    },
    employmentChapter: {
      title: 'Employment information',
      pages: {
        employmentCheck: {
          path: 'employment-check',
          title: 'Employment in the past 12 months',
          CustomPage: EmploymentCheckPage,
          CustomPageReview: EmploymentCheckReview,
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {},
          },
        },
        ...Object.fromEntries(
          Object.entries(employersPages).map(([key, page]) => [
            key,
            {
              ...page,
              depends: formData => {
                if (!shouldShowEmploymentSection(formData)) {
                  return false;
                }
                if (typeof page.depends === 'function') {
                  return page.depends(formData);
                }
                return true;
              },
            },
          ]),
        ),

        employed: {
          path: 'employed',
          title: 'Employed',
          uiSchema: employed.uiSchema,
          schema: employed.schema,
          depends: shouldShowEmploymentSection,
        },

        unemployed: {
          path: 'unemployed',
          title: 'Unemployed',
          uiSchema: unemployed.uiSchema,
          schema: unemployed.schema,
          depends: shouldShowUnemploymentSection,
        },
      },
    },

    evidenceChapter: {
      title: 'Evidence',
      pages: {
        evidence: {
          path: 'evidence',
          title: 'Upload your supporting evidence',
          uiSchema: evidence.uiSchema,
          schema: evidence.schema,
        },
      },
    },
  },
  getHelp,
  footerContent,
};

export default formConfig;
