import React from 'react';
import classNames from 'classnames';

import { transformForSubmit } from '../../common/schemaform/helpers';


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


// Shows or collapses the "Which should I choose?" link at the bottom of the evidence types page
// TODO: Investigate whether this should just use `expandUnder`
export class EvidenceTypeHelp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  toggleOpen = (e) => {
    e.preventDefault();
    this.setState({ open: !this.state.open });
  }

  expandedContent = (
    <div>
      <h3>Types of evidence</h3>
      <h4>VA medical records</h4>
      <p>If you were treated at a VA medical center or clinic, you have VA medical records. This includes Tri-Care.</p>
      <h4>Private medical records</h4>
      <p>If you were treated by a private doctor, including Veteran’s Choice, we will need to see those records to proceed with your claim. Like DBQs.</p>
      <h4>Lay statements or other evidence</h4>
      <p>Also known as "buddy statements," written accounts from family or other people who know you can help support a claim. In most cases your medical records are enough, but claims involving Post Traumatic Stress Disorder or Military Sexual Trauma sometimes benefit from Lay Statements.</p>
      <button className="va-button-link" onClick={this.toggleOpen}>Close</button>
    </div>
  )

  render() {
    const className = classNames(
      'form-expanding-group',
      { 'form-expanding-group-open': this.state.open }
    );

    return (
      <div className={className}>
        <button className="va-button-link dashed-underline" onClick={this.toggleOpen}>Which should I choose?</button>
        {this.state.open && this.expandedContent}
      </div>
    );
  }
}


export const disabilityNameTitle = ({ formData }) => {
  return (
    <legend className="schemaform-block-title schemaform-title-underline">{formData.disability.diagnosticText}</legend>
  );
};


export const facilityDescription = ({ formData }) => {
  return (
    <p>Tell us about facilities where VA treated you for {formData.disability.diagnosticText}, <strong>after you got your disability rating</strong>.</p>
  );
};


export const treatmentView = ({ formData }) => {
  const { startTreatment, endTreatment, treatmentCenterName } = formData.treatment;
  let treatmentPeriod = '';

  if (startTreatment && endTreatment) {
    treatmentPeriod = `${startTreatment} — ${endTreatment}`;
  } else if (startTreatment || endTreatment) {
    treatmentPeriod = `${(startTreatment || endTreatment)}`;
  }


  return (
    <div>
      <strong>{treatmentCenterName}</strong><br/>
      {treatmentPeriod}
    </div>
  );
};


export const vaMedicalRecordsIntro = ({ formData }) => {
  return (
    <p>Ok, first we’ll ask about your VA medical records related to your {formData.disability.diagnosticText}.</p>
  );
};

