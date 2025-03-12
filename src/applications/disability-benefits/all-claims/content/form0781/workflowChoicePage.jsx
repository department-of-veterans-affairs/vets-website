import React from 'react';

export const workflowChoicePageTitle =
  'Adding VA Form 21-0781 to support new mental health conditions';

// Lists new conditions the veteran has claimed
// The user should not get to this page if these conditions are not present
const conditionSelections = formData => {
  const conditions = formData.newDisabilities.map(
    disability =>
      // Capitalize condition
      disability.condition.charAt(0).toUpperCase() +
      disability.condition.slice(1),
  );

  return (
    <div>
      <p>Your claim includes these new conditions:</p>
      <ul>
        {conditions.map((condition, index) => (
          <li key={index}>
            <strong>{condition}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const workflowChoicePageDescription = formData => {
  return (
    <>
      {conditionSelections(formData)}
      <h4>When to consider adding VA Form 21-0781 to your claim</h4>
      <p>
        We offer this optional form for you to share more supporting information
        about certain conditions. If your claim includes a new mental health
        condition (like PTSD, major depression, or generalized anxiety disorder)
        that’s related to a traumatic event you experienced during military
        service, we encourage you to submit this form.
      </p>
      <p>
        We’ll need to ask you about the traumatic events you experienced and any
        behavioral changes that you experienced as a result. Answer as many or
        as few of the questions that you feel comfortable answering. We’ll use
        any information you can share to support your claim.
      </p>
      <p>
        To answer all the questions, you’ll likely need about 45 minutes. You
        can answer the questions online. Or, you can fill out a PDF version of
        the form and upload it as part of your online submission.
      </p>
      <p>
        <va-link
          external
          href="https://www.va.gov/find-forms/about-form-21-0781/"
          text="Get VA Form 21-0781 to download"
        />
      </p>
    </>
  );
};

export const form0781WorkflowChoiceDescription =
  'Do you want to add VA Form 21-0781?';

export const form0781WorkflowChoices = {
  COMPLETE_ONLINE_FORM: 'optForOnlineForm0781',
  SUBMIT_PAPER_FORM: 'optForPaperForm0781Upload',
  OPT_OUT_OF_FORM0781: 'optOutOfForm0781',
};

export const form0781WorkflowChoiceLabels = Object.freeze({
  [form0781WorkflowChoices.COMPLETE_ONLINE_FORM]:
    'Yes, and I want to answer the questions online.',
  [form0781WorkflowChoices.SUBMIT_PAPER_FORM]:
    'Yes, and I want to fill out a PDF to upload.',
  [form0781WorkflowChoices.OPT_OUT_OF_FORM0781]:
    'No, I don’t want to add this form to my claim.',
});

export const traumaticEventsExamples = (
  <va-accordion open-single>
    <va-accordion-item class="vads-u-margin-y--3" id="first" bordered>
      <h3 slot="headline">
        Examples of mental health conditions and traumatic events
      </h3>
      <h4 className="vads-u-margin-top--0">
        Examples of mental health conditions
      </h4>
      <p>
        Some examples of diagnosed mental health conditions include, but are not
        limited to:
      </p>
      <ul>
        <li>Post traumatic stress disorder (PTSD)</li>
        <li>Depression</li>
        <li>Anxiety</li>
        <li>Bipolar disorder</li>
      </ul>
      <h4 className="vads-u-margin-top--0">
        Examples of traumatic events related to combat
      </h4>
      <ul>
        <li>You were engaged in combat with enemy forces</li>
        <li>You experienced fear of hostile military or terrorist activity</li>
        <li>You served in an imminent danger area</li>
        <li>You served as a drone aircraft crew member</li>
      </ul>
      <h4 className="vads-u-margin-top--0">
        Examples of traumatic events related to sexual assault or harassment
      </h4>
      <ul>
        <li>
          You experienced pressure to engage in sexual activities (for example,
          someone threatened you with bad treatment for refusing sex, or
          promised you better treatment in exchange for sex)
        </li>
        <li>
          You were pressured into sexual activities against your will (for
          example, when you were asleep or intoxicated)
        </li>
        <li>You were physically forced into sexual activities</li>
        <li>
          You experienced offensive comments about your body or sexual
          activities
        </li>
        <li>You experienced unwanted sexual advances</li>
        <li>
          You experienced someone touching or grabbing you against your will,
          including during hazing
        </li>
      </ul>
      <h4 className="vads-u-margin-top--0">
        Examples of traumatic events related to other personal interactions
      </h4>
      <ul>
        <li>
          You experienced physical assault, battery, robbery, mugging, stalking,
          or harassment by a person who wasn’t part of an enemy force
        </li>
        <li>You experienced domestic intimate partner abuse or harassment</li>
      </ul>
      <h4 className="vads-u-margin-top--0">
        Examples of other traumatic events
      </h4>
      <ul>
        <li>You got into a car accident</li>
        <li>You witnessed a natural disaster, like a hurricane</li>
        <li>You worked on burn ward or graves registration</li>
        <li>
          You witnessed the death, injury, or threat to another person or to
          yourself, that was caused by something other than a hostile military
          or terrorist activity
        </li>
        <li>
          You experienced or witnessed friendly fire that occurred on a gunnery
          range during a training mission
        </li>
      </ul>
    </va-accordion-item>
  </va-accordion>
);

export const mstAlert = () => {
  return (
    <>
      <va-alert-expandable
        status="info"
        trigger="Learn more about treatment for military sexual trauma"
      >
        <p>
          If you experienced military sexual trauma (MST), we provide treatment
          for any physical or mental health conditions related to your
          experiences.
        </p>
        <br />
        <p>
          You don’t need to file a disability claim or have a disability rating
          to get care. These services are available to Veterans regardless of
          discharge status. You may be able to receive MST-related health care
          even if you’re not eligible for other VA health care.
        </p>
        <br />
        <p>
          <va-link
            external
            href="https://www.va.gov/health-care/health-needs-conditions/military-sexual-trauma/"
            text="Learn more about MST-related benefits and services"
          />
        </p>
      </va-alert-expandable>
    </>
  );
};
