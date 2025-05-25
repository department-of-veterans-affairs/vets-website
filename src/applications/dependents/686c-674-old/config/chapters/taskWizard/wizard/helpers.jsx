import React from 'react';

export const DescriptionText = () => (
  <div>
    <p>
      <strong>If you’re adding children,</strong> they must be under 18,{' '}
      <strong>or</strong> under 24 and attending school. They must also be
      unmarried in order to be considered a dependent child for VA purposes.
    </p>
    <p>
      Children automatically are removed when they turn 18. You may need to add
      them again if they are attending school.
    </p>
    <p>
      <strong>If you’re adding a child 18 to 23</strong> years old who’ll be
      attending school, <strong>and</strong> If you never received benefits for
      this child, you must <strong>also</strong> select the “Add a child or
      children under 18 and unmarried” checkbox so they can be added to the
      system. You <strong>will</strong> enter this child twice.
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
    Add a child <strong>18 to 23 years old</strong> who’ll be attending school
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
    errors.addError('Select at least one option');
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
