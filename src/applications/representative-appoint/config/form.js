import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import FormFooter from 'platform/forms/components/FormFooter';

import GetFormHelp from '../components/GetFormHelp';
import configService from '../utilities/configService';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { generatePDF } from '../api/generatePDF';
import { submitPOARequest } from '../api/submitPOARequest';
import PreSubmitInfo from '../containers/PreSubmitInfo';
import { selectAccreditedRepresentative } from '../pages';

// import initialData from '../tests/fixtures/data/test-data.json';
import SelectAccreditedRepresentative from '../components/SelectAccreditedRepresentative';
import SelectedAccreditedRepresentativeReview from '../components/SelectAccreditedRepresentativeReview';

import SubmissionError from '../components/SubmissionError';

// const mockData = initialData;

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

const formConfigFromService = configService.getFormConfig();

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  customText: {
    appType: 'form',
    submitButtonText: 'Continue',
  },
  submit: async form => {
    await generatePDF(form.data);

    if (form.data.representativeSubmissionMethod === 'digital') {
      await submitPOARequest(form.data);
    }

    return Promise.resolve({ attributes: { confirmationNumber: '123123123' } }); // I'm not sure what this confirmation number is about
  },
  trackingPrefix: 'appoint-a-rep-21-22-and-21-22A',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  formId: '21-22',
  preSubmitInfo: {
    CustomComponent: PreSubmitInfo,
    required: true,
  },
  submissionError: SubmissionError,
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
  additionalRoutes: [],
  savedFormMessages: {
    notFound:
      'Please start over to apply for VA accredited representative appointment.',
    noAuth:
      'Please sign in again to continue your application for VA accredited representative appointment.',
  },
  title: 'Request help from a VA accredited representative or VSO',
  subTitle: formConfigFromService.subTitle || 'VA Forms 21-22 and 21-22a',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    accreditedRepresentativeInformation: {
      title: 'Accredited representative information',
      pages: {
        selectAccreditedRepresentative: {
          title: 'Representative Select',
          path: 'representative-select',
          CustomPage: SelectAccreditedRepresentative,
          CustomPageReview: SelectedAccreditedRepresentativeReview,
          uiSchema: selectAccreditedRepresentative.uiSchema,
          schema: selectAccreditedRepresentative.schema,
        },
      },
    },
  },
};

configService.setFormConfig(formConfig);

export default formConfig;
