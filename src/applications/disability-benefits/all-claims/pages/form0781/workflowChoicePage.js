import { VaRadioField } from '@department-of-veterans-affairs/platform-forms-system/web-component-fields';

// TODO: move to utils/constants
export const form0781WorkflowChoices = {
  COMPLETE_ONLINE_FORM: 'optForOnlineForm0781',
  SUBMIT_PAPER_FORM: 'optForPaperForm0781Upload',
  OPT_OUT_OF_FORM0781: 'optOutOfForm0781',
};

export const schema = {
  type: 'object',
  required: ['pTSDWorkflowChoice'],
  properties: {
    pTSDWorkflowChoice: {
      type: 'string',
      // Gross, better js way to do this:
      enum: Object.keys(form0781WorkflowChoices).map(
        key => form0781WorkflowChoices[key],
      ),
    },
  },
};

export const uiSchema = {
  'ui:description': 'Placeholder Text for workflow choice page',
  pTSDWorkflowChoice: {
    'ui:title': 'CHOICETITLE',
    'ui:widget': 'radio', // Required?
    'ui:webComponentField': VaRadioField,
    'ui:options': {
      labels: {
        // Placeholder copy:
        [form0781WorkflowChoices.COMPLETE_ONLINE_FORM]: 'Complete online form',
        [form0781WorkflowChoices.SUBMIT_PAPER_FORM]: 'Submit paper form',
        [form0781WorkflowChoices.OPT_OUT_OF_FORM0781]: 'Opt out of Form 0781',
      },
      // descriptions: {
      //   ...TODO: are these needed for accessibility? Are they tooltips?
      // }
    },
  },
};
