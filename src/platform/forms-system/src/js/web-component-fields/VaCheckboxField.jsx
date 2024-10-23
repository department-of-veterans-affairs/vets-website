import React from 'react';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaCheckboxFieldMapping from './vaCheckboxFieldMapping';

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
  const mappedProps = vaCheckboxFieldMapping(props);
  return <VaCheckbox {...mappedProps} />;
}

VaCheckboxField.identifier = 'VaCheckboxField';
