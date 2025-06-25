/* eslint-disable no-console */
import commonFieldMapping from './commonFieldMapping';

/** @param {WebComponentFieldProps} props */
export default function VaTelephoneInputFieldMapping(props) {
  const { childrenProps } = props;
  const commonFieldProps = commonFieldMapping(props);
  return {
    ...commonFieldProps,
    contact: childrenProps?.formData?.contact || '',
    country: childrenProps?.formData?.countryCode || 'US',
    onVaContact: (event, value) => {
      const payload = value || event.detail || {};
      childrenProps.onChange({
        callingCode: parseInt(payload.callingCode, 10) || null,
        countryCode: payload.countryCode || null,
        contact: payload.contact,
        _isValid: payload.isValid,
        _error: payload.error,
        _touched: payload.touched,
        _required: commonFieldProps.required,
      });
    },
    // onBlur: () => childrenProps.onBlur(childrenProps.idSchema.$id),
  };
}
