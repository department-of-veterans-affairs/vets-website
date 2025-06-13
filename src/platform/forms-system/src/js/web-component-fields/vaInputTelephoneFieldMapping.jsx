/* eslint-disable no-console */
import commonFieldMapping from './commonFieldMapping';

/** @param {WebComponentFieldProps} props */
export default function VaInputTelephoneFieldMapping(props) {
  const { childrenProps } = props;
  const commonFieldProps = commonFieldMapping(props);

  // remove the error prop if it's falsy so that it doesn't
  // interfer with syncing of the error messages passed to
  // the sub-components
  if (!commonFieldProps.error) {
    delete commonFieldProps.error;
  }

  return {
    ...commonFieldProps,
    contact: childrenProps?.formData?.contact || '',
    country: childrenProps?.formData?.countryCode || '',
    onVaContact: (event, value) => {
      const contact = value || event.detail || {};
      // untouched component that is not required should pass validation
      const isValid =
        !childrenProps.required && !contact.contact ? true : contact.isValid;
      const _error = !isValid ? contact.error : '';
      childrenProps.onChange({
        callingCode: parseInt(contact.callingCode, 10) || null,
        countryCode: contact.countryCode || '',
        contact: contact.contact || '',
        _error,
      });
    },
    onBlur: () => childrenProps.onBlur(childrenProps.idSchema.$id),
  };
}
