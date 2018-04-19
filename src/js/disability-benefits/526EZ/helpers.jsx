import React from 'react';

import { isValidUSZipCode, isValidCanPostalCode } from '../../../platform/forms/address';
import { stateRequiredCountries } from '../../common/schemaform/definitions/address';
import { transformForSubmit } from '../../common/schemaform/helpers';
import AdditionalInfo from '@department-of-veterans-affairs/jean-pants/AdditionalInfo';
import cloneDeep from '../../../platform/utilities/data/cloneDeep';
import { getDiagnosticCodeName, getDiagnosticText } from './reference-helpers';

const siblings = ['treatments', 'privateRecordReleases', 'privateRecords', 'additionalDocuments'];


/*
 * Flatten nested array form data into sibling properties
 *
 * @param {object} data - Form data for a full form, including nested array properties
 */
export function flatten(data) {
  const formData = cloneDeep(data);
  formData.disabilities.forEach((disability, idx) => {
    siblings.forEach(sibling => {
      if (disability[sibling]) {
        formData[sibling] = [];
        formData[sibling][idx] = disability[sibling];
        delete disability[sibling]; // eslint-disable-line no-param-reassign
      }
    });
  });
  return formData;
}

export function transform(formConfig, form) {
  const formData = flatten(transformForSubmit(formConfig, form));
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
    <p>What supporting evidence do you have that shows how your {getDiagnosticCodeName(formData.diagnosticCode)} <strong>has worsened since VA rated your disability</strong>?</p>
  );
};


export const evidenceTypeHelp = (
  <AdditionalInfo triggerText="Which should I choose?">
    <h3>Types of evidence</h3>
    <h4>VA medical records</h4>
    <p>If you were treated at a VA medical center or clinic, or by a doctor through the TRICARE health care program, you’ll have VA medical records.</p>
    <h4>Private medical records</h4>
    <p>If you were treated by a private doctor, including a Veteran’s Choice doctor, you’ll have private medical records.
      We’ll need to see those records to make a decision on your claim. A Disability Benefit Questionnaire is an example of a private medical record.</p>
    <h4>Lay statements or other evidence</h4>
    <p>A lay statement is a written statement from family, friends, or coworkers to help support your claim. Lay statement are also called “buddy statements.” In most cases, you only need your medical records to support your disability claim. Some claims, for example, for Posttraumatic Stress Disorder or for military sexual trauma, could benefit from a lay or buddy statement.</p>
  </AdditionalInfo>
);


export const disabilityNameTitle = ({ formData }) => {
  return (
    <legend className="schemaform-block-title schemaform-title-underline">{getDiagnosticCodeName(formData.diagnosticCode)}</legend>
  );
};


export const facilityDescription = ({ formData }) => {
  return (
    <p>Tell us about facilities where VA treated you for {getDiagnosticCodeName(formData.diagnosticCode)}, <strong>after you got your disability rating</strong>.</p>
  );
};


export const treatmentView = ({ formData }) => {
  const { from, to } = formData.treatmentDateRange;

  let treatmentPeriod = '';
  if (from && to) {
    treatmentPeriod = `${from} — ${to}`;
  } else if (from || to) {
    treatmentPeriod = `${(from || to)}`;
  }

  return (
    <div>
      <strong>{formData.treatmentCenterName}</strong><br/>
      {treatmentPeriod}
    </div>
  );
};


export const vaMedicalRecordsIntro = ({ formData }) => {
  return (
    <p>Ok, first we’ll ask about your VA medical records related to your {getDiagnosticCodeName(formData.diagnosticCode)}.</p>
  );
};


export const privateRecordsChoice = ({ formData }) => {
  return (
    <div>
      <h4>About private medical records</h4>
      <p>You said you were treated for {getDiagnosticCodeName(formData.diagnosticCode)} by a private doctor. If you have those records, you can upload them here, or we can get them for you. If you want us to get your records, you’ll need to authorize their release.</p>
    </div>
  );
};


export const privateRecordsChoiceHelp = (
  <AdditionalInfo triggerText="Which should I choose?">
    <h4>You upload your medical records</h4>
    <p>If you upload a digital copy of all your medical records, we can review your claim more quickly. Uploading a digital
      file works best if you have a computer with a fast Internet connection. The digital file could be uploaded as a .pdf
      or other photo file format, like a .jpeg or .png.</p>
    <h4>We get your medical records for you</h4>
    <p>If you tell us which VA medical center treated you for your condition, we can get your medical records for you. Getting your records may take us some time. This could take us longer to make a decision on your claim.</p>
  </AdditionalInfo>
);


export const privateMedicalRecordsIntro = ({ formData }) => {
  const firstOrNext = formData['view:vaMedicalRecords'] ? 'next' : 'first';
  return (
    <p>Ok, {firstOrNext} we’ll ask about your private medical records related to your {getDiagnosticCodeName(formData.diagnosticCode)}.</p>
  );
};

export function validatePostalCodes(errors, formData) {
  let isValidPostalCode = true;
  // Checks if postal code is valid
  if (formData.treatmentCenterCountry === 'USA') {
    isValidPostalCode = isValidPostalCode && isValidUSZipCode(formData.treatmentCenterPostalCode);
  }
  if (formData.treatmentCenterCountry === 'CAN') {
    isValidPostalCode = isValidPostalCode && isValidCanPostalCode(formData.treatmentCenterPostalCode);
  }

  // Add error message for postal code if it exists and is invalid
  if (formData.treatmentCenterPostalCode && !isValidPostalCode) {
    errors.treatmentCenterPostalCode.addError('Please provide a valid postal code');
  }
}

export function validateAddress(errors, formData) {
  // Adds error message for state if it is blank and one of the following countries:
  // USA, Canada, or Mexico
  if (stateRequiredCountries.has(formData.treatmentCenterCountry)
    && formData.treatmentCenterState === undefined) {
    // TODO: enable once validation determined 
    // && currentSchema.required.length) {
    errors.treatmentCenterState.addError('Please select a state or province');
  }
  const hasAddressInfo = stateRequiredCountries.has(formData.treatmentCenterCountry)
    // TODO: enable once validation determined 
    // && !currentSchema.required.length
    && typeof formData.treatmentCenterCity !== 'undefined'
    && typeof formData.treatmentCenterStreet !== 'undefined'
    && typeof formData.treatmentCenterPostalCode !== 'undefined';

  if (hasAddressInfo && typeof formData.treatmentCenterState === 'undefined') {
    errors.treatmentCenterState.addError('Please enter a state or province, or remove other address information.');
  }

  validatePostalCodes(errors, formData);
}

export const recordReleaseWarning = (
  <div className="usa-alert usa-alert-warning no-background-image">
    <span>Limiting consent means that your doctor can only share records that are directly related to your condition. This could add to the time it takes to get your private medical records.</span>
  </div>
);

export const documentDescription = () => {
  return (
    <div>
      <p>File upload guidelines:</p>
      <ul>
        <li>File types you can upload: .pdf, .jpeg, or .png</li>
        <li>Maximum file size: 50 MB</li>
      </ul>
      <p><em>Large files can be more difficult to upload with a slow Internet connection</em></p>
    </div>
  );
};

export const additionalDocumentDescription = () => {
  return (
    <div>
      <p>If you have other evidence, like lay or buddy statements, that you would like to submit, you can upload them here.</p>
      <p>File upload guidelines:</p>
      <ul>
        <li>File types you can upload: .pdf, .jpeg, or .png</li>
        <li>Maximum file size: 50 MB</li>
      </ul>
      <p><em>Large files can be more difficult to upload with a slow Internet connection</em></p>
    </div>
  );
};

const documentLabels = {
  1: 'Discharge',
  2: 'Marriage related',
  3: 'Dependent related',
  // 4: 'VA preneed form',
  5: 'Letter',
  6: 'Other'
};

const getVACenterName = (center) => center.treatmentCenterName;
const getPrivateCenterName = (release) => release.privateRecordRelease.treatmentCenterName;

const listifyCenters = (center, idx, list) => {
  const centerName = center.treatmentCenterName ? getVACenterName(center) : getPrivateCenterName(center);
  const notLast = idx < (list.length - 1);
  const justOne = list.length === 1;
  const atLeastThree = list.length > 2;
  return (
    <span key={idx}>
      {!notLast && !justOne && <span className="repose"> and </span>}
      {centerName}
      {atLeastThree && notLast && ', '}
    </span>
  );
};

export const evidenceSummaryView = ({ formData }) => {
  const {
    vaTreatments,
    privateRecordReleases,
    privateRecords,
    additionalDocuments
  } = formData;
  return (
    <div>
      <ul>
        {vaTreatments &&
        <li>We’ll get your medical records from <span className="treatment-centers">{vaTreatments.map(listifyCenters)}</span>.</li>}
        {privateRecordReleases &&
        <li>We’ll get your private medical records from <span className="treatment-centers">{privateRecordReleases.map(listifyCenters)}</span>.</li>}
        {privateRecords && <li>We have received the private medical records you uploaded.</li>}
        {additionalDocuments &&
        <li>We have received the additional evidence you uploaded:
          <ul>
            {additionalDocuments.map((document, id) => {
              return (<li className="dashed-bullet" key={id}>
                <strong>{`${documentLabels[document.attachmentId]} (${document.name})`}</strong>
              </li>);
            })
            }
          </ul>
        </li>}
      </ul>
    </div>
  );
};


/**
 * @typedef {Object} Disability
 * @property {String} diagnosticCode
 * @property {String} name
 * @property {String} ratingPercentage
 *
 * @param {Disability} disability
 */
export const disabilityOption = ({ diagnosticCode, name, ratingPercentage }) => {
  // May need to throw an error to Sentry if any of these doesn't exist

  return (
    <div>
      {diagnosticCode && <h4>{getDiagnosticCodeName(diagnosticCode)}</h4>}
      {name && <p className="diagnostic-text">{getDiagnosticText(name)}</p>}
      {ratingPercentage && <p>Current rating: <strong>{ratingPercentage}%</strong></p>}
    </div>
  );
};


export const ITFErrorAlert = (
  <div className="usa-alert usa-alert-warning">
    <div className="usa-alert-body">
      <h3>We’re sorry. Your intent to file request didn’t go through. Please try again.</h3>
    </div>
  </div>
);


export const UnauthenticatedAlert = (
  <div>
    <div className="usa-alert usa-alert-info schemaform-sip-alert">
      <div className="usa-alert-body">
        To apply for a disability increase, you’ll need to sign in and verify your account.
      </div>
    </div>
    <br/>
  </div>
);


export const UnverifiedAlert = (
  <div>
    <div className="usa-alert usa-alert-info schemaform-sip-alert">
      <div className="usa-alert-body">
        To apply for a disability increase, you’ll need to verify your account.
      </div>
    </div>
    <br/>
  </div>
);


export const VerifiedAlert =  (
  <div>
    <div className="usa-alert usa-alert-info schemaform-sip-alert">
      <div className="usa-alert-body">
        <strong>Note:</strong> Since you’re signed in to your account and your account is verified, we can prefill part of your application based on your account details. You can also save your form in progress, and come back later to finish filling it out. You have 1 year from the date you start or update your application to submit the form.
      </div>
    </div>
    <br/>
  </div>
);


export const GetFormHelp = () => {
  return (
    <div>
      <p className="help-talk">For help filling out this form, please call:</p>
      <p className="help-phone-number">
        <a className="help-phone-number-link" href="tel:+1-877-222-8387">1-877-222-VETS</a> (<a className="help-phone-number-link" href="tel:+1-877-222-8387">1-877-222-8387</a>)<br/>
        Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET)
      </p>
    </div>
  );
};


export const ITFDescription = (
  <span><strong>Note:</strong> By clicking the button to start the disability application, you’ll declare your intent to file, and this will set the date you can start getting benefits. This intent to file will expire 1 year from the day you start your application.</span>
);


export const specialCircumstancesDescription = (
  <p>To help us better understand your situation, please tell us if
      any of the below situations apply to you. <strong>Are you:</strong></p>
);


export const FDCDescription = (
  <div>
    <h5>Fully developed claim program</h5>
    <p>
      You can apply using the Fully Developed Claim (FDC) program if
      you’ve uploaded all the supporting documents or supplemental
      forms needed to support your claim.
    </p>
    <a href="/pension/apply/fully-developed-claim/" target="_blank">
      Learn more about the FDC program
    </a>.
  </div>
);


export const FDCWarning = (
  <div className="usa-alert usa-alert-info no-background-image">
    <div className="usa-alert-body">
      <div className="usa-alert-text">
        Since you’ve uploaded all your supporting documents, your
        claim will be submitted as a fully developed claim.
      </div>
    </div>
  </div>
);


export const noFDCWarning = (
  <div className="usa-alert usa-alert-info no-background-image">
    <div className="usa-alert-body">
      <div className="usa-alert-text">
        Since you’ll be sending in additional documents later,
        your application doesn’t qualify for the Fully Developed
        Claim program. We’ll review your claim through the
        standard claim process. Please turn in any information to
        support your claim as soon as you can.
      </div>
    </div>
  </div>
);
