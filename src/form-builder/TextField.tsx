/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useRef, useEffect } from 'react';

// import { Field } from 'formik';
import { FieldProps } from './types';

// TODO: Type these event handler functions
type WrapperProps = FieldProps & {
  onChange?: (e: Event) => void;
  onBlur?: (e: Event) => void;
};

const Wrapper = ({ onChange, ...props }: WrapperProps) => {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    // TODO: Figure out how to actually import the type defintions for these web components
    // @ts-ignore
    ref.current.addEventListener('vaChange', onChange);
  }, [onChange]);

  // TODO: Figure out how to actually import the type definitions for these web components
  // @ts-ignore
  return <va-text-input ref={ref} {...props} />;
};

const TextField = (props: FieldProps): JSX.Element => {
  const id = props.id || props.name;
  return <Wrapper id={id} {...props} />;
};

export default TextField;
