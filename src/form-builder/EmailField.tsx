import React from 'react';
import { FieldHookConfig, useField } from 'formik';

import { FieldProps } from './types';
import { chainValidations, isValidEmail, required } from '../utils/validation';
import TextField from './TextField';

export type EmailProps = FieldProps<string>;

/**
 * Renders the EmailField component
 *
 * @beta
 */
const EmailField = (props: EmailProps): JSX.Element => {
  const withValidation = {
    ...props,
    validate: chainValidations(props, [required, isValidEmail]),
  };
  const [field, meta, helpers] = useField(
    withValidation as FieldHookConfig<string>
  );
  const id = props.id || props.name;
  const value = field.value;

  return (
    <TextField
      id={id}
      {...props}
      onChange={field.onChange}
      value={value}
      required
      onBlur={() => helpers.setTouched(true)}
    />
  );
};

export default EmailField;
