import React, { useEffect } from 'react';
import { VaTextarea } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaTextareaFieldMapping from './vaTextareaFieldMapping';

/**
 * Usage uiSchema:
 * ```
 * textArea: {
 *   'ui:title': 'A text area',
 *   'ui:description': 'Text description',
 *   'ui:webComponentField': VaTextareaField,
 *   'ui:hint': 'hint',
 *   'ui:errorMessages': {
 *     required: 'This is a custom error message.',
 *   },
 *   'ui:options': {
 *     charcount: true,
 *     messageAriaDescribedby: 'text description to be read by screen reader',
 *     enableAnalytics: true,
 *   },
 * }
 * ```
 *
 * Usage schema:
 * ```
 * textArea: {
 *   type: 'string',
 *   minLength: 1,
 *   maxLength: 24,
 * }
 * ```
 * @param {WebComponentFieldProps} props */
export default function VaTextAreaField(props) {
  const mappedProps = vaTextareaFieldMapping(props);
  return <VaTextarea {...mappedProps} />;
}

// TODO: This is just an idea
export function StyledLabelComponent({ Component, classNames }) {
  useEffect(() => {
    if (Component && Component.shadowRoot) {
      const label = Component.shadowRoot.querySelector('label');
      label.classNames = classNames;
    }
  }, []);

  return <Component />;
}

StyledLabelComponent.propTypes = {};
