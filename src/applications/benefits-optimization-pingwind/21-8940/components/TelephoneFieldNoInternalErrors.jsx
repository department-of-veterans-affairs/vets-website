import React from 'react';
import { VaTelephoneInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaTelephoneInputFieldMapping from 'platform/forms-system/src/js/web-component-fields/vaTelephoneInputFieldMapping';

/**
 * Wrapper around the default telephone input field so we can disable the
 * component's internal validation messages. This lets the form system decide
 * when to surface errors (e.g. only after an invalid entry).
 */
export default function TelephoneFieldNoInternalErrors(props) {
  const mappedProps = vaTelephoneInputFieldMapping(props);

  return <VaTelephoneInput {...mappedProps} showInternalErrors={false} />;
}
