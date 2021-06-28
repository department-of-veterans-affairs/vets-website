import { FieldAttributes } from 'formik';

// The <T> is the value type of the field
export declare type FormulateFieldProps<T> = FieldAttributes<T> & {
  label: string;
};
