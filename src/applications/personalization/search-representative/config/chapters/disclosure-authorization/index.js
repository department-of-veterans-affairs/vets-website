const description =
  'Choose which protected treatment records you authorize your accredited representative to access.';

export const schema = {
  type: 'object',
  properties: {
    authorizations: {
      type: 'object',
      properties: {
        drugAbuse: {
          type: 'boolean',
          title: 'Drug Abuse',
        },
        alcoholAbuse: {
          type: 'boolean',
          title: 'Alcoholism or alcohol use problems',
        },
        hiv: {
          type: 'boolean',
          title: 'Human immunodeficiency virus (HIV)',
        },
        sickleCellAnemia: {
          type: 'boolean',
          title: 'Sickle cell anemia',
        },
      },
    },
  },
};

export const uiSchema = {
  'ui:description': description,
  authorizations: {
    drugAbuse: {},
    alcoholAbuse: {},
    hiv: {},
    sickleCellAnemia: {},
  },
};
