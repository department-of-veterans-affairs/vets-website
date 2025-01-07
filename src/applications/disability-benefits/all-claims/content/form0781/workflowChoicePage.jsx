import React from 'react';

export const workflowChoicePageTitle =
  'Statement about mental health conditions (VA Form 21-0781)';

export const workflowChoicePageDescription = (
  <>
    <p>
      You selected these mental health conditions: <b>PTSD, Depression</b>.
    </p>
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

export const form0781WorkflowChoices = {
  COMPLETE_ONLINE_FORM: 'optForOnlineForm0781',
  SUBMIT_PAPER_FORM: 'optForPaperForm0781Upload',
  OPT_OUT_OF_FORM0781: 'optOutOfForm0781',
};

export const form0781WorkflowChoiceLabels = Object.freeze({
  [form0781WorkflowChoices.COMPLETE_ONLINE_FORM]: 'Complete online form',
  [form0781WorkflowChoices.SUBMIT_PAPER_FORM]: 'Submit paper form',
  [form0781WorkflowChoices.OPT_OUT_OF_FORM0781]: 'Opt out of Form 0781',
});
