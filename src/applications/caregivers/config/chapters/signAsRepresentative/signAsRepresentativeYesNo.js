import { representativeFields } from 'applications/caregivers/definitions/constants';
import { RepresentativeDescription } from 'applications/caregivers/components/FormDescriptions';

const representativePage = {
  uiSchema: {
    'ui:description': RepresentativeDescription,
    [representativeFields.signAsRepresentativeYesNo]: {
      'ui:title': 'Select who will sign for the Veteran today:',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          no: 'The Veteran',
          yes:
            'A representative with legal authority to make decisions for the Veteran',
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [representativeFields.signAsRepresentativeYesNo]: {
        type: 'string',
        enum: ['no', 'yes'],
      },
    },
  },
};

export default representativePage;
