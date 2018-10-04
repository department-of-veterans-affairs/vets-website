// import _ from 'lodash/fp';

// Example of an imported schema:
// import fullSchema from '../21-0781-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

import { introductionText } from '../helpers';

// Define all the fields in the form to aid reuse
// const formFields = {};

import {
  ptsdType,
  ptsdChoice,
  ptsdSecondaryChoice,
  uploadPtsd,
  uploadPtsdSecondary,
  stressfulIncSecDesc,
  otherSourcesSecondary,
} from '../pages';

const formConfig = {
  urlPrefix: '/',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'ptsd-0781-0781a-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '1234',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  title: 'Apply for increased disability compensation',
  chapters: {
    introductionPage: {
      title: 'Disability Details',
      pages: {
        ptsdIntroduction: {
          'ui:title': '',
          path: 'info',
          uiSchema: {
            'ui:description': introductionText,
          },
          schema: {
            type: 'object',
            properties: {},
          },
        },
        ptsdType: {
          path: 'ptsdType',
          title: 'Disability Details',
          uiSchema: ptsdType.uiSchema,
          schema: ptsdType.schema,
        },
        ptsdChoice: {
          path: 'ptsdChoice',
          title: 'Disability Details',
          depends: form =>
            form['view:selectablePtsdTypes']['view:combatPtsdType'] ||
            form['view:selectablePtsdTypes']['view:noncombatPtsdType'],
          uiSchema: ptsdChoice.uiSchema,
          schema: ptsdChoice.schema,
        },
        uploadPtsd: {
          path: 'upload-781',
          title: 'Disability Details',
          depends: form =>
            form['view:uploadPtsdChoice'] === 'upload' &&
            (form['view:selectablePtsdTypes']['view:combatPtsdType'] ||
              form['view:selectablePtsdTypes']['view:noncombatPtsdType']),
          uiSchema: uploadPtsd.uiSchema,
          schema: uploadPtsd.schema,
        },
        ptsdSecondaryChoice: {
          path: 'ptsdSecondaryChoice',
          title: 'Disability Details',
          depends: form =>
            form['view:selectablePtsdTypes']['view:mstPtsdType'] ||
            form['view:selectablePtsdTypes']['view:assaultPtsdType'],
          uiSchema: ptsdSecondaryChoice.uiSchema,
          schema: ptsdSecondaryChoice.schema,
        },
        uploadPtsdSecondary: {
          path: 'upload-781a',
          title: 'Disability Details',
          depends: form =>
            form['view:uploadPtsdSecondaryChoice'] === 'upload' &&
            (form['view:selectablePtsdTypes']['view:mstPtsdType'] ||
              form['view:selectablePtsdTypes']['view:assaultPtsdType']),
          uiSchema: uploadPtsdSecondary.uiSchema,
          schema: uploadPtsdSecondary.schema,
        },
        stressfulIncidentSecondaryDescription: {
          path: 'stressful-incident-secondary-description',
          title: 'Disability Details',
          depends: form =>
            form['view:uploadPtsdSecondaryChoice'] === 'answerQuestions' &&
            (form['view:selectablePtsdTypes']['view:mstPtsdType'] ||
              form['view:selectablePtsdTypes']['view:assaultPtsdType']),
          uiSchema: stressfulIncSecDesc.uiSchema,
          schema: stressfulIncSecDesc.schema,
        },
        otherSourcesSecondary: {
          path: 'other-sources-secondary-information',
          title: 'Disability Details',
          depends: form =>
            form['view:uploadPtsdSecondaryChoice'] === 'answerQuestions' &&
            (form['view:selectablePtsdTypes']['view:mstPtsdType'] ||
              form['view:selectablePtsdTypes']['view:assaultPtsdType']),
          uiSchema: otherSourcesSecondary.uiSchema,
          schema: otherSourcesSecondary.schema,
        },
      },
    },
  },
};

export default formConfig;
