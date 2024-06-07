import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import configService from '../utilities/configService';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { authorizeMedical, authorizeMedicalSelect } from '../pages';

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

const formConfigFromService = configService.getFormConfig();

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'appoint-a-rep-21-22-and-21-22A',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-22-AND-21-22A',
  saveInProgress: {
    messages: {
      inProgress:
        'Your VA accredited representative appointment application (21-22-AND-21-22A) is in progress.',
      expired:
        'Your saved VA accredited representative appointment application (21-22-AND-21-22A) has expired. If you want to apply for VA accredited representative appointment, please start a new application.',
      saved:
        'Your VA accredited representative appointment application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  v3SegmentedProgressBar: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for VA accredited representative appointment.',
    noAuth:
      'Please sign in again to continue your application for VA accredited representative appointment.',
  },
  title: 'Fill out your form to appoint a VA accredited representative or VSO',
  subTitle: formConfigFromService.subTitle || 'VA Form 21-22',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    authorization: {
      title: 'Accredited representative authorizations',
      pages: {
        authorizeMedical: {
          path: 'authorize-medical',
          title: 'Authorization for Certain Medical Records',
          uiSchema: authorizeMedical.uiSchema,
          schema: authorizeMedical.schema,
        },
        authorizeMedicalSelect: {
          path: 'authorize-medical/select',
          depends: formData => {
            return (
              formData.authorizationRadio ===
              'Yes, but they can only access some of these types of records'
            );
          },
          title: 'Authorization for Certain Medical Records - Select',
          uiSchema: authorizeMedicalSelect.uiSchema,
          schema: authorizeMedicalSelect.schema,
        },
      },
    },
  },
};

configService.setFormConfig(formConfig);

export default formConfig;
