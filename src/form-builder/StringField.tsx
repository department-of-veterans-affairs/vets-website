import React from 'react';
// import { Field } from 'formik';

// TODO: Abstract out all field props into a single interface
const StringField = (props: { name: string; label: string }) => (
  // <Field type="string" {...props} />
  <>
    <label htmlFor={props.name}>{props.label}</label>
    <input type="text" name={props.name} id={props.name} />
  </>
);

export default StringField;
