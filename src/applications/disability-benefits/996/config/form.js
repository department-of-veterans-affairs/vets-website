// Example of an imported schema:
import fullSchema from '../20-0996-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/20-0996-schema.json';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
// import commonDefinitions from 'vets-json-schema/dist/definitions.json';

// import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import preSubmitInfo from 'platform/forms/preSubmitInfo';
import { externalServices } from 'platform/monitoring/DowntimeNotification';

import FormFooter from '../components/FormFooter';
import GetFormHelp from '../content/GetFormHelp';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// Pages
import veteranDetailsDescription from '../pages/confirmVeteranDetails';

import contactInfo from '../pages/contactInformation';
import contestedIssuesPage from '../pages/contestedIssues';
import contestedIssueFollowup from '../pages/contestedIssueFollowup';
import officeForReview from '../pages/officeForReview';
import { contestedIssuesNotesStart } from '../content/contestedIssues';
import informalConference from '../pages/informalConference';
import optOutOfOldAppeals from '../pages/optOutOfOldAppeals';

// TODO: Mock data - remove once API is connected
import initialData from '../tests/schema/initialData';
import { errorMessages } from '../constants';
import { hasSelectedIssues } from '../helpers';

const {
  name,
  fullName,
  legacyOptInApproved,
  address,
  phone,
  date,
  effectiveDates,
  contestedIssues,
  informalConferenceChoice,
  contactRepresentativeChoice,
  representative,
  scheduleTimes,
} = fullSchema.definitions;

const formConfig = {
  urlPrefix: '/',
  // submitUrl: `${environment.API_URL}/v0/higher_level_review/submit`,
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'hlr-0996-',

  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_20_0996,
  version: 0,
  prefillEnabled: true,
  // beforeLoad: props => { console.log('form config before load', props); },
  // onFormLoaded: ({ formData, savedForms, returnUrl, formConfig, router }) => {
  //   console.log('form loaded', formData, savedForms, returnUrl, formConfig, router);
  // },
  // verifyRequiredPrefill: true,
  // prefillTransformer: (pages, formData, metadata) => {
  //   console.log('prefill transformer', pages, formData, metadata);
  //   return { pages, formData, metadata };
  // },
  savedFormMessages: {
    notFound: errorMessages.savedFormNotFound,
    noAuth: errorMessages.savedFormNoAuth,
  },
  title: 'Request a Higher-Level Review',
  subTitle: 'VA Form 20-0996',
  defaultDefinitions: {
    name,
    fullName,
    legacyOptInApproved,
    address,
    phone,
    date,
    effectiveDates,
    contestedIssues,
    informalConferenceChoice,
    contactRepresentativeChoice,
    representative,
    scheduleTimes,
    veteranDetailsDescription,
  },
  preSubmitInfo,
  downtime: {
    dependencies: [externalServices.global],
  },
  chapters: {
    step1: {
      title: 'Veteran details',
      pages: {
        // Added this as the first step of the form, but the progress bar & step
        // 1 of 4 header are hidden using CSS; also the footer is placed. Done
        // to match the design.
        optOutOfOldAppeals: {
          title: ' ',
          path: 'opt-out-of-old-appeals',
          uiSchema: optOutOfOldAppeals.uiSchema,
          schema: optOutOfOldAppeals.schema,
          initialData,
        },
        confirmVeteranDetails: {
          title: 'Confirm Veteran details',
          path: 'veteran-details',
          uiSchema: {
            'ui:description': veteranDetailsDescription,
          },
          schema: {
            type: 'object',
            properties: {},
          },
          initialData,
        },
        confirmContactInformation: {
          title: 'Contact information',
          path: 'contact-information',
          uiSchema: contactInfo.uiSchema,
          schema: contactInfo.schema,
          initialData,
        },
      },
    },
    contestedIssues: {
      title: 'Contested issues',
      pages: {
        contestedIssues: {
          title: ' ',
          path: 'contested-issues',
          uiSchema: contestedIssuesPage.uiSchema,
          schema: contestedIssuesPage.schema,
          initialData,
        },
        'view:contestedIssueFollowupStart': {
          title: ' ',
          path: 'contested-issues/start',
          uiSchema: {
            'ui:description': contestedIssuesNotesStart,
          },
          schema: {
            type: 'object',
            properties: {},
          },
        },
        'view:contestedIssueFollowup': {
          title: item => item?.name,
          path: 'contested-issues/:index',
          depends: () => hasSelectedIssues,
          showPagePerItem: true,
          itemFilter: item => item?.['view:selected'],
          arrayPath: 'contestedIssues',
          uiSchema: contestedIssueFollowup.uiSchema,
          schema: contestedIssueFollowup.schema,
          initialData,
        },
      },
    },
    officeForReview: {
      title: 'Office for review',
      pages: {
        sameOffice: {
          title: ' ',
          path: 'office-for-review',
          uiSchema: officeForReview.uiSchema,
          schema: officeForReview.schema,
        },
      },
    },
    informalConference: {
      title: 'Request an informal conference',
      pages: {
        requestConference: {
          path: 'request-informal-conference',
          title: 'Request an informal conference',
          uiSchema: informalConference.uiSchema,
          schema: informalConference.schema,
          initialData,
        },
      },
    },
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp,
};

export default formConfig;
