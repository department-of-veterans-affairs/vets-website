import { transformForSubmit as defaultTransformForSubmit } from 'platform/forms-system/src/js/helpers';

function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    defaultTransformForSubmit(formConfig, form),
  );

  // Helper function to format full name as string
  const formatFullName = nameObj => {
    if (!nameObj) return '';
    const { first = '', middle = '', last = '' } = nameObj;
    return [first, middle, last].filter(Boolean).join(' ');
  };

  // Helper function to split SSN into parts
  const splitSSN = ssn => {
    if (!ssn) return { first3: '', middle2: '', last4: '' };
    const cleanSSN = ssn.replace(/\D/g, '');
    return {
      first3: cleanSSN.slice(0, 3),
      middle2: cleanSSN.slice(3, 5),
      last4: cleanSSN.slice(5, 9),
    };
  };

  // Helper function to split phone number
  const splitPhone = phone => {
    if (!phone) return { areaCode: '', first3: '', last4: '' };
    const cleanPhone = phone.replace(/\D/g, '');
    return {
      areaCode: cleanPhone.slice(0, 3),
      first3: cleanPhone.slice(3, 6),
      last4: cleanPhone.slice(6, 10),
    };
  };

  // Helper function to format date parts
  const formatDateParts = dateStr => {
    if (!dateStr) return { month: '', day: '', year: '' };
    const date = new Date(dateStr);
    return {
      month: String(date.getMonth() + 1).padStart(2, '0'),
      day: String(date.getDate()).padStart(2, '0'),
      year: String(date.getFullYear()),
    };
  };

  const veteranSSN = splitSSN(transformedData.veteranSocialSecurityNumber);
  const marriageDate = formatDateParts(
    transformedData.remarriage?.dateOfMarriage,
  );
  const spouseDOB = formatDateParts(
    transformedData.remarriage?.spouseDateOfBirth,
  );
  const terminationDate = formatDateParts(
    transformedData.remarriage?.terminationDate,
  );
  const signatureDate = formatDateParts(new Date().toISOString());
  const daytimePhone = splitPhone(transformedData.recipient?.phone?.daytime);
  const eveningPhone = splitPhone(transformedData.recipient?.phone?.evening);

  return JSON.stringify({
    formNumber: formConfig.formId,
    'form1[0].Page2[0].VeteransSocialSecurityNumber_FirstThreeNumbers[0]':
      veteranSSN.first3,
    'form1[0].Page2[0].VeteransSocialSecurityNumber_SecondTwoNumbers[0]':
      veteranSSN.middle2,
    'form1[0].Page2[0].VeteransSocialSecurityNumber_LastFourNumbers[0]':
      veteranSSN.last4,
    'form1[0].Page2[0].DOBmonth[0]': marriageDate.month,
    'form1[0].Page2[0].DOBday[0]': marriageDate.day,
    'form1[0].Page2[0].DOByear[0]': marriageDate.year,
    'form1[0].Page2[0].VeteransFirstName[0]':
      transformedData.remarriage?.spouseName?.first?.slice(0, 12) || '',
    'form1[0].Page2[0].VeteransMiddleInitial1[0]':
      transformedData.remarriage?.spouseName?.middle?.charAt(0) || '',
    'form1[0].Page2[0].VeteransLastName[0]':
      transformedData.remarriage?.spouseName?.last?.slice(0, 18) || '',
    'form1[0].Page2[0].DOBmonth[3]': spouseDOB.month,
    'form1[0].Page2[0].DOBday[2]': spouseDOB.day,
    'form1[0].Page2[0].DOByear[2]': spouseDOB.year,
    'form1[0].Page2[0].VAFileNumber[0]': (
      transformedData.remarriage?.spouseVeteranId?.vaFileNumber ||
      transformedData.remarriage?.spouseVeteranId?.ssn ||
      ''
    ).slice(0, 9),
    'form1[0].Page2[0].DOBmonth[1]': String(
      transformedData.remarriage?.ageAtMarriage || '',
    ).slice(0, 2),
    'form1[0].Page2[0].DOBmonth[2]': terminationDate.month,
    'form1[0].Page2[0].DOBday[1]': terminationDate.day,
    'form1[0].Page2[0].DOByear[1]': terminationDate.year,
    'form1[0].Page2[0].TERMINATION_REASON[0]':
      transformedData.remarriage?.terminationReason || '',
    'form1[0].Page2[0].Daytime1[0]': daytimePhone.areaCode,
    'form1[0].Page2[0].Daytime2[0]': daytimePhone.first3,
    'form1[0].Page2[0].Daytime3[0]': daytimePhone.last4,
    'form1[0].Page2[0].Daytime1[1]': eveningPhone.areaCode,
    'form1[0].Page2[0].Daytime2[1]': eveningPhone.first3,
    'form1[0].Page2[0].Daytime3[1]': eveningPhone.last4,
    'form1[0].Page2[0].VeteransLastName[1]': (
      transformedData.recipient?.email || ''
    ).slice(0, 30),
    'form1[0].Page2[0].DOBmonth[4]': signatureDate.month,
    'form1[0].Page2[0].DOBday[3]': signatureDate.day,
    'form1[0].Page2[0].DOByear[3]': signatureDate.year,
    'form1[0].Page2[0].Signature[0]': formatFullName(
      transformedData.recipientName,
    ),
  });
}

export default transformForSubmit;
