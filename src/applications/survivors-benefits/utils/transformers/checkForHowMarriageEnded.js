export function checkForHowMarriageEnded(formData) {
  const parsedFormData = JSON.parse(formData);
  const transformedValue = parsedFormData;
  if (parsedFormData?.howMarriageEnded) {
    JSON.stringify(transformedValue);
  }
  if (parsedFormData?.marriedToVeteranAtTimeOfDeath) {
    transformedValue.howMarriageEnded = 'death';
  }
  return JSON.stringify(transformedValue);
}
