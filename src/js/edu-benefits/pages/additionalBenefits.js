import _ from 'lodash/fp';

import { civilianBenefitsLabel } from '../utils/helpers';

const defaults = {
  fields: [
    'nonVaAssistance',
    'civilianBenefitsAssistance'
  ],
  required: []
};


/**
 * Returns an additionalBenefits page based on the options passed.
 *
 * @param {Object} schema   The full schema for the form
 * @param {Object} options  Options to override the defaults above
 */
export default function additionalBenefits(schema, options) {
  // Use the defaults as necessary, but override with the options given
  const mergedOptions = _.assign(defaults, options);
  const { fields, required } = mergedOptions;

  const possibleProperties = {
    nonVaAssistance: schema.properties.nonVaAssistance,
    civilianBenefitsAssistance: schema.properties.civilianBenefitsAssistance,
    civilianBenefitsSource: schema.properties.civilianBenefitsSource
  };

  return {
    path: 'applicant/additional-benefits',
    title: 'Additional Benefits',
    initialData: {},
    uiSchema: {
      'ui:order': fields,
      nonVaAssistance: {
        'ui:title': 'Are you getting, or do you expect to get any money (including, but not limited to, federal tuition assistance) from the Armed Forces or public health services for any part of your coursework or training?',
        'ui:widget': 'yesNo'
      },
      civilianBenefitsAssistance: {
        'ui:title': civilianBenefitsLabel,
        'ui:widget': 'yesNo'
      },
      civilianBenefitsSource: {
        'ui:title': 'What is the source of these funds?',
        'ui:required': (formData) => formData.civilianBenefitsAssistance,
        'ui:options': {
          expandUnder: 'civilianBenefitsAssistance'
        }
      }
    },
    schema: {
      type: 'object',
      required,
      properties: _.pick(fields, possibleProperties)
    }
  };
}
