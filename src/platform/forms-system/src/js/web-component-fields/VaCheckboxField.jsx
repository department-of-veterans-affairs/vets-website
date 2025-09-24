import environment from 'platform/utilities/environment';
import PropTypes from 'prop-types';
import React from 'react';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaCheckboxFieldMapping from './vaCheckboxFieldMapping';

function error(message) {
  if (!environment.isProduction()) {
    throw new Error(message);
  }
}

const errorRequiredText = name =>
  [
    `Could not set required for field ${name}.`,
    'When setting required for a checkbox, it needs both required and enum set:\n' +
      `1. "required" - to check that it is not undefined - Include ${name} in the schema required array, or use \`ui:required\`.\n` +
      `2. "enum" - to only allow "true" and not "false" - Use \`checkboxRequiredSchema\` instead of \`checkboxSchema\`, or set \`enum: [true]\` on the schema.properties.${name}, or use ui:validations or updateSchema.`,
  ].join(' ');

function validateCheckboxRequired(props, uiOptions, childrenProps) {
  const hasDynamicRequired = childrenProps.uiSchema['ui:required'];

  if (!hasDynamicRequired) {
    const checksForTrue =
      childrenProps.schema.enum ||
      childrenProps.uiSchema['ui:validations'] ||
      uiOptions?.replaceSchema ||
      uiOptions?.updateSchema;

    if (props.required && !checksForTrue) {
      error(errorRequiredText(childrenProps.name));
    }

    if (checksForTrue && !props.required) {
      error(errorRequiredText(childrenProps.name));
    }
  }
}
/**
 * Usage uiSchema:
 * ```
 * checkbox: {
 *   'ui:title': 'This is a checkbox',
 *   'ui:description': 'This is a checkbox with a description',
 *   'ui:webComponentField': VaCheckboxField,
 *   'ui:errorMessages': {
 *     enum: 'Please select a checkbox',
 *     required: 'Checkbox required error',
 *   },
 * }
 * ```
 *
 * Usage schema:
 * ```
 * checkbox: {
 *   type: 'boolean',
 *   enum: [true],
 * }
 * ```
 * @param {WebComponentFieldProps} props */
export default function VaCheckboxField(props) {
  const { uiOptions, childrenProps } = props;

  const mappedProps = vaCheckboxFieldMapping(props);

  if (uiOptions?.validateRequired) {
    validateCheckboxRequired(props, uiOptions, childrenProps);
  }

  return <VaCheckbox {...mappedProps} />;
}

VaCheckboxField.identifier = 'VaCheckboxField';

VaCheckboxField.propTypes = {
  DescriptionField: PropTypes.any,
  childrenProps: PropTypes.oneOfType([
    PropTypes.shape({
      formData: PropTypes.any,
      schema: PropTypes.object,
      uiSchema: PropTypes.object,
    }),
    PropTypes.object,
  ]),
  description: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
    PropTypes.string,
  ]),
  error: PropTypes.string,
  index: PropTypes.number,
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  required: PropTypes.bool,
  textDescription: PropTypes.string,
  uiOptions: PropTypes.object,
};
