/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useRef, useEffect } from 'react';
import { useField, FieldHookConfig } from 'formik';

import { FieldProps } from './types';
import { getMessage } from '../utils/i18n';

// TODO: Figure out how to actually import the type defintions for these web components
// The @ts-ignore comments are because the web component types aren't available.
const Wrapper = (props: FieldProps<string>) => {
  const [field, meta] = useField(props as FieldHookConfig<string>);

  // TODO: Use the web component type
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    // @ts-ignore
    ref.current.addEventListener('vaChange', field.onChange);
  }, [field.onChange]);
  useEffect(() => {
    // @ts-ignore
    ref.current.addEventListener('vaBlur', field.onBlur);
  }, [field.onBlur]);

  // TODO: Try using the <ErrorMessage> component
  return (
    // @ts-ignore
    <va-text-input
      ref={ref}
      {...props}
      {...field}
      error={(meta.touched && meta.error) || undefined}
    />
  );
};

const TextField = (props: FieldProps<string>): JSX.Element => {
  const id = props.id || props.name;
  const validate = (value: string) => {
    if (props.required && !value) {
      const errorMessage =
        typeof props.required === 'string'
          ? props.required
          : getMessage('required.default');
      return errorMessage;
    }

    return props.validate ? props.validate(value) : undefined;
  };
  return <Wrapper id={id} {...props} validate={validate} />;
};

export default TextField;
