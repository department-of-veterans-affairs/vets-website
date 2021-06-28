import React from 'react';
import { Field } from 'formik';
import { FormulateFieldProps } from './types';

const TextField = (props: FormulateFieldProps<string>): JSX.Element => (
  <>
    <label htmlFor={props.name}>{props.label}</label>
    <Field type="string" {...props} />
  </>
);

export default TextField;
