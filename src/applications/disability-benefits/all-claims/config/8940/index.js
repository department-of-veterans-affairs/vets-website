import {
  unemployabilityAdditionalInformation,
  unemployabilityFormIntro,
  supplementalBenefits,
  unemployabilityDates,
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
  unemployabilityFormUpload,
  employmentHistory,
  unemployabilityDoctorCare,
  medicalCare,
  hospitalizationHistory,
} from '../../pages';
import environment from 'platform/utilities/environment';

import {
  needsToEnterUnemployability,
  needsToAnswerUnemployability,
  isUploading8940Form,
  isUploadingSupporting8940Documents,
  hasHospitalCare,
  hasDoctorsCare,
} from '../../utils';

import captureEvents from '../../analytics-functions';

import createFormConfig4192 from '../4192';

export default function() {
  let configObj = {};
  if (!environment.isProduction()) {
    configObj = {
      // 8940 - Introduction
      unemployabilityFormIntro: {
        title: 'File a claim for Individual Unemployability',
        path: 'unemployability-walkthrough-choice',
        depends: needsToEnterUnemployability,
        uiSchema: unemployabilityFormIntro.uiSchema,
        schema: unemployabilityFormIntro.schema,
        onContinue: captureEvents.unemployabilityFormIntro,
      },
      // 8940 - Upload 8940
      unemployabilityFormUpload: {
        title: 'Upload unemployability form',
        path: 'new-disabilities/unemployability-form-upload',
        depends: isUploading8940Form,
        uiSchema: unemployabilityFormUpload.uiSchema,
        schema: unemployabilityFormUpload.schema,
      },
      // 8940 - Contentions
      unemployabilityDisabilities: {
        title: 'Unemployability disabilities',
        path: 'unemployability-disabilities',
        depends: needsToAnswerUnemployability,
        uiSchema: unemployabilityDisabilities.uiSchema,
        schema: unemployabilityDisabilities.schema,
      },
      // 8940 - Medical Care
      medicalCare: {
        title: 'Medical care',
        path: 'medical-care',
        depends: needsToAnswerUnemployability,
        uiSchema: medicalCare.uiSchema,
        schema: medicalCare.schema,
      },
      // 8940 - Hospital Treatment
      hospitalizationHistory: {
        title: 'Hospitalization',
        path: 'hospitalization-history',
        depends: hasHospitalCare,
        uiSchema: hospitalizationHistory.uiSchema,
        schema: hospitalizationHistory.schema,
      },
      // 8940 - Doctor Treatment
      unemployabilityDoctorCare: {
        title: 'Doctor’s care',
        path: 'doctor-care',
        depends: hasDoctorsCare,
        uiSchema: unemployabilityDoctorCare.uiSchema,
        schema: unemployabilityDoctorCare.schema,
      },
      // 8940 - Disability Dates
      unemployabilityDates: {
        title: 'Disability dates',
        path: 'unemployability-disability-dates',
        depends: needsToAnswerUnemployability,
        uiSchema: unemployabilityDates.uiSchema,
        schema: unemployabilityDates.schema,
      },
      // 8940 - Income Details
      incomeDetails: {
        title: 'Income details',
        path: 'unemployability-income-details',
        depends: needsToAnswerUnemployability,
        uiSchema: incomeDetails.uiSchema,
        schema: incomeDetails.schema,
      },
      // 8940 - Employment History
      employmentHistory: {
        title: 'Employment history',
        path: 'unemployability-employment-history',
        depends: needsToAnswerUnemployability,
        uiSchema: employmentHistory.uiSchema,
        schema: employmentHistory.schema,
      },
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
        title: 'Supplemental benefits',
        path: 'supplemental-benefits',
        depends: needsToAnswerUnemployability,
        uiSchema: supplementalBenefits.uiSchema,
        schema: supplementalBenefits.schema,
      },
      // 8940 - Military Duty
      militaryDutyImpact: {
        title: 'Impact on military duty',
        path: 'military-duty-impact',
        depends: needsToAnswerUnemployability,
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
        title: 'Education & training',
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
        title: '8940 additional information',
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
        title: 'Unemployability certification',
        path: 'unemployability-certification',
        depends: needsToAnswerUnemployability,
        uiSchema: unemployabilityCertification.uiSchema,
        schema: unemployabilityCertification.schema,
      },
      // 4192 -
      ...createFormConfig4192(),
    };
  }
  return configObj;
}
