import { setData } from 'platform/forms-system/src/js/actions';

export const updateFacilityCodeInRedux = (dispatch, formData, index, value) => {
  if (index == null) {
    return;
  }

  const currentFormData = formData || {};
  const existingArray = currentFormData.additionalLocations || [];
  const normalizedValue = value === '' ? undefined : value;
  const existingValue =
    existingArray[index]?.facilityCode === undefined
      ? undefined
      : existingArray[index]?.facilityCode;

  if (existingValue === normalizedValue) {
    return;
  }

  if (!existingArray.length && normalizedValue === undefined) {
    return;
  }

  const updatedDetails = [...existingArray];
  const updatedItem = {
    ...(updatedDetails[index] || {}),
    facilityCode: normalizedValue,
  };
  updatedDetails[index] = updatedItem;

  dispatch(
    setData({
      ...currentFormData,
      additionalLocations: updatedDetails,
    }),
  );
};
