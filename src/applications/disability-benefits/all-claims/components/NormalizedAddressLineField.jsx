import React, { useCallback } from 'react';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaTextInputFieldMapping from 'platform/forms-system/src/js/web-component-fields/vaTextInputFieldMapping';
import { normalizeAddressLine } from '../utils/contactInformationHelpers';

/**
 * A custom text input field that normalizes address lines on blur.
 * This trims leading/trailing spaces and collapses multiple consecutive spaces.
 * Used for address line fields so users see the cleaned value before submission.
 *
 * @param {WebComponentFieldProps} props
 */
export default function NormalizedAddressLineField(props) {
  const mappedProps = vaTextInputFieldMapping(props);
  const { childrenProps } = props;

  const handleBlur = useCallback(
    () => {
      // Call the original onBlur to trigger validation
      childrenProps.onBlur(childrenProps.idSchema.$id);

      // Normalize the value if it exists and has changed
      if (childrenProps.formData) {
        const normalizedValue = normalizeAddressLine(childrenProps.formData);
        if (normalizedValue !== childrenProps.formData) {
          childrenProps.onChange(normalizedValue);
        }
      }
    },
    [childrenProps],
  );

  return <VaTextInput {...mappedProps} onBlur={handleBlur} />;
}
