import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';

const { currentlyActiveDuty } = fullSchema1995.definitions;

export const uiSchema = {
  currentlyActiveDuty: {
    yes: {
      'ui:title': 'Are you on active duty now?',
      'ui:widget': 'yesNo',
    },
    onTerminalLeave: {
      'ui:title': 'Are you on terminal leave now?',
      'ui:widget': 'yesNo',
      'ui:options': {
        expandUnder: 'yes',
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    currentlyActiveDuty: {
      type: 'object',
      properties: {
        yes: currentlyActiveDuty.properties.yes,
        onTerminalLeave: currentlyActiveDuty.properties.onTerminalLeave,
      },
    },
  },
};
