/* eslint-disable no-console */
import commonFieldMapping from './commonFieldMapping';

/** @param {WebComponentFieldProps} props */
export default function VaTelephoneInputFieldMapping(props, initialLoad) {
  const { childrenProps } = props;
  const commonFieldProps = commonFieldMapping(props);
  return {
    ...commonFieldProps,
    // only include contact on initial load for prefill;
    // otherwise an internal bad contact may be overwritten
    // by an immediately previous valid contact and an error will be suppressed
    ...(initialLoad
      ? {
          contact: childrenProps?.formData?.contact || '',
        }
      : {}),
    country: childrenProps?.formData?.countryCode || 'US',
    onVaContact: (event, value) => {
      const payload = value || event.detail || {};
      childrenProps.onChange({
        callingCode: parseInt(payload.callingCode, 10) || null,
        countryCode: payload.countryCode || null,
        contact: payload.contact,
        isValid: payload.isValid,
        error: payload.error,
        touched: payload.touched,
        required: commonFieldProps.required,
      });
    },
    // onBlur: () => childrenProps.onBlur(childrenProps.idSchema.$id),
  };
}
