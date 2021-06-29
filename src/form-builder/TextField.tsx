import React from 'react';
import { Field } from 'formik';
import { FormulateFieldProps } from './types';

const TextField = (props: FormulateFieldProps<string>): JSX.Element => {
  const id = props.id || props.name;
  return (
    <>
      <label htmlFor={id}>{props.label}</label>
      <Field type="text" id={id} {...props} />
    </>
  );
};

export default TextField;
