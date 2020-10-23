import _ from 'lodash/fp';
import moment from 'moment';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { VA_FORM_IDS } from 'platform/forms/constants';
import manifest from '../manifest.json';
import applicantInformation from 'platform/forms/pages/applicantInformation';
import fullSchema from '../schema/5655-schema.json';
import FormFooter from 'platform/forms/components/FormFooter';
import GetFormHelp from '../components/GetFormHelp';
import preSubmitInfo from 'platform/forms/preSubmitInfo';

const { vaFileNumber } = fullSchema.properties;
const { fullName } = fullSchema.definitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'fsr-5655-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_5655,
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your [savedFormDescription] is in progress.',
    //   expired: 'Your saved [savedFormDescription] has expired. If you want to apply for [benefitType], please start a new [appType].',
    //   saved: 'Your [benefitType] [appType] has been saved.',
    // },
  },
  defaultDefinitions: {
    fullName,
  },
  title: 'Financial Status Report (5655)',
  subTitle: 'Form 5655',
  preSubmitInfo,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
        applicantInformation: _.merge(
          applicantInformation(fullSchema, {
            isVeteran: true,
            fields: [
              'veteranFullName',
              'veteranSocialSecurityNumber',
              'vaFileNumber',
              'veteranDateOfBirth',
              'myField',
            ],
            required: [
              'veteranFullName',
              'veteranSocialSecurityNumber',
              'vaFileNumber',
              'veteranDateOfBirth',
            ],
          }),
          {
            uiSchema: {
              veteranDateOfBirth: {
                'ui:validations': [
                  (errors, dob) => {
                    // If we have a complete date, check to make sure it’s a valid dob
                    if (
                      /\d{4}-\d{2}-\d{2}/.test(dob) &&
                      moment(dob).isAfter(
                        moment()
                          .endOf('day')
                          .subtract(17, 'years'),
                      )
                    ) {
                      errors.addError('You must be at least 17 to apply');
                    }
                  },
                ],
              },
              myField: {
                'ui:title': 'File Number',
              },
            },
            schema: {
              type: 'object',
              properties: {
                myField: {
                  type: 'string',
                },
                vaFileNumber,
              },
            },
          },
        ),
      },
    },
  },
};

export default formConfig;
