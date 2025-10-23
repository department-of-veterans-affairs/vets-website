import * as Sentry from '@sentry/browser';

export const transform = (formConfig, form) => {
  const {
    veteranPersonalInfo,
    veteranIdentificationInfo,
    claimantQuestion,
    claimantPersonalInfo,
    claimantIdentificationInfo,
    nursingHomeDetails,
    certificationLevelOfCare,
    admissionDateInfo,
    medicaidFacility,
    medicaidApplication,
    medicaidStatus,
    medicaidStartDateInfo,
    monthlyCosts,
    nursingOfficialInformation,
  } = form?.data;

  const { nursingHomeName, nursingHomeAddress } = nursingHomeDetails || {};
  const nursingOfficialName = `${nursingOfficialInformation?.firstName?.trim() ||
    ''} ${nursingOfficialInformation?.lastName?.trim() || ''}`.trim();

  // No claimant info if veteran is the patient
  const claimantIsVeteran = claimantQuestion?.patientType === 'veteran';
  const claimantInformation = claimantIsVeteran
    ? null
    : {
        ...claimantPersonalInfo?.claimantFullName,
        dateOfBirth: claimantPersonalInfo?.claimantDateOfBirth,
        veteranId: {
          ssn: claimantIdentificationInfo?.claimantSsn,
          vaFileNumber: claimantIdentificationInfo?.claimantVaFileNumber,
        },
      };

  try {
    const submissionObj = {
      veteranInformation: {
        ...veteranPersonalInfo?.fullName,
        dateOfBirth: veteranPersonalInfo?.dateOfBirth,
        veteranId: {
          ...veteranIdentificationInfo,
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
        admissionDate: admissionDateInfo?.admissionDate,
        medicaidFacility: medicaidFacility?.isMedicaidApproved === 'yes',
        medicaidApplication:
          medicaidApplication?.hasAppliedForMedicaid === 'yes',
        patientMedicaidCovered:
          medicaidStatus?.currentlyCoveredByMedicaid === 'yes',
        medicaidStartDate: medicaidStartDateInfo?.medicaidStartDate,
        monthlyCosts: monthlyCosts?.monthlyOutOfPocket,
        // TODO sort out level of care enum/boolean
        certificationLevelOfCare:
          certificationLevelOfCare?.levelOfCare === 'skilled',
        nursingOfficialName,
        nursingOfficialTitle: nursingOfficialInformation?.jobTitle,
        nursingOfficialPhoneNumber: nursingOfficialInformation?.phoneNumber,
      },
    };

    return JSON.stringify(submissionObj);
  } catch (error) {
    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      Sentry.captureMessage(`Transform Failed: ${error}`);
    });
    return 'Transform failed, see sentry for details';
  }
};
