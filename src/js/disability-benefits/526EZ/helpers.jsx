import React from 'react';

import { transformForSubmit } from '../../common/schemaform/helpers';
import InformationLink from './components/InformationLink';


export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form);
  return JSON.stringify({
    educationBenefitsClaim: {
      form: formData
    }
  });
}


export const supportingEvidenceOrientation = (
  <p>We’ll now ask you where we can find medical records or evidence about your worsened conditions after they were rated. You don’t need to turn in any medical records that you’ve already submitted with your original claim. <strong>We only need new medical records or other evidence about your condition after you got your disability rating.</strong></p>
);


export const evidenceTypesDescription = ({ formData }) => {
  return (
    <p>What supporting evidence do you have that shows how your {formData.disability.diagnosticText} <strong>has worsened since VA rated your disability</strong>?</p>
  );
};


export const evidenceTypeHelp = (
  <InformationLink>
    <h3>Types of evidence</h3>
    <h4>VA medical records</h4>
    <p>If you were treated at a VA medical center or clinic, you have VA medical records. This includes Tri-Care.</p>
    <h4>Private medical records</h4>
    <p>If you were treated by a private doctor, including Veteran’s Choice, we will need to see those records to proceed with your claim. Like DBQs.</p>
    <h4>Lay statements or other evidence</h4>
    <p>Also known as "buddy statements," written accounts from family or other people who know you can help support a claim. In most cases your medical records are enough, but claims involving Post Traumatic Stress Disorder or Military Sexual Trauma sometimes benefit from Lay Statements.</p>
  </InformationLink>
);


export const disabilityNameTitle = ({ formData }) => {
  return (
    <legend className="schemaform-block-title schemaform-title-underline">{formData.disability.diagnosticText}</legend>
  );
};


export const vaMedicalRecordsIntro = ({ formData }) => {
  return (
    <p>Ok, first we’ll ask about your VA medical records related to your {formData.disability.diagnosticText}.</p>
  );
};


export const privateRecordsChoice = ({ formData }) => {
  return (
    <div>
      <h4>About private medical records</h4>
      <p>You said you were treated for {formData.disability.diagnosticText} by a private doctor. You can upload your records, or we can get them from your doctor if you authorize their release.</p>
    </div>
  );
};


// TODO: Figure out if this is going to be a common enough pattern to warrant a widget or something.
export const privateRecordsChoiceHelp = (
  <InformationLink>
    <h4>Upload or delegate</h4>
    <h5>Uploading your own copies</h5>
    <p>If you have an electronic copy of your medical records, uploading your records can speed the review of your claim.</p>
    <p>This works best if you have a fast internet connection and time for a large file upload.</p>
    <h5>VA gets your records for you</h5>
    <p>If you tell us which VA medical facilities have treated you for this condition, we can go get your records from them. This is easier for you, but will take longer to complete.</p>
  </InformationLink>
);
