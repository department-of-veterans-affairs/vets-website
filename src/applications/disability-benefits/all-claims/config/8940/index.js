import {
  hospitalizationHistory,
  unemployabilityAdditionalInformation,
  unemployabilityFormIntro,
  supplementalBenefits,
  recentEducationTraining,
  recentJobApplications,
  incomeDetails,
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
      // 8940 - Introduction
      unemployabilityFormIntro: {
        title: 'File a Claim for Individual Unemployability',
        path: 'unemployability-walkthrough-choice',
        depends: needsToEnterUnemployability,
        uiSchema: unemployabilityFormIntro.uiSchema,
        schema: unemployabilityFormIntro.schema,
      },
      // 8940 - Upload 8940
      // 8940 - Contentions
      // 8940 - Medical Care
      // 8940 - Hospital Treatment
      hospitalizationHistory: {
        title: 'Hospitalization',
        path: 'hospitalization-history',
        depends: needsToAnswerUnemployability,
        uiSchema: hospitalizationHistory.uiSchema,
        schema: hospitalizationHistory.schema,
      },
      // 8940 - Doctor Treatment
      // 8940 - Disability Dates
      // 8940 - Income Details
      incomeDetails: {
        title: 'Income details',
        path: 'unemployability-income-details',
        depends: needsToAnswerUnemployability,
        uiSchema: incomeDetails.uiSchema,
        schema: incomeDetails.schema,
      },
      // 8940 - Employment History
      // 8940 - Recent Earnings
      // 8940 - Supplementary Benefits
      supplementalBenefits: {
        title: 'Supplemental Benefits',
        path: 'supplemental-benefits',
        depends: needsToAnswerUnemployability,
        uiSchema: supplementalBenefits.uiSchema,
        schema: supplementalBenefits.schema,
      },
      // 8940 - Military Duty
      // 8940 - Job Applications
      recentJobApplications: {
        title: 'Recent job applications',
        path: 'recent-job-applications',
        depends: needsToAnswerUnemployability,
        uiSchema: recentJobApplications.uiSchema,
        schema: recentJobApplications.schema,
      },
      // 8940 - Education & Training
      // 8940 - Recent Education & Training
      recentEducationTraining: {
        title: 'Recent education & training',
        path: 'recent-education-training',
        depends: needsToAnswerUnemployability,
        uiSchema: recentEducationTraining.uiSchema,
        schema: recentEducationTraining.schema,
      },
      // 8940 - Additional Remarks
      unemployabilityAdditionalInformation: {
        title: '8940 Additional Information',
        path: 'unemployability-additional-information',
        depends: needsToAnswerUnemployability,
        uiSchema: unemployabilityAdditionalInformation.uiSchema,
        schema: unemployabilityAdditionalInformation.schema,
      },
      // 8940 - Supporting Documents
      // 8940 - Upload Supporting Docs
      // 8940 - Certification
      // 4192 -
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
