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
  individualsInvolvedChoice,
  ptsdSecondaryIncidentDate,
  ptsdSecondaryAssignmentDetails,
  ptsdSecondaryLocation,
  informationInterviewCombat,
  informationInterviewAssault,
  stressfulIncSecDesc,
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
          title: 'Disability Details',
          path: 'info',
          uiSchema: {
            'ui:description': introductionText,
          },
          schema: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
    disabilityDetails: {
      title: 'Disability Details',
      pages: {
        ptsdType: {
          title: 'PTSD Type',
          path: 'ptsdType',
          uiSchema: ptsdType.uiSchema,
          schema: ptsdType.schema,
        },
        ptsdChoice: {
          title: 'PTSD Choice',
          path: 'ptsdChoice',
          depends: form =>
            form['view:selectablePtsdTypes']['view:combatPtsdType'] ||
            form['view:selectablePtsdTypes']['view:noncombatPtsdType'],
          uiSchema: ptsdChoice.uiSchema,
          schema: ptsdChoice.schema,
        },
        individualsInvolvedChoice: {
          title: 'Individuals Involved Choice',
          path: 'individualsInvolvedChoice',
          depends: form =>
            form['view:uploadPtsdChoice'] === 'answerQuestions' &&
            (form['view:selectablePtsdTypes']['view:combatPtsdType'] ||
              form['view:selectablePtsdTypes']['view:noncombatPtsdType']),
          uiSchema: individualsInvolvedChoice.uiSchema,
          schema: individualsInvolvedChoice.schema,
        },
        uploadPtsd: {
          title: 'Upload PTSD',
          path: 'upload-781',
          depends: form =>
            form['view:uploadPtsdChoice'] === 'upload' &&
            (form['view:selectablePtsdTypes']['view:combatPtsdType'] ||
              form['view:selectablePtsdTypes']['view:noncombatPtsdType']),
          uiSchema: uploadPtsd.uiSchema,
          schema: uploadPtsd.schema,
        },
        informationInterviewCombat: {
          title: 'Information Interview Combat',
          path: 'information-781',
          depends: form =>
            form['view:uploadPtsdChoice'] === 'answerQuestions' &&
            (form['view:selectablePtsdTypes']['view:combatPtsdType'] ||
              form['view:selectablePtsdTypes']['view:noncombatPtsdType']),
          uiSchema: informationInterviewCombat.uiSchema,
          schema: informationInterviewCombat.schema,
        },
        ptsdSecondaryChoice: {
          title: 'PTSD Secondary Choice',
          path: 'ptsdSecondaryChoice',
          depends: form =>
            form['view:selectablePtsdTypes']['view:mstPtsdType'] ||
            form['view:selectablePtsdTypes']['view:assaultPtsdType'],
          uiSchema: ptsdSecondaryChoice.uiSchema,
          schema: ptsdSecondaryChoice.schema,
        },
        informationInterviewAssault: {
          title: 'Information Interview Assault',
          path: 'information-781a',
          depends: form =>
            form['view:uploadPtsdSecondaryChoice'] === 'answerQuestions' &&
            (form['view:selectablePtsdTypes']['view:mstPtsdType'] ||
              form['view:selectablePtsdTypes']['view:assaultPtsdType']),
          uiSchema: informationInterviewAssault.uiSchema,
          schema: informationInterviewAssault.schema,
        },
        ptsdSecondaryIncidentDate: {
          path: 'ptsdSecondaryIncidentDate',
          title: 'Disability Details',
          depends: form =>
            form['view:uploadPtsdSecondaryChoice'] === 'answerQuestions' &&
            (form['view:selectablePtsdTypes']['view:mstPtsdType'] ||
              form['view:selectablePtsdTypes']['view:assaultPtsdType']),
          uiSchema: ptsdSecondaryIncidentDate.uiSchema,
          schema: ptsdSecondaryIncidentDate.schema,
          properties: {
            green: true,
          },
        },
        ptsdSecondaryAssignmentDetails: {
          path: 'ptsdSecondaryAssignmentDetails',
          title: 'Disability Details',
          depends: form =>
            form['view:uploadPtsdSecondaryChoice'] === 'answerQuestions' &&
            (form['view:selectablePtsdTypes']['view:mstPtsdType'] ||
              form['view:selectablePtsdTypes']['view:assaultPtsdType']),
          uiSchema: ptsdSecondaryAssignmentDetails.uiSchema,
          schema: ptsdSecondaryAssignmentDetails.schema,
        },
        ptsdSecondaryLocation: {
          path: 'ptsdSecondaryLocation',
          title: 'Disability Details',
          depends: form =>
            form['view:uploadPtsdSecondaryChoice'] === 'answerQuestions' &&
            (form['view:selectablePtsdTypes']['view:mstPtsdType'] ||
              form['view:selectablePtsdTypes']['view:assaultPtsdType']),
          uiSchema: ptsdSecondaryLocation.uiSchema,
          schema: ptsdSecondaryLocation.schema,
        },
        uploadPtsdSecondary: {
          title: 'Upload PTSD Secondary',
          path: 'upload-781a',
          depends: form =>
            form['view:uploadPtsdSecondaryChoice'] === 'upload' &&
            (form['view:selectablePtsdTypes']['view:mstPtsdType'] ||
              form['view:selectablePtsdTypes']['view:assaultPtsdType']),
          uiSchema: uploadPtsdSecondary.uiSchema,
          schema: uploadPtsdSecondary.schema,
        },
        stressfulIncidentSecondaryDescription: {
          path: 'stressful-incident-secondary-description',
          uiSchema: stressfulIncSecDesc.uiSchema,
          schema: stressfulIncSecDesc.schema,
        },
        // medals: { //TODO: KEEP FOR NEXT STORY
        //   path: 'information-781',
        //   title: 'Disability Details',
        //   depends: form =>
        //     form['view:uploadPtsdChoice'] === 'answerQuestions' &&
        //     (form['view:selectablePtsdTypes']['view:combatPtsdType'] ||
        //       form['view:selectablePtsdTypes']['view:noncombatPtsdType']),
        //   uiSchema: {
        //     'ui:description': 'Medals or Citations',
        //   },
        //   schema: {
        //     type: 'object',
        //     properties: {},
        //   },
        // },
      },
    },
  },
};

export default formConfig;
