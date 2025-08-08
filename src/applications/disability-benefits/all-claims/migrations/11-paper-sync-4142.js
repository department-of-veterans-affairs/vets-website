export default function paperSync4142(savedData) {
  // if flipper is enable for new 4142 and user has acknowledged the old 4142
  // then redirect to the 4142 choice page and show the alert that the new 4142 is available
  // and they must agree to the new 4142 terms before proceeding
  if (
    savedData.disability526Enable2024Form4142 &&
    savedData['view:patient_acknowledgement']['view:acknowledgement'] === true
  )
    return {
      ...savedData,
      showNew4142AuthorizationAlert: true,
      metadata: {
        ...savedData.metadata,
        returnUrl: '/supporting-evidence/private-medical-records',
      },
    };

  return savedData;
}
