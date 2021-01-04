import ItemLoop from '../../components/ItemLoop';
import CardDetailsView from '../../components/CardDetailsView';

export const uiSchema = {
  'ui:title': 'Your spouse information',
  employment: {
    spousePreviousEmployment: {
      'ui:title': 'Has your spouse had additional jobs in the past two years?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    spousePreviousEmploymentRecords: {
      'ui:field': ItemLoop,
      'ui:description':
        'Please provide your spouse’s employment history for the past two years.',
      'ui:options': {
        expandUnder: 'spousePreviousEmployment',
        viewField: CardDetailsView,
        doNotScroll: true,
        showSave: true,
        itemName: 'Add a job',
      },
      items: {
        spouseEmploymentType: {
          'ui:title': 'Type of employment',
          'ui:options': {
            widgetClassNames: 'input-size-3',
          },
        },
        spouseEmploymentStart: {
          'ui:title': 'Employment start date',
          'ui:widget': 'date',
          'ui:required': formData =>
            formData.employment.spousePreviousEmployment,
        },
        spouseEmploymentEnd: {
          'ui:title': 'Employment end date',
          'ui:widget': 'date',
          'ui:required': formData =>
            formData.employment.spousePreviousEmployment,
        },
        spouseEmployerName: {
          'ui:title': 'Employer name',
          'ui:options': {
            widgetClassNames: 'input-size-6',
          },
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    employment: {
      type: 'object',
      properties: {
        spousePreviousEmployment: {
          type: 'boolean',
        },
        spousePreviousEmploymentRecords: {
          type: 'array',
          items: {
            type: 'object',
            required: ['spouseEmploymentStart', 'spouseEmploymentEnd'],
            properties: {
              spouseEmploymentType: {
                type: 'string',
                enum: ['Full time', 'Part time', 'Seasonal', 'Temporary'],
              },
              spouseEmploymentStart: {
                type: 'string',
              },
              spouseEmploymentEnd: {
                type: 'string',
              },
              spouseEmployerName: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
};
