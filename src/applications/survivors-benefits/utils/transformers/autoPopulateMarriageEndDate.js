/**
 * Auto-populates the marriage end date field (4E) with the Veteran's date of death (1H)
 * when the user indicates they were married to the Veteran at the time of their death.
 *
 * This transformer ensures that:
 * - When marriedToVeteranAtTimeOfDeath is true
 * - AND veteranDateOfDeath exists
 * - THEN marriageToVeteranEndDate is automatically set to the veteranDateOfDeath value
 *
 * This satisfies the PDF form requirement where field 4E (Date marriage ended)
 * should match field 1H (Veteran Date of Death) when applicable.
 *
 * @param {string} formData - Stringified JSON form data
 * @returns {string} Stringified JSON with marriageToVeteranEndDate populated if conditions are met
 */
export function autoPopulateMarriageEndDate(formData) {
  const parsedFormData = JSON.parse(formData);

  // Check if user was married to veteran at time of death
  const wasMarriedAtDeath =
    parsedFormData?.marriedToVeteranAtTimeOfDeath === true;

  // Get the veteran's date of death from field 1H
  const veteranDateOfDeath = parsedFormData?.veteranDateOfDeath;

  // If married at time of death and veteran date of death exists,
  // set marriage end date (field 4E) to veteran's date of death
  if (wasMarriedAtDeath && veteranDateOfDeath) {
    return JSON.stringify({
      ...parsedFormData,
      marriageToVeteranEndDate: veteranDateOfDeath,
    });
  }

  return formData;
}
