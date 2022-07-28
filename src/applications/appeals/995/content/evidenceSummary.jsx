import React from 'react';
import {
  hasVAEvidence,
  hasPrivateEvidence,
  hasOtherEvidence,
  hasPrivateEvidenceToUpload,
} from '../utils/helpers';

export const evidenceSummaryDescription = ({ formData }) => {
  const hasPrivateUpload = hasPrivateEvidenceToUpload(formData);
  const vaEvidence = hasVAEvidence(formData) ? formData.locations : [];
  const privateEvidence =
    hasPrivateEvidence(formData) && !hasPrivateUpload
      ? formData.providerFacility
      : [];
  const privateEvidenceUploads =
    hasPrivateEvidence(formData) && hasPrivateUpload
      ? formData.privateMedicalRecordAttachments
      : [];
  const layEvidenceUploads = hasOtherEvidence(formData)
    ? formData.additionalDocuments
    : [];

  const evidenceLength = !!vaEvidence.concat(
    privateEvidence,
    privateEvidenceUploads,
    layEvidenceUploads,
  ).length;

  // Evidence isn't always properly cleared out from form data if removed
  if (!evidenceLength) {
    return (
      <va-alert status="error">
        <h2 slot="headline">You haven’t uploaded any evidence</h2>
        Providing evidence is a requirement for filing a Supplemental Claim
      </va-alert>
    );
  }

  let vaContent = null;
  let privateContent = null;
  let layContent = null;
  let privateEvidenceContent = null;

  if (vaEvidence.length) {
    const facilitiesList = vaEvidence.map(({ locationAndName }) => (
      <li key={locationAndName}>{locationAndName}</li>
    ));
    vaContent = (
      <div>
        <p>We’ll get your VA medical records from:</p>
        <ul>{facilitiesList}</ul>
      </div>
    );
  }

  if (privateEvidenceUploads.length) {
    const privateEvidenceUploadsList = privateEvidenceUploads.map(upload => (
      <li key={upload.name}>{upload.name}</li>
    ));
    privateContent = (
      <div>
        <p>We’ll submit the below private medical records you uploaded:</p>
        <ul>{privateEvidenceUploadsList}</ul>
      </div>
    );
  }

  if (privateEvidence.length) {
    const privateEvidenceList = privateEvidence.map(facility => (
      <li key={facility.providerFacilityName}>
        {facility.providerFacilityName}
      </li>
    ));
    privateEvidenceContent = (
      <div>
        <p>We’ll get your private medical records from:</p>
        <ul>{privateEvidenceList}</ul>
      </div>
    );
  }

  if (layEvidenceUploads.length) {
    const layEvidenceUploadsList = layEvidenceUploads.map(upload => (
      <li key={upload.name}>{upload.name}</li>
    ));
    layContent = (
      <div>
        <p>We’ll submit the below supporting evidence you uploaded:</p>
        <ul>{layEvidenceUploadsList}</ul>
      </div>
    );
  }

  return (
    <div>
      {vaContent}
      {privateContent}
      {privateEvidenceContent}
      {layContent}
    </div>
  );
};
