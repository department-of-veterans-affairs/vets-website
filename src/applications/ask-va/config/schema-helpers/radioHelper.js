import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const radioUI = ({ title, description, ...uiOptions }) => {
  return {
    'ui:title': title,
    'ui:description': description,
    'ui:webComponentField': VaRadio,
    'ui:widget': 'radio',
    'ui:options': {
      ...uiOptions,
    },
  };
};

export const radioSchema = labels => {
  return {
    type: 'string',
    enum: labels,
  };
};
