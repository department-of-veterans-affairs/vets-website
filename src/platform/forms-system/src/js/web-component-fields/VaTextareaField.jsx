import React from 'react';
import { VaTextarea } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaTextareaFieldMapping from './vaTextareaFieldMapping';

/**
 * Usage uiSchema:
 * ```
 * textArea: {
 *   'ui:title': 'A text area',
 *   'ui:description': 'Text description',
 *   'ui:webComponentField': VaTextareaField,
 * }
 * ```
 *
 * Usage schema:
 * ```
 * textArea: {
 *   type: 'string',
 * }
 * ```
 * @param {WebComponentFieldProps} props */
export default function VaTextAreaField(props) {
  const mappedProps = vaTextareaFieldMapping(props);
  return <VaTextarea {...mappedProps} />;
}
