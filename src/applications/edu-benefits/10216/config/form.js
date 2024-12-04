// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import React from 'react';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
// Example of an imported schema:
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/22-10216-schema.json';
// import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

// import fullSchema from 'vets-json-schema/dist/22-10216-schema.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

// pages
import serviceHistory from '../pages/serviceHistory';
import { validateFacilityCode } from '../utilities';
import Alert from '../components/Alert';
import InstitutionDetails from '../pages/institutionDetails';

const { date, dateRange, usaPhone } = commonDefinitions;

const subTitle = (
  <div className="schemaform-subtitle vads-u-color--gray">
    35% Exemption Request from 85/15 Reporting Requirement (VA Form 22-10216)
  </div>
);

let isAccredited = false;
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'edu-10216-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '22-10216',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your education benefits application (22-10216) is in progress.',
    //   expired: 'Your saved education benefits application (22-10216) has expired. If you want to apply for education benefits, please start a new application.',
    //   saved: 'Your education benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to continue your application for education benefits.',
  },
  title: 'Request exemption from the 85/15 Rule reporting requirements',
  subTitle,
  defaultDefinitions: {
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    institutionDetailsChapter: {
      title: 'Institution Details',
      pages: {
        institutionDetails: {
          path: 'institution-details',
          title: 'Institution Details',
          onNavForward: async ({ formData, goPath }) => {
            isAccredited = await validateFacilityCode(formData);
            if (isAccredited) {
              goPath('/service-history');
            } else {
              goPath('/additional-form');
            }
          },
          uiSchema: InstitutionDetails.uiSchema,
          schema: InstitutionDetails.schema,
        },
        additionalErrorChapter: {
          title: 'Institution Details',
          path: 'additional-form',
          uiSchema: { 'ui:webComponentField': () => <Alert /> },
          schema: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
    serviceHistoryChapter: {
      title: 'Service History',
      pages: {
        serviceHistory: {
          path: 'service-history',
          title: 'Service History',
          uiSchema: serviceHistory.uiSchema,
          schema: serviceHistory.schema,
        },
      },
    },
  },
};

export default formConfig;
