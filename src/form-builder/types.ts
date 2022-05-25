import { FieldHookConfig } from 'formik';

export type FieldProps<V> = Omit<FieldHookConfig<V>, 'required'> & {
  label: string;
  id?: string;
  /**
   * If `required` is true, the default message will be used. If `required` is a
   * string, it will be used as the error message.
   */
  required?: boolean | string;
};

export type CheckboxProps = FieldProps<string> & {
  checked?: boolean;
  content?: string;
  onValueChange?: (e: Event) => void;
  value?: boolean;
};

export type RadioGroupProps = FieldProps<string> & {
  name: string;
  options: React.ReactElement<RadioItemProps>[];
  onChange: (v: string) => void;
};

export type RadioItemProps = {
  'aria-describedby': string;
  label: string;
  name: string;
  value: string;
  onRadioOptionSelected: () => void;
};

export type CheckboxGroupProps = FieldProps<string> & {
  options: CheckboxProps[];
};

/**
 * OMBInfo properties
 *
 * @example
 * ```
 * {
 *    expDate: 'My Example Title' required
 *    resBurden: 1
 *    ombNumber: '123-ABC'
 * }
 * ```
 */
export interface OMBInfoProps {
  resBurden?: number;
  ombNumber?: string;
  expDate: string;
}

/**
 *
 * @remarks
 * The `name` prop must be passed in FullNameField component as it is used as object name.
 * @example
 * Here's a simple example:
 * ```
 * // <FullNameField name="fullName">
 * {
 *    fullName: {
 *      // fields
 *    }
 * }
 * ```
 *
 */
export type FullNameProps = FieldProps<string>;

export type AddressProps = FieldProps<string>;

export interface Address {
  isMilitaryBaseOutside?: boolean;
  country: string;
  streetAddress: string;
  streetAddressLine2?: string;
  streetAddressLine3?: string;
  city: string;
  state: string;
  postalCode: string;
}

export type DateProps = FieldProps<string>;
