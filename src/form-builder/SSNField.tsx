import React, { useState } from 'react';
import { FieldHookConfig, useField } from 'formik';

import { FieldProps } from './types';
import { chainValidations, isValidSSN, required } from '../utils/validation';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export type SSNProps = FieldProps<string>;

/**
 * Renders the SSNField component
 *
 * @beta
 */
const SSNField = (props: SSNProps): JSX.Element => {
  // Note: In this component, the Formik variable "field.value" holds the raw SSN value,
  // while the useState variable "ssn" controls the view and will render the masked SSN to the page
  const withValidation = {
    ...props,
    validate: chainValidations(props, [required, isValidSSN]),
  };
  const [field, meta, helpers] = useField(
    withValidation as FieldHookConfig<string>
  );
  const id = props.id || props.name;

  const [ssn, setSSN] = useState('');

  const onFocus = () => {
    if (!field.value) return;
    const valueWithoutDashes = field.value.replaceAll('-', '');

    setSSN(valueWithoutDashes);
  };

  const onBlur = (event: Event) => {
    setTimeout(() => {
      const { value } = event.target as HTMLTextAreaElement;
      const ssnString: string = value.replaceAll('-', '');
      helpers.setValue(ssnString);
      helpers.setTouched(true);

      let maskedSSNString = '';

      if (ssnString.length) {
        const strippedSSN = ssnString.replace(/[- ]/g, '');
        const maskedSSN = strippedSSN.replace(/^\d{1,5}/, (digit) =>
          digit.replace(/\d/g, '●')
        );

        maskedSSNString = [
          [...maskedSSN].splice(0, 3).join(''),
          [...maskedSSN].splice(3, 2).join(''),
          [...maskedSSN].splice(5).join(''),
        ].join('-');
      }

      setSSN(maskedSSNString);
    }, 0);
  };

  return (
    <VaTextInput
      {...props}
      id={id}
      value={ssn}
      maxlength={11}
      onFocus={onFocus}
      onBlur={onBlur}
      error={(meta.touched && meta.error) || undefined}
    />
  );
};

export default SSNField;
