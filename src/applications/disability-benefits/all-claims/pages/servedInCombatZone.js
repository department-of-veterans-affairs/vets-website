import fullSchema from '../config/schema';

const { servedInCombatZonePost911 } = fullSchema.properties;

export const uiSchema = {
  servedInCombatZonePost911: {
    'ui:title': 'Did you serve in a combat zone after 9/11/2001?',
    'ui:widget': 'yesNo',
  },
};

export const schema = {
  type: 'object',
  required: ['servedInCombatZonePost911'],
  properties: {
    servedInCombatZonePost911,
  },
};
