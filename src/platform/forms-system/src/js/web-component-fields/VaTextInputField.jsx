import React from 'react';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaTextInputFieldMapping from './vaTextInputFieldMapping';

/**
 * Usage uiSchema:
 * ```
 * textInput: {
 *   'ui:title': 'Text input',
 *   'ui:description': 'description',
 *   'ui:webComponentField': VaTextInputField,
 *   'ui:hint': 'hint',
 *   'ui:errorMessages': {
 *     required: 'This is a custom error message.',
 *   },
 *   'ui:options': {
 *     width: 'md',
 *     charcount: true,
 *     messageAriaDescribedby: 'text description to be read by screen reader',
 *     inert: true,
 *     enableAnalytics: true,
 *   },
 * }
 * ```
 *
 * Usage schema:
 * ```
 * textInput: {
 *   type: 'string',
 *   minLength: 1,
 *   maxLength: 24,
 * }
 * ```
 * @param {WebComponentFieldProps} props */
export default function VaTextInputField(props) {
  const mappedProps = vaTextInputFieldMapping(props);
  return <VaTextInput {...mappedProps} />;
}
