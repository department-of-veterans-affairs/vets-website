/**
 * @param {obj} prescription - The prescription object containing pharmacy phone details.
 * @returns {string|null} The pharmacy phone number if available, otherwise null.
 */

export const pharmacyPhoneNumber = prescription => {
  if (!prescription) {
    return null;
  }
  if (prescription.cmopDivisionPhone) {
    return prescription.cmopDivisionPhone;
  }
  if (prescription.dialCmopDivisionPhone) {
    return prescription.dialCmopDivisionPhone;
  }

  if (prescription.rxRfRecords && prescription.rxRfRecords.length > 0) {
    const cmopDivisionPhone = prescription.rxRfRecords.find(item => {
      if (item.cmopDivisionPhone) return item.cmopDivisionPhone;
      return null;
    })?.cmopDivisionPhone;
    if (cmopDivisionPhone) return cmopDivisionPhone;

    const dialCmopDivisionPhone = prescription.rxRfRecords.find(item => {
      if (item.dialCmopDivisionPhone) return item.dialCmopDivisionPhone;
      return null;
    })?.dialCmopDivisionPhone;
    if (dialCmopDivisionPhone) return dialCmopDivisionPhone;
  }
  return null;
};
