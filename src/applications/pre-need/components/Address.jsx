import AddressWidget from './AddressWidget';

/*
 * Phone uiSchema
 *
 * @param {string} title - The field label, defaults to Phone
 */
export default function uiSchema(title = 'Address Example I hope this Works') {
  return {
    'ui:widget': AddressWidget,
    'ui:title': title,
    'ui:options': {
      widgetClassNames: 'va-input-medium-large',
    },
  };
}
