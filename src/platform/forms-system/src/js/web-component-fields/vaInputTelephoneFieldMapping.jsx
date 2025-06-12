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
      childrenProps.onChange({
        callingCode: parseInt(contact.callingCode, 10) || null,
        countryCode: contact.countryCode || '',
        contact: contact.contact || '',
        contactLength: contact.contactLength || null,
        isValid: !!contact.isValid || false,
        error: contact.error,
      });
    },
    onBlur: () => childrenProps.onBlur(childrenProps.idSchema.$id),
  };
}
