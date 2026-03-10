/* eslint-disable no-console */
import commonFieldMapping from './commonFieldMapping';

/** @param {WebComponentFieldProps} props */
export default function VaTelephoneInputFieldMapping(props, initialLoad) {
  const { childrenProps } = props;
  const commonFieldProps = commonFieldMapping(props);
  return {
    ...commonFieldProps,
    // only include contact prop on initial load to support prefill;
    // otherwise rely on va-telephone-input to keep track of contact internally and to transmit it to the forms-system via vaContact event
    // this avoids a race condition where forms-system can pass an out of date contact prop to va-telephone-input and suppress an error state within va-telephone-input
    // https://github.com/department-of-veterans-affairs/vets-design-system-documentation/issues/5335
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
