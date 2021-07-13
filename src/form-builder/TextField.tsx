/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useRef, useEffect } from 'react';
import { useField } from 'formik';

// import { Field } from 'formik';
import { FieldProps } from './types';

const Wrapper = (props: FieldProps<string>) => {
  const [field, meta] = useField(props);

  // TODO: Use the web component type
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    // TODO: Figure out how to actually import the type defintions for these web components
    // @ts-ignore
    ref.current.addEventListener('vaChange', field.onChange);
  }, [field.onChange]);
  useEffect(() => {
    // TODO: Figure out how to actually import the type defintions for these web components
    // @ts-ignore
    ref.current.addEventListener('vaBlur', field.onBlur);
  }, [field.onBlur]);

  // TODO: Figure out how to actually import the type definitions for these web components
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
  return <Wrapper id={id} {...props} />;
};

export default TextField;
