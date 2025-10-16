import { transformForSubmit as defaultTransformForSubmit } from 'platform/forms-system/src/js/helpers';

function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    defaultTransformForSubmit(formConfig, form),
  );

  // Helper function to split date into components
  const splitDate = dateString => {
    if (!dateString) return { month: '', day: '', year: '' };

    // Handle ISO date format (YYYY-MM-DD) directly without timezone conversion
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split('-');
      return {
        month,
        day,
        year,
      };
    }

    // For other date formats or Date objects, parse in local time
    const date = new Date(`${dateString}T12:00:00`);
    return {
      month: String(date.getMonth() + 1).padStart(2, '0'),
      day: String(date.getDate()).padStart(2, '0'),
      year: String(date.getFullYear()),
    };
  };

  // Helper function to split SSN into parts (9 digits total)
  const splitSSN = ssn => {
    if (!ssn) return { first3: '', middle2: '', last4: '' };
    const cleanSSN = ssn.replace(/\D/g, '');
    return {
      first3: cleanSSN.substring(0, 3),
      middle2: cleanSSN.substring(3, 5),
      last4: cleanSSN.substring(5, 9),
    };
  };

  // Helper function to split phone number
  const splitPhone = phone => {
    if (!phone) return { areaCode: '', prefix: '', lineNumber: '' };
    // Remove all non-digits
    const cleanPhone = phone.replace(/\D/g, '');
    return {
      areaCode: cleanPhone.substring(0, 3),
      prefix: cleanPhone.substring(3, 6),
      lineNumber: cleanPhone.substring(6, 10),
    };
  };

  // Helper function to format name components
  const formatName = nameObj => {
    if (!nameObj) return { first: '', middle: '', last: '' };
    return {
      first: nameObj.first || '',
      middle: nameObj.middle || '',
      last: nameObj.last || '',
    };
  };

  const recipientFullName = sotSig => {
    // Default to empty name object
    const nameObj = formatName();
    nameObj.first = 'User'; // Minimum required for backend to send confirmation email

    if (!sotSig || typeof sotSig !== 'string') return nameObj;

    // Clean up signature by removing extra spaces and trimming
    const cleanSig = sotSig.trim().replace(/\s+/g, ' ');
    if (!cleanSig) return nameObj;

    const parts = cleanSig.split(' ');

    switch (parts.length) {
      case 1:
        // Just a first name
        [nameObj.first] = parts;
        break;
      case 2:
        // First and last name
        [nameObj.first, nameObj.last] = parts;
        break;
      case 3:
        // First, middle, and last name
        [nameObj.first, nameObj.middle, nameObj.last] = parts;
        break;
      default:
        // More than 3 parts
        [nameObj.first] = parts;
        // Take the last part as the last name
        nameObj.last = parts[parts.length - 1];
        // Everything in between is the middle name(s)
        nameObj.middle = parts.slice(1, parts.length - 1).join(' ');
    }

    return nameObj;
  };

  // Split veteran SSN
  const veteranSSN = splitSSN(
    transformedData.veteranIdentification?.ssn ||
      transformedData.veteranSocialSecurityNumber,
  );

  // Split phone numbers
  const daytimePhone = splitPhone(transformedData.primaryPhone);
  const eveningPhone = splitPhone(transformedData.secondaryPhone);

  // Get current date for signature (format as YYYY-MM-DD)
  const today = new Date();
  const todayFormatted = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const signatureDate = splitDate(todayFormatted);
  const signature =
    transformedData.signature ||
    transformedData.statementOfTruthSignature ||
    '';

  const result = {
    formNumber: formConfig.formId,
    veteran: {
      fullName: formatName(transformedData.veteranFullName),
      ssn: veteranSSN,
      vaFileNumber:
        transformedData.veteranIdentification?.vaFileNumber ||
        transformedData.vaFileNumber ||
        '',
    },
    recipient: {
      phone: {
        daytime: daytimePhone,
        evening: eveningPhone,
      },
      email: transformedData.emailAddress || '',
      signature,
      signatureDate,
      fullName: recipientFullName(signature),
    },
    inReplyReferTo: (() => {
      // Follow the same logic as the form validation - prefer SSN if provided, otherwise VA file number
      const veteranId = transformedData.veteranIdentification || {};
      if (veteranId.ssn) {
        return veteranId.ssn;
      }
      if (veteranId.vaFileNumber) {
        return veteranId.vaFileNumber;
      }
      // Fallback for legacy data structure
      return (
        transformedData.veteranSocialSecurityNumber ||
        transformedData.vaFileNumber ||
        ''
      );
    })(),
    hasRemarried: transformedData.hasRemarried || false,
    remarriage: {
      dateOfMarriage: splitDate(transformedData.remarriage?.dateOfMarriage),
      spouseName: formatName(transformedData.remarriage?.spouseName),
      spouseDateOfBirth: splitDate(
        transformedData.remarriage?.spouseDateOfBirth,
      ),
      spouseIsVeteran: transformedData.remarriage?.spouseIsVeteran || false,
      ageAtMarriage: transformedData.remarriage?.ageAtMarriage || '',
      spouseSSN: { first3: '', middle2: '', last4: '' },
      spouseVAFileNumber: '',
      hasTerminated: transformedData.remarriage?.hasTerminated || false,
      terminationDate: splitDate(transformedData.remarriage?.terminationDate),
      terminationReason: transformedData.remarriage?.terminationReason || '',
    },
  };

  // Handle spouse veteran ID - could be SSN or VA File Number
  if (
    transformedData.remarriage?.spouseIsVeteran &&
    transformedData.remarriage?.spouseVeteranId
  ) {
    if (transformedData.remarriage.spouseVeteranId.ssn) {
      result.remarriage.spouseSSN = splitSSN(
        transformedData.remarriage.spouseVeteranId.ssn,
      );
    }
    if (transformedData.remarriage.spouseVeteranId.vaFileNumber) {
      result.remarriage.spouseVAFileNumber =
        transformedData.remarriage.spouseVeteranId.vaFileNumber;
    }
  }

  // If not remarried, still include empty remarriage structure
  if (!transformedData.hasRemarried) {
    result.remarriage = {
      dateOfMarriage: { month: '', day: '', year: '' },
      spouseName: { first: '', middle: '', last: '' },
      spouseDateOfBirth: { month: '', day: '', year: '' },
      spouseIsVeteran: false,
      ageAtMarriage: '',
      spouseSSN: { first3: '', middle2: '', last4: '' },
      spouseVAFileNumber: '',
      hasTerminated: false,
      terminationDate: { month: '', day: '', year: '' },
      terminationReason: '',
    };
  }

  return JSON.stringify(result);
}

export default transformForSubmit;
