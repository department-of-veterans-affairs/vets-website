import set from 'platform/utilities/data/set';

export default [
  // 0 -> 1, convert phone number from standard to international format
  ({ formData, metadata }) => {
    let newData = formData;

    if (typeof newData?.veteranPhoneNumber === 'string') {
      const value = {
        callingCode: '',
        countryCode: '',
        contact: newData.veteranPhoneNumber,
      };
      newData = set('veteranPhoneNumber', value, newData);
    }

    return { formData: newData, metadata };
  },
];
