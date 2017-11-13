import React from 'react';
import AdditionalInfo from '../../common/components/AdditionalInfo';
import { isVeteran, isUnmarriedChild } from '../utils/helpers';

export default function SupportingDocumentsDescription(props) {
  let desc;

  if (isVeteran(props.formData)) {
    desc = (
      <p>If you have your DD214 or other separation papers, please upload a copy. This will help us figure out if you qualify for burial based on your military status and service history. If you don’t have these documents, you can still apply–and we’ll request the documents on your behalf.</p>
    );
  } else if (isUnmarriedChild(props.formData)) {
    desc = (
      <div>
        <p>If you have your sponsor’s DD214 or other separation papers, please upload a copy. This will help us figure out if you qualify for burial based on your sponsor’s military status and service history. If you don’t have these documents, you can still apply–and we’ll request the documents on your behalf.</p>
        <p>You’ll also need to provide supporting documents, such as :</p>
        <ul>
          <li>Medical evidence of a disability</li>
          <li>Start date of a disability</li>
          <li>Age when diagnosed with disability</li>
        </ul>
      </div>
    );
  } else {
    desc = (
      <p>If you have your sponsor’s DD214 or other separation papers, please upload a copy. This will help us figure out if you qualify for burial based on your sponsor’s military status and service history. If you don’t have these documents, you can still apply–and we’ll request the documents on your behalf.</p>
    );
  }

  return (
    <div id="supporting-documents-description">
      <p>
        If you have supporting documents readily available, you can upload them to help us make a determination quickly.
      </p>
      <AdditionalInfo triggerText="What kinds of documents should I provide?">
        {desc}
        <p>If you’re applying on behalf of someone else, you’ll need to provide supporting documents or an affidavit showing that you’re:</p>
        <ul>
          <li>The applicant’s court-appointed representative, or</li>
          <li>The applicant’s caregiver (including a spouse or other relative), or</li>
          <li>An attorney or agent acting on behalf of the applicant under a durable power of attorney, or</li>
          <li>The manager or principal officer of an institution in which the applicant is being care for</li>
        </ul>
      </AdditionalInfo>
      <AdditionalInfo triggerText="Can I mail or fax documents?">
        <p>
          Please upload your documents online to help VA process your request quickly.
        </p>
        <p>
          If you can’t upload documents:
        </p>
        <ol className="mail-or-fax-steps">
          <li>Make copies of the documents.</li>
          <li>Make sure you write your name and confirmation number on every page.</li>
          <li>
            <p>Mail or fax them to:</p>
            <div className="mail-fax-address">
              <div>National Cemetery Scheduling Office</div>
              <div>P.O. Box 510543</div>
              <div>St. Louis, MO 63151</div>
            </div>
            <p>Fax (toll-free): 1-855-840-8299</p>
          </li>
        </ol>
      </AdditionalInfo>
    </div>
  );
}
