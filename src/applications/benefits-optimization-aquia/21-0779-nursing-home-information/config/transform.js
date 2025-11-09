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
    admissionDate,
    medicaidFacility,
    medicaidApplication,
    medicaidStatus,
    medicaidStartDate,
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
          ssn: veteranIdentificationInfo?.veteranSsn,
          vaFileNumber: veteranIdentificationInfo?.veteranVaFileNumber,
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
        medicaidApplication:
          medicaidApplication?.hasAppliedForMedicaid === true,
        patientMedicaidCovered:
          medicaidStatus?.currentlyCoveredByMedicaid === true,
        medicaidStartDate: medicaidStartDate?.medicaidStartDate,
        monthlyCosts: monthlyCosts?.monthlyOutOfPocket,
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
