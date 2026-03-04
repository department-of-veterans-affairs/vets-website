import React from 'react';

import {
  getAdditionalDocuments,
  getBddShaUploads,
  getPrivateEvidenceUploads,
  getPrivateFacilities,
  getServiceTreatmentRecordsAttachments,
  getVaEvidence,
  hasOtherEvidence,
  hasPrivateEvidence,
  hasVAEvidence,
  isNotUploadingPrivateMedical,
  isUploadingBddSha,
  isUploadingSTR,
} from '../utils';

const SECTION_CONFIGURATIONS = {
  'bdd-sha-uploads': {
    evidenceIdKey: 'confirmationCode',
    evidenceNameKey: 'name',
    isSelected: isUploadingBddSha,
    getEvidences: getBddShaUploads,
    getHeaderText: shouldEnhance =>
      shouldEnhance
        ? 'We’ll submit the Separation Health Assessment Part A (SHA A) you uploaded'
        : 'We’ll submit the Separation Health Assessment Part A document that you uploaded',
  },
  'va-evidence': {
    evidenceIdKey: 'treatmentCenterName',
    evidenceNameKey: 'treatmentCenterName',
    isSelected: hasVAEvidence,
    getEvidences: getVaEvidence,
    getHeaderText: shouldEnhance =>
      shouldEnhance
        ? 'We’ll request your VA medical records on your behalf from these VA medical centers'
        : 'We’ll get your VA medical records from',
  },
  'private-evidence-uploads': {
    evidenceIdKey: 'confirmationCode',
    evidenceNameKey: 'name',
    isSelected: formData =>
      hasPrivateEvidence(formData) && !isNotUploadingPrivateMedical(formData),
    getEvidences: getPrivateEvidenceUploads,
    getHeaderText: shouldEnhance =>
      shouldEnhance
        ? 'We’ll submit these private medical records you uploaded'
        : 'We’ll submit the below private medical records you uploaded',
  },
  'private-facilities': {
    evidenceIdKey: 'providerFacilityName',
    evidenceNameKey: 'providerFacilityName',
    isSelected: formData =>
      hasPrivateEvidence(formData) && isNotUploadingPrivateMedical(formData),
    getEvidences: getPrivateFacilities,
    getHeaderText: shouldEnhance =>
      shouldEnhance
        ? 'We’ll request your private medical records on your behalf from these medical centers'
        : 'We’ll get your non-VA treatment records from',
  },
  'service-treatment-records-attachments': {
    evidenceIdKey: 'confirmationCode',
    evidenceNameKey: 'name',
    isSelected: isUploadingSTR,
    getEvidences: getServiceTreatmentRecordsAttachments,
    getHeaderText: shouldEnhance =>
      shouldEnhance
        ? 'We’ll submit these service treatment records you uploaded'
        : 'We’ll submit the below service treatment records you uploaded',
  },
  'additional-documents': {
    evidenceIdKey: 'confirmationCode',
    evidenceNameKey: 'name',
    isSelected: hasOtherEvidence,
    getEvidences: getAdditionalDocuments,
    getHeaderText: shouldEnhance =>
      shouldEnhance
        ? 'We’ll submit these documents you uploaded as evidence supporting your claim'
        : 'We’ll submit the below supporting evidence you uploaded',
  },
};

const SECTION_ORDERS = {
  UNENHANCED: [
    'bdd-sha-uploads',
    'va-evidence',
    'private-evidence-uploads',
    'private-facilities',
    'service-treatment-records-attachments',
    'additional-documents',
  ],
  ENHANCED: [
    'bdd-sha-uploads',
    'service-treatment-records-attachments',
    'va-evidence',
    'private-evidence-uploads',
    'private-facilities',
    'additional-documents',
  ],
};

const buildSectionsList = (formData, { shouldEnhance }) => {
  const sectionsList = [];
  const sectionOrder = shouldEnhance
    ? SECTION_ORDERS.ENHANCED
    : SECTION_ORDERS.UNENHANCED;

  for (const sectionId of sectionOrder) {
    const configuration = SECTION_CONFIGURATIONS[sectionId];
    const headerText = `${configuration.getHeaderText(shouldEnhance)}:`;
    const evidences = configuration.isSelected(formData)
      ? configuration.getEvidences(formData)
      : [];

    if (evidences.length) {
      const evidencesList = (
        <ul>
          {evidences.map(evidence => {
            const key = evidence[configuration.evidenceIdKey];
            const name = evidence[configuration.evidenceNameKey];
            return <li key={key}>{name}</li>;
          })}
        </ul>
      );

      const section = shouldEnhance ? (
        <div key={sectionId} className="vads-u-margin-top--2">
          <strong>{headerText}</strong>
          {evidencesList}
        </div>
      ) : (
        <div key={sectionId}>
          <p>{headerText}</p>
          {evidencesList}
        </div>
      );

      sectionsList.push(section);
    }
  }

  return sectionsList;
};

export const summaryOfEvidenceDescription = ({ formData }) => {
  const shouldEnhance = formData.disability526SupportingEvidenceEnhancement;
  const sectionsList = buildSectionsList(formData, { shouldEnhance });

  if (!sectionsList.length) {
    return (
      <p>
        You haven’t uploaded any evidence. This may delay us processing your
        claim. In addition, we may also schedule a claim exam for you to help us
        decide your claim.
      </p>
    );
  }

  return (
    <div className="vads-u-margin-top--3">
      {shouldEnhance && <p>You provided documents to support your claim.</p>}
      {sectionsList}
      {shouldEnhance && (
        <p>
          Next, we’ll share some information about what to expect during a claim
          exam.
        </p>
      )}
    </div>
  );
};
