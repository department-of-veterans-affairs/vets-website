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
    signature,
  } = form?.data;

  const { nursingHomeName, nursingHomeAddress } = nursingHomeDetails || {};
  const nursingOfficialName = `${nursingOfficialInformation?.fullName?.first?.trim() ||
    ''} ${nursingOfficialInformation?.fullName?.last?.trim() || ''}`.trim();

  // Convert country code from 3-letter to 2-letter format
  const getCountryCode = country => {
    if (!country) return undefined;
    // Common conversions
    const countryMap = {
      USA: 'US',
      CAN: 'CA',
      MEX: 'MX',
      GBR: 'GB',
    };
    return countryMap[country] || country.slice(0, 2).toUpperCase();
  };

  // Claimant info - when veteran is the patient, use veteran's info
  const claimantIsVeteran = claimantQuestion?.patientType === 'veteran';
  const claimantInformation = claimantIsVeteran
    ? {
        fullName: veteranPersonalInfo?.fullName,
        dateOfBirth: veteranPersonalInfo?.dateOfBirth,
        veteranId: {
          ssn: veteranIdentificationInfo?.veteranSsn,
          vaFileNumber: veteranIdentificationInfo?.veteranVaFileNumber,
        },
      }
    : {
        fullName: claimantPersonalInfo?.claimantFullName,
        dateOfBirth: claimantPersonalInfo?.claimantDateOfBirth,
        veteranId: {
          ssn: claimantIdentificationInfo?.claimantSsn,
          vaFileNumber: claimantIdentificationInfo?.claimantVaFileNumber,
        },
      };

  try {
    const submissionData = {
      veteranInformation: {
        fullName: veteranPersonalInfo?.fullName,
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
          country: getCountryCode(nursingHomeAddress?.country),
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

    const payload = { form: submissionData };
    // eslint-disable-next-line no-console
    console.log('Transform submissionData:', submissionData);
    // eslint-disable-next-line no-console
    console.log('Transform payload:', payload);
    // eslint-disable-next-line no-console
    console.log('Transform JSON:', JSON.stringify(payload, null, 2));
    return JSON.stringify(payload);
  } catch (error) {
    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      Sentry.captureMessage(`Transform Failed: ${error}`);
    });
    return 'Transform failed, see sentry for details';
  }
};
