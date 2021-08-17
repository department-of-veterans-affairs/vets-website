import { FieldProps } from '../form-builder/types';
import { getMessage } from './i18n';

export const validator = (
  props: FieldProps<string>
): ((value: string) => void | undefined | string | Promise<any>) => {
  return (value: string) => {
    if (props.required && !value) {
      const errorMessage =
        typeof props.required === 'string'
          ? props.required
          : getMessage('required.default');
      return errorMessage;
    }

    return props.validate ? props.validate(value) : undefined;
  };
};
