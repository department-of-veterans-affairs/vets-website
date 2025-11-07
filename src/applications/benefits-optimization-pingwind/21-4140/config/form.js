import environment from 'platform/utilities/environment';

import footerContent from 'platform/forms/components/FormFooter';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';

import PreSectionOnePage from '../containers/PreSectionOnePage';
import RequiredInformationPage from '../containers/RequiredInformationPage';
import BeforeYouBeginPage from '../containers/BeforeYouBeginPage';
import WhatYouNeedPage from '../containers/WhatYouNeedPage';

import SectionOnePage from '../containers/SectionOnePage';
import EmploymentCheckPage from '../containers/EmploymentCheckPage';
import EmploymentCheckReview from '../containers/EmploymentCheckReview';
import SectionThreePage from '../containers/SectionThreePage';

import ConfirmationPage from '../containers/ConfirmationPage';
import getHelp from '../../shared/components/GetFormHelp';
import transformForSubmit from './submit-transformer';

import personalInformation1 from '../pages/personalInformation1';
import contactInformation1 from '../pages/contactInformation1';

import sectionTwo from '../pages/sectionTwo';

import sectionTwoSignature from '../pages/sectionTwoSignature';
import sectionThreeSignature from '../pages/sectionThreeSignature';

import {
  shouldShowEmploymentSection,
  shouldShowUnemploymentSection,
} from '../utils/employment';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/employment_questionnaires/v0/form4140`,
  trackingPrefix: 'ss-4140-',
  dev: {
    collapsibleNavLinks: true,
    showNavLinks: true,
  },
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      fullNamePath: 'veteran.fullName',
    },
  },
  formId: '21-4140',
  saveInProgress: {
    messages: {
      inProgress:
        'Your authorization to release non-VA medical information to VA (21-4140) is in progress.',
      expired: 'Your saved employment questionnaire (21-4140) has expired.',
      saved: 'Your employment questionnaire has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  transformForSubmit,
  savedFormMessages: {
    notFound: 'Please start over to complete your employment questionnaire.',
    noAuth: 'Please sign in again to continue your employment questionnaire',
  },
  hideUnauthedStartLink: true,
  title: 'Employee Questionnaire for VA Disability Benefits',
  subTitle:
    'Please take your time to complete this form as accurately as you can.',
  customText: {
    appType: 'employment questionnaire',
    reviewPageTitle: 'Review your questionnaire',
  },
  defaultDefinitions: {},
  additionalRoutes: [
    {
      path: 'form-verification',
      pageKey: 'form-verification',
      component: PreSectionOnePage,
      depends: () => true,
    },
    {
      path: 'required-information',
      pageKey: 'required-information',
      component: RequiredInformationPage,
      depends: () => true,
    },
    {
      path: 'before-you-begin',
      pageKey: 'before-you-begin',
      component: BeforeYouBeginPage,
      depends: () => true,
    },
    {
      path: 'what-you-need',
      pageKey: 'what-you-need',
      component: WhatYouNeedPage,
      depends: () => true,
    },
  ],
  chapters: {
    personalAndContactInformation: {
      title: 'Personal and contact information',
      pages: {
        sectionOneIntro: {
          path: 'section-one',
          title: 'Section 1 introduction',
          CustomPage: SectionOnePage,
          CustomPageReview: null,
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {},
          },
        },
        personalInformation1: {
          path: 'personal-information-1',
          title: 'Personal Information',
          uiSchema: personalInformation1.uiSchema,
          schema: personalInformation1.schema,
        },
        contactInformation1: {
          path: 'contact-information-1',
          title: 'Contact Information',
          uiSchema: contactInformation1.uiSchema,
          schema: contactInformation1.schema,
        },
      },
    },
    employmentInformation: {
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
        // Spread the array builder pages for employers
        ...Object.fromEntries(
          Object.entries(sectionTwo).map(([key, page]) => [
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
        sectionTwoSignature: {
          path: 'section-2-signature',
          title: 'Section 2 – Certification Signature',
          uiSchema: sectionTwoSignature.uiSchema,
          schema: sectionTwoSignature.schema,
          depends: shouldShowEmploymentSection,
        },
      },
    },
    unemploymentCertification: {
      title: 'Unemployment certification',
      pages: {
        sectionThreeIntro: {
          path: 'section-three',
          title: 'Section 3 introduction',
          CustomPage: SectionThreePage,
          CustomPageReview: null,
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {},
          },
          depends: shouldShowUnemploymentSection,
        },
        sectionThreeSignature: {
          path: 'section-3-signature',
          title: 'Section 3 – Certification Signature',
          uiSchema: sectionThreeSignature.uiSchema,
          schema: sectionThreeSignature.schema,
          depends: shouldShowUnemploymentSection,
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
