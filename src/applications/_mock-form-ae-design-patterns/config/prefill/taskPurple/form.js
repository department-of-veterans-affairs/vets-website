import profileContactInfo from 'platform/forms-system/src/js/definitions/profileContactInfo';
// import emailUI from 'platform/forms-system/src/js/definitions/email';
// import fullSchema from 'vets-json-schema/dist/FEEDBACK-TOOL-schema.json';
// import phoneUI from 'platform/forms-system/src/js/definitions/phone';
// import initialData from '../tests/fixtures/data/test-data.json';
// import contactInformation1 from '../pages/contactInformation1';

import { VA_FORM_IDS } from 'platform/forms/constants';
import manifest from '../../../manifest.json';

import IntroductionPage from '../../../containers/IntroductionPage1010ezr';
import ConfirmationPage from '../../../containers/ConfirmationPage';
import applicantInformation from '../../../pages/applicantInformation';
import contactInfoSettings from '../../../pages/contactInfoSettings';
import VeteranProfileInformation from '../../../components/FormPages/VeteranProfileInformation';
import { VIEW_FIELD_SCHEMA } from '../../../utils/constants';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/task-purple/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '_mock-form-ae-design-patterns-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_MOCK_AE_DESIGN_PATTERNS,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your mock form ae design patterns benefits application (00-1234) is in progress.',
    //   expired: 'Your saved mock form ae design patterns benefits application (00-1234) has expired. If you want to apply for mock form ae design patterns benefits, please start a new application.',
    //   saved: 'Your mock form ae design patterns benefits application has been saved.',
    // },
  },
  version: 0,
  prefillTransformer(pages, formData, metadata) {
    // console.log({ formData });

    const transformedData = {
      veteranSocialSecurityNumber:
        formData?.data?.attributes?.veteran?.ssn || null,
    };
    return {
      metadata,
      formData: transformedData,
      pages,
    };
  },
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for mock form ae design patterns benefits.',
    noAuth:
      'Please sign in again to continue your application for mock form ae design patterns benefits.',
  },
  title: 'Prefill Task Yellow',
  defaultDefinitions: {},
  chapters: {
    veteranInformation: {
      title: 'Veteran information',
      pages: {
        profileInformation: {
          path: 'veteran-information/personal-information',
          title: 'Veteran\u2019s personal information',
          CustomPage: VeteranProfileInformation,
          CustomPageReview: null,
          uiSchema: {},
          schema: VIEW_FIELD_SCHEMA,
        },
      },
    },
    applicantInformationChapter: {
      title: 'Chapter Title: Applicant Information',
      pages: {
        applicantInformation: {
          path: 'applicant-information',
          title: 'Section Title: Applicant Information',
          uiSchema: applicantInformation.uiSchema,
          schema: applicantInformation.schema,
          initialData: {},
        },
      },
    },
    contactInfo: {
      title: 'Contact info',
      pages: {
        contactInfoSettings: {
          title: 'Section Title: Required contact info',
          path: 'contact-info-required',
          uiSchema: contactInfoSettings.uiSchema,
          schema: contactInfoSettings.schema,
        },
        ...profileContactInfo({
          contactInfoPageKey: 'confirmContactInfo3',
          contactPath: 'contact-info-with-home-phone',
          contactInfoRequiredKeys: ['mailingAddress', 'email', 'homePhone'],
          included: ['homePhone', 'mailingAddress', 'email'],
          depends: formData => formData.contactInfoSettings === 'home',
        }),
      },
    },
  },
};

export default formConfig;
