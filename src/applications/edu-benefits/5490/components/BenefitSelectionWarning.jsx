import React from 'react';

export default function BenefitSelectionWarning(chapter, relationship) {
  let warningText = '';
  if (chapter === 'chapter33') {
    // Fry
    if (relationship === 'child') {
      warningText = (
        <div>
          I understand that I’m choosing to receive Fry Scholarship benefits
          instead of DEA benefits for which I’m currently eligible based on the
          death of the qualifying individual on this application. I understand
          that even after this choice I’ll continue to be eligible for DEA
          benefits if my eligibility is based on:
          <ul>
            <li>
              The death of the qualifying individual on this application, and
              they died before August 1, 2011, or
            </li>
            <li>
              A parent who has a permanent and total service-connected
              disability, or
            </li>
            <li>Any other criteria as listed in 38 U.S.C. § 3501(a)(1)</li>
          </ul>
          based on any other criteria as listed in 38 U.S.C. § 3501(a)(1).
        </div>
      );
    } else {
      // spouse
      warningText = (
        <div>
          I understand that I am choosing to receive Fry Scholarship benefits
          instead of any DEA benefits for which I am currently eligible. This
          includes DEA benefits based on the death of the qualifying individual
          on this application, based on the death of any other individuals not
          listed on this application, based on:
          <ul>
            <li>
              a spouse who has a permanent and total service-connected
              disability, or
            </li>
            <li>
              based on any other criteria as listed in 38 U.S.C. § 3501(a)(1).
            </li>
          </ul>
        </div>
      );
    }
  } else if (relationship === 'child') {
    // DEA
    warningText =
      'I understand that I’m choosing to receive DEA benefits instead of any Fry Scholarship benefits based on the death of the qualifying individual on this application. I understand that even after this choice I’ll continue to be eligible for Fry Scholarship benefits if my eligibility is based on the death of the qualifying individual on this application, and they died before August 1, 2011.';
    // }
  } else {
    // spouse
    warningText =
      'I understand that I am choosing to receive DEA benefits instead of any Fry Scholarship benefits for which I am currently eligible. This includes Fry Scholarship benefits based on the death of the qualifying individual on this application, as well as, Fry Scholarship benefits based on the death of any other individuals not listed on this application.';
  }
  return (
    <div className="usa-alert usa-alert-info usa-content edu-warning-single-line">
      <div className="usa-alert-body">{warningText}</div>
    </div>
  );
}
