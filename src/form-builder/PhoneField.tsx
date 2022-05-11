import React from 'react';
import { useField, FieldHookConfig } from 'formik';
import { FieldProps } from './types';
import { chainValidations, isValidPhone, required } from '../utils/validation';
import TextField from './TextField';

export type PhoneProps = FieldProps<string>;

/**
 * Renders the PhoneField component
 *
 * @beta
 */

const PhoneField = (props: PhoneProps): JSX.Element => {
  const withValidation = {
    ...props,
    validate: chainValidations(props, [required, isValidPhone]),
  };
  const [field, meta, helpers] = useField(
    withValidation as FieldHookConfig<string>
  );
  const id = props.id || props.name;
  const value = field.value;

  return (
    <TextField
      type="tel"
      id={id}
      {...props}
      onChange={field.onChange}
      value={value}
      required
      onBlur={() => helpers.setTouched(true)}
    />
  );
};

export default PhoneField;
