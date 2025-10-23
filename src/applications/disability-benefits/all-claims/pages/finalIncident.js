import { additionalInfo } from '../content/ptsdFinalIncident';
import { ptsd781NameTitle } from '../content/ptsdClassification';

export const uiSchema = {
  'ui:title': ptsd781NameTitle,
  'ui:description': additionalInfo,
  additionalIncidentText: {
    'ui:title':
      'If there are additional events that contributed to your PTSD, you can provide information about them here. You can give us as much or as little information as you feel comfortable sharing, including the date and location of the event and the names of anyone involved. This will help with our research.',
    'ui:widget': 'textarea',
  },
};

export const schema = {
  type: 'object',
  properties: {
    additionalIncidentText: {
      type: 'string',
    },
  },
};
