import React from 'react';
import { VaFileInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaFileInputFieldMapping from './vaFileInputFieldMapping';

/**
 * Usage uiSchema:
 * ```
 * fileInput: {
 *   'ui:title': 'A file input',
 *   'ui:description': 'Text description',
 *   'ui:webComponentField': VaFileInput,
 *   'ui:hint': 'hint',
 *   'ui:errorMessages': {
 *     required: 'This is a custom error message.',
 *   },
 *   'ui:options': {
 *     accept: '.pdf,.jpeg,.png',
 *     messageAriaDescribedby: 'text description to be read by screen reader',
 *     enableAnalytics: true,
 *   },
 * }
 * ```
 *
 * Usage schema:
 * ```
 * fileInput: {
 *   type: 'string',
 *   minLength: 1,
 *   maxLength: 24,
 * }
 * ```
 * @param {WebComponentFieldProps} props */
const VaFileInputField = props => {
  const mappedProps = vaFileInputFieldMapping(props);
  return <VaFileInput {...mappedProps} />;
};

export default VaFileInputField;
