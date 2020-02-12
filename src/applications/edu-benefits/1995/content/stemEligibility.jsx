import React from 'react';
import _ from 'lodash';

const icon = indication => (indication ? 'fa fa-check' : 'fa fa-remove');

export const rogersStemEligibilityInfo = formData => {
  const isEdithNourseRogersScholarship =
    formData.isEdithNourseRogersScholarship && formData.benefit === 'chapter33';
  const exhaustionOfBenefits =
    _.get(formData, 'view:exhaustionOfBenefits', null) ||
    _.get(
      formData,
      'view:exhaustionOfBenefitsAfterPursuingTeachingCert',
      false,
    );
  const isEnrolledStem =
    _.get(formData, 'isEnrolledStem', null) ||
    _.get(formData, 'isPursuingTeachingCert', false);

  return (
    <div>
      <p>
        <b>Based on you responses, it appears you're not eligible.</b>
        <br />
        <b>Your responses:</b>
      </p>
      <ul>
        <li>
          <i
            className={icon(isEdithNourseRogersScholarship)}
            aria-hidden="true"
          />
          Post-9/11 GI Bill beneficiary or Fry Scholarship recipient
        </li>
        <li>
          <i className={icon(exhaustionOfBenefits)} aria-hidden="true" />
          Have used all your education benefits or are within 6 months of do so
        </li>
        <li>
          <i className={icon(isEnrolledStem)} aria-hidden="true" />
          Are enrolled in a STEM undergraduate degree program, or have earned a
          STEM degree and are now pursuing a teaching certification
        </li>
      </ul>
    </div>
  );
};
