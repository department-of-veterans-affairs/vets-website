import AdditionalInfo from '@department-of-veterans-affairs/jean-pants/AdditionalInfo';
import React from 'react';

export const relationshipLabels = {
  veteran: 'I am the Veteran',
  spouse: 'Spouse or surviving spouse',
  child: 'Unmarried adult child',
  other: 'Other'
};
export const childRelationshipStatusLabels = {
  biological: 'Biological',
  adopted: 'Adopted',
  stepchild: 'Stepchild'
};

const numberToWords = {
  0: 'First',
  1: 'Second',
  2: 'Third',
  3: 'Fourth',
  4: 'Fifth',
  5: 'Sixth',
  6: 'Seventh',
  7: 'Eighth',
  8: 'Ninth',
  9: 'Tenth'
};

export function isMarried(form = {}) {
  return ['Married', 'Separated'].includes(form.maritalStatus);
}

export function getMarriageTitle(index) {
  const desc = numberToWords[index];

  return desc ? `${desc} marriage` : `Marriage ${index + 1}`;
}

export function getMarriageTitleWithCurrent(form, index) {
  if (isMarried(form) && (form.marriages.length - 1) === index) {
    return 'Current marriage';
  }

  return getMarriageTitle(index);
}

export const VAFileNumberDescription = (
  <div className="additional-info-title-help">
    <AdditionalInfo triggerText="What does this mean?">
      <p>The VA file number is the number used to track your disability claim and evidence through the VA system. For most Veterans, your VA file number is the same as your Social Security number. However, if you filed your first disability claim a long time ago, your VA file number may be a different number.</p>
    </AdditionalInfo>
  </div>
);

export const dependentsMinItem = (
  <span>If you are claiming child dependents, <strong>you must add at least one</strong> here.</span>
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
      <p>If you have other evidence, like lay or buddy statements, that you would
        like to submit, you can upload them here.</p>
      <p>File upload guidelines:</p>
      <ul>
        <li>File types you can upload: .pdf, .jpeg, or .png</li>
        <li>Maximum file size: 50 MB</li>
      </ul>
      <p><em>Large files can be more difficult to upload with a slow Internet connection</em></p>
    </div>
  );
};

export const schoolAttendanceWarning = (
  <div className="usa-alert usa-alert-warning">
    <div className="usa-alert-body">
      <div className="usa-alert-text">Since your child is between 18 and 23 years old, you’ll need to fill out a Request for Approval of School Attendance (<a href="https://www.vba.va.gov/pubs/forms/VBA-21-674-ARE.pdf" target="_blank">VA Form 21-674</a>). <strong>You can send us this form later.</strong></div>
    </div>
  </div>
);

export const disableWarning = (
  <div className="usa-alert usa-alert-warning">
    <div className="usa-alert-body">
      <div className="usa-alert-text">You'll need to provide all private medical records for your child's disability.</div>
    </div>
  </div>
);
