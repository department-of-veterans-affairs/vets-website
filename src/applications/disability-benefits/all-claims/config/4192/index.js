import _ from 'lodash';

import {
  instructionalPart1,
  instructionalPart2,
  instructionalPart3,
  pastEmploymentFormDownload,
  pastEmploymentFormIntro,
  pastEmploymentFormUpload,
} from '../../pages';

import captureEvents from '../../analytics-functions';

import { needsToEnterUnemployability } from '../../utils';

const showFormTutorial = formData =>
  _.get(formData, 'view:upload4192Choice.view:4192Info', false);

const isDownloading = formData =>
  _.get(formData, 'view:upload4192Choice.view:download4192', false) &&
  needsToEnterUnemployability(formData);

const isUploading = formData =>
  _.get(formData, 'view:upload4192Choice.view:upload4192', false) &&
  needsToEnterUnemployability(formData);

// const isExiting = formData => _.get(formData, 'view:upload4192Choice.view:sendRequests', false);

export default {
  // Intro
  pastEmploymentFormIntro: {
    path: 'past-employment-walkthrough-choice',
    depends: needsToEnterUnemployability,
    uiSchema: pastEmploymentFormIntro.uiSchema,
    schema: pastEmploymentFormIntro.schema,
    onContinue: captureEvents.pastEmploymentFormIntro,
  },
  // Form Tutorial (multiple pages)
  instructionalPart1: {
    path: '4192-instructions-part-1',
    depends: showFormTutorial,
    uiSchema: instructionalPart1.uiSchema,
    schema: instructionalPart1.schema,
  },
  instructionalPart2: {
    path: '4192-instructions-part-2',
    depends: showFormTutorial,
    uiSchema: instructionalPart2.uiSchema,
    schema: instructionalPart2.schema,
  },
  instructionalPart3: {
    path: '4192-instructions-part-3',
    depends: showFormTutorial,
    uiSchema: instructionalPart3.uiSchema,
    schema: instructionalPart3.schema,
  },
  // Download
  pastEmploymentFormDownload: {
    path: 'past-employment-download',
    depends: isDownloading,
    uiSchema: pastEmploymentFormDownload.uiSchema,
    schema: pastEmploymentFormDownload.schema,
  },
  // Upload
  pastEmploymentFormUpload: {
    path: 'past-employment-form-upload',
    depends: isUploading,
    uiSchema: pastEmploymentFormUpload.uiSchema,
    schema: pastEmploymentFormUpload.schema,
  },
  // ***Below page comments for when logic is added in***
  // Conditional Options (Intro page again if A and not A && B && C)
  // Form Tutorial (multiple pages)
  // Download
  // Upload
  // Conditional Options (Intro page again if A and not A && B && C)
  // Form Tutorial (multiple pages)
  // Download
  // Upload
  // Conditional Options (Intro page again if A and not A && B && C)
  // ***Above page comments for when logic is added in***
  // Exit
  conclusion4192: {
    title: 'Conclusion 4192',
    path: 'disabilities/conclusion-4192',
    depends: needsToEnterUnemployability,
    uiSchema: {
      'ui:title': ' ',
      'ui:description':
        'Thank you for taking the time to answer our questions. The information you provided will help us process your claim.',
    },
    schema: {
      type: 'object',
      properties: {},
    },
  },
};
