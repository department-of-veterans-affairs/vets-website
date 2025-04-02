import React from 'react';

export const addDependentOptions = {
  addSpouse: 'My spouse',
  addChild: 'An unmarried child under 18',
  report674:
    'An unmarried child between ages 18 and 23, and who attends school',
  addDisabledChild:
    'An unmarried child of any age who has a permanent mental or physical disability ',
};

export const removeDependentOptions = {
  reportDivorce: 'A spouse I divorced',
  reportDeath: 'A spouse, child, or parent who died',
  reportStepchildNotInHousehold:
    'A stepchild who doesn’t live with me or receive financial support from me anymore',
  reportMarriageOfChildUnder18: 'A child who got married',
  reportChild18OrOlderIsNotAttendingSchool:
    'A child between ages 18 and 23 because they left school',
};

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
