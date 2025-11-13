import React from 'react';
import _ from 'platform/utilities/data';
import { DATA_PATHS } from '../constants';

export const summaryOfEvidenceDescription = ({ formData }) => {
  const vaEvidence = _.get('vaTreatmentFacilities', formData, []);
  const privateEvidence = _.get('providerFacility', formData, []);
  const privateEvidenceUploads = _.get(
    'privateMedicalRecordAttachments',
    formData,
    [],
  );
  const serviceTreatmentRecordsUploads = _.get(
    'serviceTreatmentRecordsAttachments',
    formData,
    [],
  );
  const layEvidenceUploads = _.get('additionalDocuments', formData, []);
  const evidenceLength = !!vaEvidence.concat(
    privateEvidence,
    privateEvidenceUploads,
    serviceTreatmentRecordsUploads,
    layEvidenceUploads,
  ).length;
  const selectedEvidence = _.get('view:hasEvidence', formData, false);
  const serviceTreatmentRecordsSelected = _.get(
    'view:uploadServiceTreatmentRecordsQualifier.view:hasServiceTreatmentRecordsToUpload',
    formData,
    false,
  );
  // Evidence isn't always properly cleared out from form data if removed so
  // need to also check that 'no evidence' was explicitly selected
  if (
    !evidenceLength ||
    (!selectedEvidence && !serviceTreatmentRecordsSelected)
  ) {
    return (
      <p>
        You haven’t uploaded any evidence. This may delay us processing your
        claim. In addition, we may also schedule a claim exam for you to help us
        decide your claim.
      </p>
    );
  }

  let vaContent = null;
  let privateContent = null;
  let layContent = null;
  let privateEvidenceContent = null;
  let serviceTreatmentRecordsContent = null;

  const vaEvidenceSelected = _.get(DATA_PATHS.hasVAEvidence, formData, false);
  const privateEvidenceSelected = _.get(
    DATA_PATHS.hasPrivateEvidence,
    formData,
    false,
  );
  const uploadPrivateEvidenceSelected = _.get(
    DATA_PATHS.hasPrivateRecordsToUpload,
    formData,
    false,
  );

  const additionalEvidenceSelected = _.get(
    DATA_PATHS.hasAdditionalDocuments,
    formData,
    false,
  );

  if (vaEvidence.length && vaEvidenceSelected) {
    const facilitiesList = vaEvidence.map((facility, index) => (
      <li key={index}>{facility.treatmentCenterName}</li>
    ));
    vaContent = (
      <div>
        <p>We’ll get your VA medical records from:</p>
        <ul>{facilitiesList}</ul>
      </div>
    );
  }

  if (
    privateEvidenceUploads.length &&
    privateEvidenceSelected &&
    uploadPrivateEvidenceSelected
  ) {
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

  if (
    privateEvidence.length &&
    privateEvidenceSelected &&
    !uploadPrivateEvidenceSelected
  ) {
    const privateEvidenceList = privateEvidence.map(facility => (
      <li key={facility.providerFacilityName}>
        {facility.providerFacilityName}
      </li>
    ));
    privateEvidenceContent = (
      <div>
        <p>We’ll get your non-VA treatment records from:</p>
        <ul>{privateEvidenceList}</ul>
      </div>
    );
  }

  if (
    serviceTreatmentRecordsUploads.length &&
    serviceTreatmentRecordsSelected
  ) {
    const serviceTreatmentRecordsUploadsList = serviceTreatmentRecordsUploads.map(
      upload => <li key={upload.name}>{upload.name}</li>,
    );
    serviceTreatmentRecordsContent = (
      <div>
        <p>We’ll submit the below service treatment records you uploaded:</p>
        <ul>{serviceTreatmentRecordsUploadsList}</ul>
      </div>
    );
  }

  if (layEvidenceUploads.length && additionalEvidenceSelected) {
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
      {serviceTreatmentRecordsContent}
      {layContent}
    </div>
  );
};
