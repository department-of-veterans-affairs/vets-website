import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Request a Free Turtle'),
    turtleRequest: {
      'ui:title': 'Turtle Information',
      'ui:description':
        'Please provide details about the turtle you would like to request.',
      turtleName: {
        'ui:title': 'Turtle Name',
        'ui:description': 'What would you like to name your turtle?',
        'ui:widget': 'text',
        'ui:required': true,
      },
      turtleColor: {
        'ui:title': 'Turtle Color',
        'ui:description': 'What color turtle would you prefer?',
        'ui:widget': 'select',
        'ui:required': true,
        'ui:options': {
          labels: {
            green: 'Green',
            red: 'Red',
            blue: 'Blue',
            yellow: 'Yellow',
            purple: 'Purple',
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      turtleRequest: {
        type: 'object',
        required: ['turtleName', 'turtleColor'],
        properties: {
          turtleName: {
            type: 'string',
            maxLength: 50,
          },
          turtleColor: {
            type: 'string',
            enum: ['green', 'red', 'blue', 'yellow', 'purple'],
          },
        },
      },
    },
  },
};
