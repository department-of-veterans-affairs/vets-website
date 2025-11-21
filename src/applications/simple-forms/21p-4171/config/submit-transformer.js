/**
 * Transform form data for submission to the VA API
 * Form 21P-4171: Supporting Statement Regarding Marriage
 * @param {Object} formConfig - The form configuration
 * @param {Object} form - The form data from the Redux store
 * @returns {Object} Transformed data ready for API submission
 */
export default function submitTransformer(formConfig, form) {
  const { data } = form;

  // Transform the form data to match the API schema
  const transformedData = {
    // Veteran Information (Items 1-2)
    veteranFullName: data.veteranFullName || {},
    veteranSsn: data.veteranSsn || '',
    veteranVaFileNumber: data.veteranVaFileNumber || '',

    // Claimed Spouse Information (Item 3)
    spouse: {
      fullName: data.spouse?.fullName || data.spouseFullName || {},
      hadOtherMarriages: data.spouse?.hadOtherMarriages || false,
      otherMarriages: data.spouse?.otherMarriages || [],
    },

    // Witness Information (Item 4)
    witnessFullName: data.witnessFullName || {},
    witnessAddress: data.witnessAddress || {},
    witnessDaytimePhone: data.witnessDaytimePhone || '',
    witnessEveningPhone: data.witnessEveningPhone || '',

    // Relationship Information (Items 5-6)
    relationshipToVeteran: data.relationshipToVeteran || '',
    relationshipToSpouse: data.relationshipToSpouse || '',
    howLongKnownVeteran: data.howLongKnownVeteran || '',
    howLongKnownSpouse: data.howLongKnownSpouse || '',

    // Visitation Information (Items 7)
    visitFrequencyVeteran: data.visitFrequencyVeteran || '',
    visitOccasionsVeteran: data.visitOccasionsVeteran || '',
    visitFrequencySpouse: data.visitFrequencySpouse || '',
    visitOccasionsSpouse: data.visitOccasionsSpouse || '',

    // Marriage Knowledge (Items 8-10)
    generallyKnownAsMarried: data.generallyKnownAsMarried || false,
    everDenied: data.everDenied || false,
    witnessConsidersMarried: data.witnessConsidersMarried || false,
    reasonsForBelief: data.reasonsForBelief || '',

    // Names Used by Spouse (Item 11)
    usedFirstName: data.usedFirstName || '',
    usedLastName: data.usedLastName || '',

    // Marriage References (Item 12)
    heardReferToEachOther: data.heardReferToEachOther || false,
    referenceDate: data.referenceDate || '',
    referencePlace: data.referencePlace || '',

    // Living Arrangements (Items 13-14)
    living: {
      maintainedHome: data.living?.maintainedHome || false,
      periods: data['living.periods'] || data.living?.periods || [],
      continuous: data.living?.continuous || false,
      continuousExplanation: data.living?.continuousExplanation || '',
    },

    // Veteran Prior Marriages (Items 15)
    veteran: {
      hadOtherMarriages: data.veteran?.hadOtherMarriages || false,
      otherMarriages: data.veteran?.otherMarriages || [],
    },

    // Additional Information (Item 17)
    remarks: data.remarks || '',

    // Certification (Items 18-20)
    signatureDate: data.signatureDate || '',
    certificationStatement: data.certificationStatement || false,
    signatureByMark: data.signatureByMark || false,
  };

  return JSON.stringify({
    form21p4171: transformedData,
  });
}
