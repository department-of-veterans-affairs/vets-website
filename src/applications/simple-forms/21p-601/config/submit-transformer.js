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
    const cleanPhone = phone.replace(/\D/g, '');
    return {
      areaCode: cleanPhone.substring(0, 3),
      prefix: cleanPhone.substring(3, 6),
      lineNumber: cleanPhone.substring(6, 10),
    };
  };

  // Helper function to split zip code
  const splitZipCode = zipCode => {
    if (!zipCode) return { first5: '', last4: '' };
    const cleanZip = zipCode.replace(/\D/g, '');
    return {
      first5: cleanZip.substring(0, 5),
      last4: cleanZip.substring(5, 9),
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

  // Helper function to format address
  const formatAddress = addressObj => {
    if (!addressObj) {
      return {
        street: '',
        street2: '',
        city: '',
        state: '',
        country: '',
        zipCode: { first5: '', last4: '' },
      };
    }
    return {
      street: addressObj.street || '',
      street2: addressObj.street2 || '',
      city: addressObj.city || '',
      state: addressObj.state || '',
      country: addressObj.country || '',
      zipCode: splitZipCode(addressObj.postalCode),
    };
  };

  // Get current date for signature (format as YYYY-MM-DD)
  const today = new Date();
  const todayFormatted = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const signatureDate = splitDate(todayFormatted);

  // Determine in reply refer to ID - prefer SSN, fallback to VA file number
  const inReplyReferTo = (() => {
    const veteranId = transformedData.veteranIdentification || {};
    if (veteranId.ssn) {
      return veteranId.ssn;
    }
    if (veteranId.vaFileNumber) {
      return veteranId.vaFileNumber;
    }
    return '';
  })();

  // Build result object following 21P-0537 pattern
  const result = {
    formNumber: formConfig.formId,
    // Section 1: Veteran Information (Questions 1-3)
    veteran: {
      fullName: formatName(transformedData.veteranFullName),
      ssn: splitSSN(transformedData.veteranIdentification?.ssn),
      vaFileNumber: transformedData.veteranIdentification?.vaFileNumber || '',
    },
    // Section 1: Beneficiary Information (Questions 4-5)
    beneficiary: {
      fullName: transformedData.beneficiaryIsVeteran
        ? formatName(transformedData.veteranFullName)
        : formatName(transformedData.beneficiaryFullName),
      dateOfDeath: splitDate(transformedData.beneficiaryDateOfDeath),
      isVeteran: transformedData.beneficiaryIsVeteran || false,
    },
    // Section 1: Claimant Information (Questions 6-12)
    claimant: {
      fullName: formatName(transformedData.claimantFullName),
      ssn: splitSSN(transformedData.claimantIdentification?.ssn),
      vaFileNumber: transformedData.claimantIdentification?.vaFileNumber || '',
      dateOfBirth: splitDate(transformedData.claimantDateOfBirth),
      relationshipToDeceased: transformedData.relationshipToDeceased || '',
      address: formatAddress(transformedData.claimantAddress),
      phone: splitPhone(transformedData.claimantPhone),
      email: transformedData.claimantEmail || '',
      signature: transformedData.signature || '',
      signatureDate,
    },
    // In reply refer to - used by backend to identify the claim
    inReplyReferTo,
    // Section 2: Surviving Relatives (Questions 13-14)
    survivingRelatives: {
      hasSpouse: transformedData.hasSpouse || false,
      hasChildren: transformedData.hasChildren || false,
      hasParents: transformedData.hasParents || false,
      hasNone: transformedData.hasNone || false,
      wantsToWaiveSubstitution:
        transformedData.wantsToWaiveSubstitution || false,
      relatives: (transformedData.survivingRelatives || []).map(relative => ({
        fullName: formatName(relative.fullName),
        relationship: relative.relationship || '',
        dateOfBirth: splitDate(relative.dateOfBirth),
        address: {
          street: relative.address?.street || '',
          street2: relative.address?.street2 || '',
          city: relative.address?.city || '',
          state: relative.address?.state || '',
          country: relative.address?.country || '',
          zipCode: splitZipCode(relative.address?.postalCode),
        },
      })),
    },
    // Section 3: Expenses (Questions 15-18)
    // Note: MVP only supports PAID expenses (no unpaid creditors/witness signatures)
    expenses: {
      lastIllnessExpenses: (transformedData.lastIllnessExpenses || []).map(
        expense => ({
          creditorName: expense.creditorName || '',
          expenseType: expense.expenseType || '',
          amount: expense.amount || '',
          isPaid: expense.isPaid || false,
          paidBy: expense.paidBy || '',
        }),
      ),
      reimbursementAmount: transformedData.reimbursementAmount || '',
      reimbursementSource: transformedData.reimbursementSource || '',
      // Question 18: Other debts owed by the deceased
      otherDebts: (transformedData.otherDebts || []).map(debt => ({
        nature: debt.nature || '',
        amount: debt.amount || '',
      })),
    },
    // Section 6: Remarks (Question 26)
    remarks: transformedData.remarks || '',
  };

  // Note: The following sections are NOT included in MVP:
  // - Question 19: Estate administration (requires document upload - disqualifying)
  // - Section 4 (Questions 20-22): Unpaid creditor waivers (requires witness signatures)
  // - Questions 24-25: Witness signatures (not supported in MVP)

  return JSON.stringify(result);
}

export default transformForSubmit;
