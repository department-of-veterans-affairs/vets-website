export function combineTreatmentFacility(formData) {
  const parsedFormData = JSON.parse(formData);
  const transformedValue = parsedFormData;
  if (parsedFormData?.treatments?.length) {
    transformedValue.treatments = parsedFormData.treatments.map(center => {
      if (parsedFormData.survivorsBenefitsForm2025VersionEnabled) {
        return {
          ...center,
          facility: center.vaMedicalCenterName,
          facilityLocation: `${center.city}, ${center.state}`,
          treatmentDates: {
            start: center.startDate,
            end: center.endDate,
          },
        };
      }
      return {
        ...center,
        facility: `${center.vaMedicalCenterName} - ${center.city}, ${
          center.state
        }`,
        treatmentDates: {
          start: center.startDate,
          end: center.endDate,
        },
      };
    });
  }
  return JSON.stringify(transformedValue);
}
