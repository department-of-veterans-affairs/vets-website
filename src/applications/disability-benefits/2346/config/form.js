/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/2346-schema.json';
// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import { VA_FORM_IDS } from 'platform/forms/constants';
import commonSchemaDefinitions from 'vets-json-schema/dist/definitions.json';
import Schema2346 from '../2346-schema.json';
import personalInfoBox from '../components/personalInfoBox';
import { vetFields } from '../constants/';
import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';
import UIDefinitions from '../definitions/2346UI';

const { email, address } = Schema2346.definitions;
const { fullName, gender, date } = commonSchemaDefinitions;

const formChapters = {
  veteranInformation: 'Veteran Information',
};

const formPages = {
  personalDetails: 'Personal Details',
  address: 'Confirm Address',
};

const {
  addressUI,
  dateOfBirthUI,
  emailUI,
  genderUI,
  fullNameUI,
} = UIDefinitions.sharedUISchemas;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/posts',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'va-2346a-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_VA_2346A,
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  defaultDefinitions: {
    date,
    email,
    gender,
    fullName,
    address,
  },
  chapters: {
    VeteranInformationChapter: {
      title: formChapters.veteranInformation,
      pages: {
        [formPages.personalDetails]: {
          path: 'veteran-information/personal-details',
          title: formPages.personalDetails,
          uiSchema: {
            'ui:description': personalInfoBox,
            [vetFields.fullName]: fullNameUI,
            [vetFields.dateOfBirth]: dateOfBirthUI,
            [vetFields.gender]: genderUI,
          },
          schema: {
            type: 'object',
            required: [
              vetFields.fullName,
              vetFields.dateOfBirth,
              vetFields.gender,
            ],
            properties: {
              [vetFields.fullName]: fullName,
              [vetFields.dateOfBirth]: date,
              [vetFields.gender]: gender,
            },
          },
        },
        [formPages.address]: {
          path: 'veteran-information/addresses',
          title: formPages.address,
          uiSchema: {
            [vetFields.address]: addressUI,
            [vetFields.email]: emailUI,
          },
          schema: {
            type: 'object',
            required: [vetFields.address, vetFields.email],
            properties: {
              [vetFields.address]: address,
              [vetFields.email]: email,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
