import React from 'react';

export const DescriptionText = () => (
  <div>
    <p>
      If you’re claiming a dependent child 18 to 23 years old who’ll be
      attending school, <span className="vads-u-font-weight--bold">and</span> if
      you never received benefits for this child,{' '}
      <span className="vads-u-font-weight--bold">
        you must also select the “Claim benefits for your child under 18”
      </span>{' '}
      checkbox below.
    </p>
    <p>
      <span className="vads-u-font-weight--bold">Note:</span> To claim a
      dependent child under 18, they must be unmarried. A person must be
      unmarried to be considered a child for VA purposes.
    </p>
  </div>
);

export const AddChildTitle = (
  <p className="vads-u-margin-y--0">
    Add a child or children <strong>under 18 and unmarried</strong>
  </p>
);

export const Student674Title = (
  <p className="vads-u-margin-y--0">
    Add a child <strong>18 to 23 years old</strong> who'll be attending school
    (VA Form 21-674)
  </p>
);

export const StepchildTitle = (
  <p className="vads-u-margin-y--0">
    Remove a stepchild who has left your household
  </p>
);

export const ChildAttendingSchool = (
  <p className="vads-u-margin-y--0">
    Remove a child <strong>18 to 23 years old</strong> who has stopped attending
    school
  </p>
);

export const validateAtLeastOneSelected = (errors, fieldData) => {
  if (!Object.values(fieldData).some(val => val === true)) {
    errors.addError('Please select at least one option');
  }
};

export const OptionsReviewField = props => {
  const { children } = props;
  if (!children?.props.formData) {
    return null;
  }
  return (
    <div className="review-row">
      <dt>{children?.props?.uiSchema['ui:title']}</dt>
      <dd />
    </div>
  );
};
