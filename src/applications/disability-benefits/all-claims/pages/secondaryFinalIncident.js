import { additionalInfo } from '../content/ptsdFinalIncident';
import { ptsd781aNameTitle } from '../content/ptsdClassification';

export const uiSchema = {
  'ui:title': ptsd781aNameTitle,
  'ui:description': additionalInfo,
  additionalSecondaryIncidentText: {
    'ui:title':
      'If there are additional events that contributed to your PTSD, you can provide information about them here. You can give us as much or as little information as you feel comfortable sharing, including the date and location of the event. This will help with our research.',
    'ui:widget': 'textarea',
  },
};

export const schema = {
  type: 'object',
  properties: {
    additionalSecondaryIncidentText: {
      type: 'string',
    },
  },
};
