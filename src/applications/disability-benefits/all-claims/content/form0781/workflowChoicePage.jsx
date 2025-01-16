import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';

export const workflowChoicePageTitle = (
  <div className="vads-u-font-size--h3">
    Statement about mental health conditions (VA Form 21-0781)
  </div>
);

// Lists new conditions the veteran has claimed
const conditionSelections = formData => {
  const conditions = formData?.newDisabilities?.map(
    disability =>
      // Capitalize condition
      disability.condition.charAt(0).toUpperCase() +
      disability.condition.slice(1),
  );

  if (conditions?.length) {
    return (
      <p>
        {/* Leave space ahead of conditions list */}
        You selected these new conditions for your disability claim:{' '}
        <strong>{conditions.join(', ')}</strong>.
      </p>
    );
  }

  return <></>;
};

export const workflowChoicePageDescription = formData => {
  return (
    <>
      {conditionSelections(formData)}
      <p>
        You can complete VA Form 21-0781 to provide more information about your
        mental health conditions. It should take about 45 minutes.
      </p>
      <p>
        We encourage you to complete this form to support your disability claim.
        This form is optional and you can respond to only the questions you’re
        comfortable answering.
      </p>
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
    'Yes, I want to complete VA Form 21-0781 online right now',
  [form0781WorkflowChoices.SUBMIT_PAPER_FORM]:
    'Yes, but I’ve already completed the PDF version of VA Form 21-0781 and I want to submit it with my claim',
  [form0781WorkflowChoices.OPT_OUT_OF_FORM0781]:
    'No, I don’t want to complete VA Form 21-0781 (opt out)',
});

export const ptsdQuestionsPreview = (
  <VaAdditionalInfo trigger="We'll ask you questions about these topics">
    <ul>
      <li>
        Traumatic events during your military service that are related to your
        mental health conditions
      </li>

      <li>Behavioral changes you experienced after the traumatic events</li>
    </ul>
  </VaAdditionalInfo>
);
