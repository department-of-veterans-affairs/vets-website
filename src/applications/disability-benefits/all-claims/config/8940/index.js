import {
  hospitalizationHistory,
  unemployabilityAdditionalInformation,
  unemployabilityFormIntro,
  supplementalBenefits,
  uploadUnemployabilitySupportingDocuments,
  uploadUnemployabilitySupportingDocumentsChoice,
} from '../../pages';
import environment from '../../../../../platform/utilities/environment';

import {
  needsToEnterUnemployability,
  needsToAnswerUnemployability,
} from '../../utils';

export default function() {
  let configObj = {};
  if (!environment.isProduction()) {
    configObj = {
      unemployabilityFormIntro: {
        title: 'File a Claim for Individual Unemployability',
        path: 'unemployability-walkthrough-choice',
        depends: needsToEnterUnemployability,
        uiSchema: unemployabilityFormIntro.uiSchema,
        schema: unemployabilityFormIntro.schema,
      },
      hospitalizationHistory: {
        title: 'Hospitalization',
        path: 'hospitalization-history',
        depends: needsToAnswerUnemployability,
        uiSchema: hospitalizationHistory.uiSchema,
        schema: hospitalizationHistory.schema,
      },
      supplementalBenefits: {
        title: 'Supplemental Benefits',
        path: 'supplemental-benefits',
        depends: needsToAnswerUnemployability,
        uiSchema: supplementalBenefits.uiSchema,
        schema: supplementalBenefits.schema,
      },
      unemployabilityAdditionalInformation: {
        title: '8940 Additional Information',
        path: 'unemployability-additional-information',
        depends: needsToAnswerUnemployability,
        uiSchema: unemployabilityAdditionalInformation.uiSchema,
        schema: unemployabilityAdditionalInformation.schema,
      },
      uploadUnemployabilitySupportingDocumentsChoice: {
        title: 'Supporting documents',
        path: 'upload-unemployability-supporting-documents-choice',
        depends: formData =>
          formData['view:unemployabilityUploadChoice'] === 'answerQuestions',
        uiSchema: uploadUnemployabilitySupportingDocumentsChoice.uiSchema,
        schema: uploadUnemployabilitySupportingDocumentsChoice.schema,
      },
      uploadUnemployabilitySupportingDocuments: {
        title: 'Upload supporting documents',
        path: 'upload-unemployability-supporting-documents',
        depends: formData =>
          formData['view:unemployabilityUploadChoice'] === 'answerQuestions' &&
          formData['view:uploadUnemployabilitySupportingDocumentsChoice'],
        uiSchema: uploadUnemployabilitySupportingDocuments.uiSchema,
        schema: uploadUnemployabilitySupportingDocuments.schema,
      },
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
  }
  return configObj;
}
