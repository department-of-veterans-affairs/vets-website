import React from 'react';
import { VaNumberInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaNumberInputFieldMapping from './vaNumberInputFieldMapping';

/**
 * Usage uiSchema:
 * ```
 * amount: {
 *   'ui:title': 'A number input',
 *   'ui:description': 'Text description',
 *   'ui:webComponentField': VaNumberInputField,
 *   'ui:errorMessages': {
 *     pattern: 'Please enter a valid number',
 *   },
 *   'ui:options': {
 *     currency: true,
 *     width: 'xs',
 *     hint: 'Hint text',
 *     inputmode: 'numeric',
 *   },
 * }
 * ```
 *
 * Usage schema:
 * ```
 * amount: {
 *   type: 'string',
 *   pattern: '^\\d*$',
 * }
 * ```
 * @param {WebComponentFieldProps} props */
export default function VaNumberInputField(props) {
  const mappedProps = vaNumberInputFieldMapping(props);
  return <VaNumberInput {...mappedProps} />;
}
