import BenefitsCard from '../../components/BenefitsCard';

export const uiSchema = {
  'ui:title': 'Your VA benefits',
  'ui:description':
    'This is the VA benefit information we have on file for you.',
  vaBenefitsOnFile: {
    'ui:field': BenefitsCard,
  },
};
export const schema = {
  type: 'object',
  properties: {
    vaBenefitsOnFile: {
      type: 'object',
      properties: {
        income: {
          type: 'array',
          items: {
            type: 'object',
            title: 'Benefit',
            properties: {
              veteranOrSpouse: {
                type: 'string',
              },
              compensationAndPension: {
                type: 'string',
              },
              education: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
};
