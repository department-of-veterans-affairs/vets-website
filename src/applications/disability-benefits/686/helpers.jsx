import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';
import React from 'react';
// import { apiRequest } from '../../../platform/utilities/api';
import { transformForSubmit } from 'us-forms-system/lib/js/helpers';
import { get } from 'lodash/fp';

export const relationshipLabels = {
  veteran: 'I am the Veteran',
  spouse: 'Spouse or surviving spouse',
  child: 'Unmarried adult child',
  other: 'Other',
};
export const childRelationshipStatusLabels = {
  biological: 'Biological',
  adopted: 'Adopted',
  stepchild: 'Stepchild',
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
  9: 'Tenth',
};

export function fetchDisabilityRating({ onDone }) {
  // const fetchUrl = '/dependents_applications/disability_rating';

  Promise.resolve(onDone({ has30Percent: true }));
  // return apiRequest(
  //   fetchUrl,
  //   null,
  //   payload => onDone(payload),
  //   error => onError(error)
  // );
}

export function isMarried(form = {}) {
  return ['Married', 'Separated'].includes(form.maritalStatus);
}

export function getMarriageTitle(index) {
  const desc = numberToWords[index];

  return desc ? `${desc} marriage` : `Marriage ${index + 1}`;
}

export function getMarriageTitleWithCurrent(form, index) {
  if (isMarried(form) && form.marriages.length - 1 === index) {
    return 'Current marriage';
  }

  return getMarriageTitle(index);
}
export function getSpouseMarriageTitle(index) {
  const desc = numberToWords[index];

  return desc
    ? `Spouse’s ${desc.toLowerCase()} marriage`
    : `Spouse marriage ${index + 1}`;
}

export const VAFileNumberDescription = (
  <div className="additional-info-title-help">
    <AdditionalInfo triggerText="What does this mean?">
      <p>
        The VA file number is the number used to track your disability claim and
        evidence through the VA system. For most Veterans, your VA file number
        is the same as your Social Security number. However, if you filed your
        first disability claim a long time ago, your VA file number may be a
        different number.
      </p>
    </AdditionalInfo>
  </div>
);

export const dependentsMinItem = (
  <span>
    If you are claiming child dependents,{' '}
    <strong>you must add at least one</strong> here.
  </span>
);

export const schoolAttendanceWarning = (
  <div className="usa-alert usa-alert-warning">
    <div className="usa-alert-body">
      <div className="usa-alert-text">
        Since your child is between 18 and 23 years old, you’ll need to fill out
        a Request for Approval of School Attendance (
        <a
          href="https://www.vba.va.gov/pubs/forms/VBA-21-674-ARE.pdf"
          target="_blank"
        >
          VA Form 21-674
        </a>
        ). <strong>You can send us this form later.</strong>
      </div>
    </div>
  </div>
);

export const disableWarning = (
  <div className="usa-alert usa-alert-warning">
    <div className="usa-alert-body">
      <div className="usa-alert-text">
        You'll need to provide all private medical records for your child's
        disability.
      </div>
    </div>
  </div>
);

export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form);
  return JSON.stringify({
    form: formData,
  });
}

export const spouseRelationshipDescription = (
  <div className="usa-alert usa-alert-info background-color-only">
    You’re applying as the{' '}
    <strong>legally married spouse or surviving spouse</strong> of the Veteran
    who’s sponsoring this application. First, we’ll ask for your information as
    the applicant. Then, we’ll ask for your sponsor’s information.
  </div>
);

export const childRelationshipDescription = (
  <div className="usa-alert usa-alert-info background-color-only">
    You’re applying as the <strong>unmarried adult child</strong> of the Veteran
    who’s sponsoring this application. First, we’ll ask for your information as
    the applicant. Then, we’ll ask for your sponsor’s information. You’ll also
    need to provide supporting documents with information about your disability.
  </div>
);

export const otherRelationshipDescription = (
  <div className="usa-alert usa-alert-info background-color-only">
    You’re applying on <strong>behalf</strong> of the Veteran who’s sponsoring
    this application. First, we’ll ask for your information as the applicant.
    Then, we’ll ask for the Veteran's information as the sponsor.
  </div>
);

export function isVeteran(item) {
  const relationship = get('view:relationshipToVet', item);
  return relationship && relationship === '1';
}

export const profileStatuses = {
  // TODO: move to platform and use in requiredLoginView
  SERVER_ERROR: 'SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
};
