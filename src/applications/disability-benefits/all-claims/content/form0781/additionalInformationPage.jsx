import React from 'react';
import cloneDeep from 'platform/utilities/data/cloneDeep';

export const additionalInformationPageTitle = 'Additional information';

export const additionalInformationPageQuestion =
  'Is there anything else you want to tell us about your mental health conditions, or related traumatic events and behavioral changes?';


  // CAN WE DO THIS ON CONTINUE?
export const deletedBeavioralQuestionsAlert = (formData, setFormData) => {
  console.log("FORM DATA", formData)
  // I don't think we get access to this
  console.log("Set form data", setFormData)

  if (formData['view:deletedBehavioralQuestionAnswers'] === true) {

    // We need to reset this so it doesn't happen again

    // These make me so nervous
    // const deepDataClone = cloneDeep(data);





    return (
      <va-alert status="success" class="vads-u-margin-bottom--4">
        <h3>Behavioral Questions deleted</h3>
        <p className="vads-u-margin-y--0">Your submission is in progress.</p>
        <p>I am an alert la la la</p>
        <va-link-action
          href="/my-va/"
          text="Check the status of your form on My VA"
          label="Check the status of your form on My VA"
          message-aria-describedby="Check the status of your form on My VA"
        />
      </va-alert>
    );
  } else {
    // This is probably bad
    return <div />;
  }
};
