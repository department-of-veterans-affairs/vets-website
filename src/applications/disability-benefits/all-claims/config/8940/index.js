import {
  hospitalizationHistory,
  unemployabilityAdditionalInformation,
  unemployabilityFormIntro,
  supplementalBenefits,
  uploadUnemployabilitySupportingDocuments,
  uploadUnemployabilitySupportingDocumentsChoice,
  unemployabilityDisabilities,
  unemployabilityCertification,
  pastEducationTraining,
  militaryDutyImpact,
  recentEarnedIncome,
  recentEducationTraining,
  recentJobApplications,
  incomeDetails,
} from '../../pages';
import environment from '../../../../../platform/utilities/environment';

import {
  needsToEnterUnemployability,
  needsToAnswerUnemployability,
  isUploadingSupporting8940Documents,
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
      unemployabilityDisabilities: {
        title: 'Unemployability disabilities',
        path: 'unemployability-disabilities',
        depends: needsToAnswerUnemployability,
        uiSchema: unemployabilityDisabilities.uiSchema,
        schema: unemployabilityDisabilities.schema,
      },
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
      recentEarnedIncome: {
        title: 'Recent earnings',
        path: 'recent-earnings',
        depends: needsToAnswerUnemployability,
        uiSchema: recentEarnedIncome.uiSchema,
        schema: recentEarnedIncome.schema,
      },
      // 8940 - Supplementary Benefits
      supplementalBenefits: {
        title: 'Supplemental Benefits',
        path: 'supplemental-benefits',
        depends: needsToAnswerUnemployability,
        uiSchema: supplementalBenefits.uiSchema,
        schema: supplementalBenefits.schema,
      },
      // 8940 - Military Duty
      militaryDutyImpact: {
        title: 'Impact on military duty',
        path: 'military-duty-impact',
        depends: needsToEnterUnemployability,
        uiSchema: militaryDutyImpact.uiSchema,
        schema: militaryDutyImpact.schema,
      },
      // 8940 - Job Applications
      recentJobApplications: {
        title: 'Recent job applications',
        path: 'recent-job-applications',
        depends: needsToAnswerUnemployability,
        uiSchema: recentJobApplications.uiSchema,
        schema: recentJobApplications.schema,
      },
      // 8940 - Education & Training
      pastEducationTraining: {
        title: 'Education $ Training',
        path: 'past-education-training',
        depends: needsToAnswerUnemployability,
        uiSchema: pastEducationTraining.uiSchema,
        schema: pastEducationTraining.schema,
      },
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
      uploadUnemployabilitySupportingDocumentsChoice: {
        title: 'Supporting documents',
        path: 'upload-unemployability-supporting-documents-choice',
        depends: needsToAnswerUnemployability,
        uiSchema: uploadUnemployabilitySupportingDocumentsChoice.uiSchema,
        schema: uploadUnemployabilitySupportingDocumentsChoice.schema,
      },
      uploadUnemployabilitySupportingDocuments: {
        title: 'Upload supporting documents',
        path: 'upload-unemployability-supporting-documents',
        depends: formData => isUploadingSupporting8940Documents(formData),
        uiSchema: uploadUnemployabilitySupportingDocuments.uiSchema,
        schema: uploadUnemployabilitySupportingDocuments.schema,
      },
      // 8940 - Certification
      unemployabilityCertification: {
        title: 'Unemployability Certification',
        path: 'unemployability-certification',
        depends: needsToAnswerUnemployability,
        uiSchema: unemployabilityCertification.uiSchema,
        schema: unemployabilityCertification.schema,
      },
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
