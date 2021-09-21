import React from 'react';
import { useField, FieldHookConfig } from 'formik';

import { FieldProps } from './types';
import { chainValidations, required } from '../utils/validation';
import { VaTextInput } from 'web-components/react-bindings';

const TextField = (props: FieldProps<string>): JSX.Element => {
  const withValidation = {
    ...props,
    validate: chainValidations(props, [required]),
  };
  const [field, meta] = useField(withValidation as FieldHookConfig<string>);
  const id = props.id || props.name;

  return (
    <VaTextInput
      id={id}
      label={props.label}
      required={!!props.required}
      {...field}
      onVaChange={field.onChange}
      error={(meta.touched && meta.error) || undefined}
    />
  );
};

export default TextField;
