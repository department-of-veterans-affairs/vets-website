export function updateChildOfVeteran(formData) {
  const parsedFormData = JSON.parse(formData);
  const transformedValue = parsedFormData;
  if (parsedFormData?.veteransChildren?.length) {
    transformedValue.veteransChildren = parsedFormData.veteransChildren.map(
      child => {
        const childStatus = [];
        if (child?.livesWith === false) {
          childStatus.push('DOES_NOT_LIVE_WITH_SPOUSE');
        }
        return {
          ...child,
          childStatus,
        };
      },
    );
  }
  return JSON.stringify(transformedValue);
}
