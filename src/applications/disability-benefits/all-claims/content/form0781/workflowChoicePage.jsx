import React from 'react';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const workflowChoicePageTitle = (
  <div className="vads-u-font-size--h3">
    Statement about mental health conditions (VA Form 21-0781)
  </div>
);

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
      <p>You selected these new conditions for your disability claim:</p>
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

const optOutOfForm0781Modal = () => {
  // const optOutOfForm0781Modal = formData => {
  // const [modal, showModal] = useState(false);
  // const isOptedOut = formData?.['view:mentalHealthWorkflowChoice'] === 'optOutOfForm0781';
  // if(isOptedOut){
  //   showModal(true);
  // }
  // console.log('Is opt-out selected:', isOptedOut);

  /**
   * declare event handlers
   *  - onCancel - fired on modal close and secondary button click - no action taken
   *  - onChange - fired when data from local form components is updated
   *  - onConfirm - fired on modal primary button click - returns to dependents summary page in form
   *  - onGoBack - fired on click of back progress button - render previous form fieldset or go back to summary page
   *  - onSubmit - fired on click of continue progress button - render next form fieldset or populate data into array
   *  - showConfirm - fired on cancel button click - show modal for confirmation of cancel action
   */
  const handlers = {
    onCancel: () => {
      // showModal(false);
    },
    onChange: () => {
      // setLocalData({ ...localData, ...formData });
      // console.log(`change happened, ${formData}`);
    },
    onConfirm: () => {
      // setLocalData(null);
      // goToPath(searchAction.pathToGo);
      // console.log('confirmed');
    },
    onGoBack: () => {
      // const index = activePages.findIndex(item => item.id === currentPage.id);
      // if (index > 0) {
      //   setCurrentPage(activePages[index - 1]);
      // } else {
      //   handlers.showConfirm();
      // }
      // console.log('go back');
    },
    onSubmit: () => {
      // const index = activePages.findIndex(item => item.id === currentPage.id);
      // if (index === activePages.length - 1) {
      //   const dataToSet = getDataToSet({
      //     slices: {
      //       beforeIndex: dependents.slice(0, searchIndex),
      //       afterIndex: dependents.slice(searchIndex + 1),
      //     },
      //     viewFields: DEPENDENT_VIEW_FIELDS,
      //     dataKey: 'dependents',
      //     localData,
      //     listRef,
      //   });
      //   setFormData({ ...data, ...dataToSet });
      //   goToPath(searchAction.pathToGo);
      // } else {
      //   setCurrentPage(activePages[index + 1]);
      // }
      // console.log('submit');
    },
    showConfirm: () => {
      // showModal(true);
    },
  };
  return (
    <VaModal
      clickToClose
      status="warning"
      modalTitle="Opt out of VA Form 21-0781?"
      primaryButtonText="Yes, opt me out"
      secondaryButtonText="No, return to claim"
      onPrimaryButtonClick={handlers.onConfirm}
      onSecondaryButtonClick={handlers.onCancel}
      onCloseEvent={handlers.onCancel}
      visible
      uswds
    >
      <p>
        If you opt out of the 21-0781, you’ll lose any answers you’ve provided
        about your mental health conditions. This includes descriptions about
        your traumatic events and behavioral changes, and details about mental
        health related supporting documents.
      </p>
      <p>Do you want to opt out of form 21-0781?</p>
    </VaModal>
  );
};

export const workflowChoicePageDescription = formData => {
  return (
    <>
      {conditionSelections(formData)}
      <p>
        If any of these are diagnosed mental health conditions related to a
        traumatic event you experienced during military service, you can
        complete an additional form to provide more information to support your
        claim (VA Form 21-0781).
      </p>
      <p>
        <strong>This additional form is optional.</strong> In this form, we ask
        you about the traumatic events you experienced and any behavioral
        changes that you experienced afterwards.
      </p>
      <p>
        We encourage you to complete this form if it applies to you. The
        information you provide supports your claim for these conditions. In
        this form, you can also choose to only provide responses for the
        questions you’re comfortable answering.
      </p>
      <p>Completing this additional form should take about 45 minutes.</p>
      {optOutOfForm0781Modal()}
      {/* {optOutOfForm0781Modal(formData)} */}
    </>
  );
};

export const form0781WorkflowChoiceDescription =
  'Do you want to provide more information about your mental health conditions?';

export const form0781WorkflowChoices = {
  COMPLETE_ONLINE_FORM: 'optForOnlineForm0781',
  SUBMIT_PAPER_FORM: 'optForPaperForm0781Upload',
  OPT_OUT_OF_FORM0781: 'optOutOfForm0781',
};

export const form0781WorkflowChoiceLabels = Object.freeze({
  [form0781WorkflowChoices.COMPLETE_ONLINE_FORM]:
    'Yes, I want to complete VA Form 21-0781 online',
  [form0781WorkflowChoices.SUBMIT_PAPER_FORM]:
    "Yes, but I've already filled out a PDF of VA Form 21-0781 and I want to upload it to my claim",
  [form0781WorkflowChoices.OPT_OUT_OF_FORM0781]:
    "No, I don't want to complete VA Form 21-0781 (opt out)",
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
            text="Learn more about MST-related benefits and services (opens in a new tab)"
          />
        </p>
      </va-alert-expandable>
    </>
  );
};
