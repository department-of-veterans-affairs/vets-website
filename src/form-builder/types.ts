import { FieldHookConfig } from 'formik';

// The <T> is the value type of the field.
//
// This probably should intersect with FieldAttributes, but that one intersects
// with T which gives me an error.
export type FormulateFieldProps<T> = FieldHookConfig<T> & {
  label: string;
};
