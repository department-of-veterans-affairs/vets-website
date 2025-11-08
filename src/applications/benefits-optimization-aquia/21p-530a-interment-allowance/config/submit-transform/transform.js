import * as Sentry from '@sentry/browser';

/**
 * Ensures dates are in YYYY-MM-DD format with zero-padded day and month
 * @param {string} date - Date string in YYYY-MM-DD format (may have single-digit day/month)
 * @returns {string} Date string with zero-padded day and month
 */
const padDate = date => {
  if (!date || typeof date !== 'string') return date;

  const parts = date.split('-');
  if (parts.length !== 3) return date;

  const [year, month, day] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

export const transform = (formConfig, form) => {
  const {
    // relationshipToVeteran,
    organizationInformation,
    burialBenefitsRecipient,
    mailingAddress,
    veteranIdentification,
    veteranBurialInformation,
    servicePeriods,
    // servicePeriodsData,
    // veteranServedUnderDifferentName,
    previousNames,
    additionalRemarks,
    certification,
  } = form?.data;

  // destructure & setup
  const periods = servicePeriods.map(period => {
    if (!period) return null;
    const {
      placeOfEntry = '',
      placeOfSeparation = '',
      rank = '',
      dateFrom = '',
      dateTo = '',
      branchOfService = '',
    } = period;
    return {
      serviceBranch: branchOfService,
      dateEnteredService: padDate(dateFrom),
      placeEnteredService: placeOfEntry,
      rankAtSeparation: rank,
      dateLeftService: padDate(dateTo),
      placeLeftService: placeOfSeparation,
    };
  });

  const servedUnderDifferentName = previousNames
    .map(prevName => {
      // Format the name for display
      const parts = [
        prevName.first,
        prevName.middle,
        prevName.last,
        prevName.suffix,
      ].filter(Boolean);
      return parts.join(' ');
    })
    .join(', ');

  const {
    cemeteryLocation,
    dateOfBurial,
    dateOfDeath,
  } = veteranBurialInformation;
  const stateCemeteryOrTribalCemeteryLocation = `${cemeteryLocation?.city ||
    ''}, ${cemeteryLocation?.state || ''}`;

  const { recipientAddress } = mailingAddress;
  const { first, middle, last } = veteranIdentification?.fullName;

  // fit into submission obj shape
  try {
    const submissionObj = {
      veteranInformation: {
        fullName: {
          first,
          middle: middle?.charAt(0),
          last,
        },
        ssn: veteranIdentification?.ssn?.replace(/-/g, ''),
        vaServiceNumber: veteranIdentification?.serviceNumber,
        vaFileNumber: veteranIdentification?.vaFileNumber,
        dateOfBirth: padDate(veteranIdentification?.dateOfBirth),
        dateOfDeath: padDate(dateOfDeath),
        placeOfBirth: veteranIdentification?.placeOfBirth,
      },
      veteranServicePeriods: {
        periods,
        servedUnderDifferentName,
      },
      burialInformation: {
        nameOfStateCemeteryOrTribalOrganization:
          organizationInformation?.organizationName,
        placeOfBurial: {
          stateCemeteryOrTribalCemeteryName:
            veteranBurialInformation?.cemeteryName,
          stateCemeteryOrTribalCemeteryLocation,
        },
        dateOfBurial: padDate(dateOfBurial),
        recipientOrganization: {
          name: burialBenefitsRecipient?.recipientOrganizationName,
          phoneNumber: burialBenefitsRecipient?.recipientPhone,
          address: {
            streetAndNumber: recipientAddress?.street,
            aptOrUnitNumber: recipientAddress?.street2,
            city: recipientAddress?.city,
            state: recipientAddress?.state,
            country:
              recipientAddress?.state?.length > 2
                ? 'US'
                : recipientAddress?.state,
            postalCode: recipientAddress?.postalCode,
            postalCodeExtension: recipientAddress?.postalCodeExtension,
          },
        },
      },
      certification,
      remarks: additionalRemarks?.additionalRemarks,
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
