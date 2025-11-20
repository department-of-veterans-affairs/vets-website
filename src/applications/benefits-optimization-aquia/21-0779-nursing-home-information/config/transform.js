export const transform = (formConfig, form) => {
  const {
    veteranPersonalInfo,
    veteranIdentificationInfo,
    claimantQuestion,
    claimantPersonalInfo,
    claimantIdentificationInfo,
    nursingHomeDetails,
    certificationLevelOfCare,
    admissionDate,
    medicaidFacility,
    medicaidApplication,
    medicaidStatus,
    medicaidStartDate,
    monthlyCosts,
    nursingOfficialInformation,
    signature,
  } = form?.data;

  const { nursingHomeName, nursingHomeAddress } = nursingHomeDetails || {};
  const nursingOfficialName = `${nursingOfficialInformation?.fullName?.first?.trim() ||
    ''} ${nursingOfficialInformation?.fullName?.last?.trim() || ''}`.trim();

  // Claimant info - when veteran is the patient, use veteran's info
  const claimantIsVeteran = claimantQuestion?.patientType === 'veteran';
  const claimantInformation = claimantIsVeteran
    ? {
        fullName: veteranPersonalInfo?.fullName,
        dateOfBirth: veteranPersonalInfo?.dateOfBirth,
        veteranId: {
          ssn: veteranIdentificationInfo?.ssn,
          vaFileNumber: veteranIdentificationInfo?.vaFileNumber,
        },
      }
    : {
        fullName: claimantPersonalInfo?.claimantFullName,
        dateOfBirth: claimantPersonalInfo?.claimantDateOfBirth,
        veteranId: {
          ssn: claimantIdentificationInfo?.ssn,
          vaFileNumber: claimantIdentificationInfo?.vaFileNumber,
        },
      };

  const submissionData = {
    veteranInformation: {
      fullName: veteranPersonalInfo?.fullName,
      dateOfBirth: veteranPersonalInfo?.dateOfBirth,
      veteranId: {
        ssn: veteranIdentificationInfo?.ssn,
        vaFileNumber: veteranIdentificationInfo?.vaFileNumber,
      },
    },
    claimantInformation,
    nursingHomeInformation: {
      nursingHomeName,
      nursingHomeAddress: {
        street: nursingHomeAddress?.street,
        street2: nursingHomeAddress?.street2,
        city: nursingHomeAddress?.city,
        state: nursingHomeAddress?.state,
        country: nursingHomeAddress?.country,
        postalCode: nursingHomeAddress?.postalCode,
      },
    },
    generalInformation: {
      admissionDate: admissionDate?.admissionDate,
      medicaidFacility: medicaidFacility?.isMedicaidApprovedFacility === true,
      medicaidApplication: medicaidApplication?.hasAppliedForMedicaid === true,
      patientMedicaidCovered:
        medicaidStatus?.currentlyCoveredByMedicaid === true,
      medicaidStartDate: medicaidStartDate?.medicaidStartDate,
      monthlyCosts: monthlyCosts?.monthlyOutOfPocket
        ? String(monthlyCosts.monthlyOutOfPocket)
        : undefined,
      certificationLevelOfCare: certificationLevelOfCare?.levelOfCare,
      nursingOfficialName,
      nursingOfficialTitle: nursingOfficialInformation?.jobTitle,
      nursingOfficialPhoneNumber: nursingOfficialInformation?.phoneNumber,
      signature,
      signatureDate: new Date().toISOString().split('T')[0],
    },
  };

  return JSON.stringify(submissionData);
};
