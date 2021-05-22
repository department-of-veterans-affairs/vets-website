import React from "react";
import { Field } from "formik";

// TODO: Abstract out all field props into a single interface
const StringField = (props: { name: string }) => (
  <Field type="string" {...props} />
);

export default StringField;
