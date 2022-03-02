import { representativeFields } from 'applications/caregivers/definitions/constants';
import { RepresentativeIntroContent } from 'applications/caregivers/components/AdditionalInfo';

const representativePage = {
  uiSchema: {
    'ui:description': RepresentativeIntroContent(),
    'ui:options': {
      classNames:
        'vads-u-background-color--gray-lightest vads-u-padding-top--0p5 vads-u-padding-bottom--2p5 vads-u-padding-x--3',
    },
    [representativeFields.signAsRepresentativeYesNo]: {
      'ui:title': 'Select who will sign for the Veteran today:',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          no: 'The Veteran',
          yes:
            'A representative with legal authority to make medical decisions for the Veteran',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      [representativeFields.signAsRepresentativeYesNo]: {
        type: 'string',
        enum: ['no', 'yes'],
      },
    },
  },
};

export default representativePage;
