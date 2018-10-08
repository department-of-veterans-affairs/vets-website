import React from 'react';
import _ from '../../../../platform/utilities/data';

export const summaryOfEvidenceDescription = ({ formData }) => {
  const vaEvidence = _.get('vaTreatmentFacilities', formData, []);
  const privateEvidence = _.get('privateMedicalRecords', formData, []);
  const layEvidence = _.get('additionalDocuments', formData, []);
  const evidenceLength = !!vaEvidence.concat(privateEvidence, layEvidence)
    .length;
  const selectedEvidence = _.get('view:hasEvidence', formData, false);
  // Evidence isn't always properly cleared out from form data if removed so
  // need to also check that 'no evidence' was explicitly selected
  if (!evidenceLength || !selectedEvidence) {
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

  if (vaEvidence.length) {
    const facilitiesList = vaEvidence.map(facility => (
      <li key={facility.treatmentCenterName}>{facility.treatmentCenterName}</li>
    ));
    vaContent = (
      <div>
        <p>We’ll get your VA medical records from:</p>
        <ul>{facilitiesList}</ul>
      </div>
    );
  }

  if (privateEvidence.length) {
    const privateEvidenceList = privateEvidence.map(upload => (
      <li key={upload.name}>{upload.name}</li>
    ));
    privateContent = (
      <div>
        <p>We’ll submit the below private medical records you uploaded:</p>
        <ul>{privateEvidenceList}</ul>
      </div>
    );
  }

  if (layEvidence.length) {
    const layEvidenceList = layEvidence.map(upload => (
      <li key={upload.name}>{upload.name}</li>
    ));
    layContent = (
      <div>
        <p>We’ll submit the below supporting evidence you uploaded:</p>
        <ul>{layEvidenceList}</ul>
      </div>
    );
  }

  return (
    <div>
      {vaContent}
      {privateContent}
      {layContent}
    </div>
  );
};
