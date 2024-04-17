import SponsorRadioWidget from '../../components/SponsorRadioWidget';

export const uiSchema = {
  application: {
    applicant: {
      isSponsor: {
        'ui:title': "Are you the applicant's sponsor?",
        'ui:widget': SponsorRadioWidget,
        'ui:options': {
          updateSchema: () => {
            return {
              enumNames: ['Yes', 'No'],
            };
          },
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        applicant: {
          type: 'object',
          required: ['isSponsor'],
          properties: {
            isSponsor: {
              type: 'string',
              enum: ['yes', 'no'],
            },
          },
        },
      },
    },
  },
};
