/**
 * Field mapping between our form fields and PDF backend fields
 * This ensures our data structure aligns with what the backend expects
 */

const fieldMapping = {
  // Section 1: Veteran Information
  veteranFullName: {
    first: 'form1[0].#subform[2].VeteransFirstName[0]',
    middle: 'form1[0].#subform[2].VeteransMiddleInitial1[0]',
    last: 'form1[0].#subform[2].VeteransLastName[0]',
  },
  veteranSsn: {
    // Will need to split SSN into parts for backend
    first3:
      'form1[0].#subform[2].VeteransSocialSecurityNumber_FirstThreeNumbers[0]',
    middle2:
      'form1[0].#subform[2].VeteransSocialSecurityNumber_SecondTwoNumbers[0]',
    last4:
      'form1[0].#subform[2].VeteransSocialSecurityNumber_LastFourNumbers[0]',
  },
  veteranVaFileNumber: 'form1[0].#subform[2].VAFileNumber[0]',

  // Section 1: Beneficiary Information
  beneficiaryFullName: {
    first: 'form1[0].#subform[2].Name_Of_Deceased_Beneficiary_FirstName[0]',
    middle:
      'form1[0].#subform[2].Name_Of_Deceased_Beneficiary_MiddleInitial1[0]',
    last: 'form1[0].#subform[2].Name_Of_Deceased_Beneficiary_LastName[0]',
  },
  beneficiaryDateOfDeath: {
    // Will need to split date into parts
    month: 'form1[0].#subform[2].Beneficiary_Date_Of_Death_Month[0]',
    day: 'form1[0].#subform[2].Beneficiary_Date_Of_Death_Day[0]',
    year: 'form1[0].#subform[2].Beneficiary_Date_Of_Death_Year[0]',
  },

  // Section 1: Claimant Information
  claimantFullName: {
    first: 'form1[0].#subform[2].Claimants_FirstName[0]',
    middle: 'form1[0].#subform[2].Claimants_MiddleInitial1[0]',
    last: 'form1[0].#subform[2].Claimants_LastName[0]',
  },
  claimantSsn: {
    first3:
      'form1[0].#subform[2].Claimants_SocialSecurityNumber_FirstThreeNumbers[0]',
    middle2:
      'form1[0].#subform[2].Claimants_SocialSecurityNumber_SecondTwoNumbers[0]',
    last4:
      'form1[0].#subform[2].Claimants_SocialSecurityNumber_LastFourNumbers[0]',
  },
  claimantDateOfBirth: {
    month: 'form1[0].#subform[2].Claimants_Date_Of_Birth_Month[0]',
    day: 'form1[0].#subform[2].Claimants_Date_Of_Birth_Day[0]',
    year: 'form1[0].#subform[2].Claimants_Date_Of_Birth_Year[0]',
  },
  claimantAddress: {
    street:
      'form1[0].#subform[2].ClaimantsCurrentMailingAddress_NumberAndStreet[0]',
    street2:
      'form1[0].#subform[2].ClaimantsCurrentMailingAddress_ApartmentOrUnitNumber[0]',
    city: 'form1[0].#subform[2].ClaimantsCurrentMailingAddress_City[0]',
    state:
      'form1[0].#subform[2].ClaimantsCurrentMailingAddress_StateOrProvince[0]',
    country: 'form1[0].#subform[2].ClaimantsCurrentMailingAddress_Country[0]',
    postalCode: {
      first5:
        'form1[0].#subform[2].ClaimantsCurrentMailingAddress_ZIPOrPostalCode_FirstFiveNumbers[0]',
      last4:
        'form1[0].#subform[2].ClaimantsCurrentMailingAddress_ZIPOrPostalCode_LastFourNumbers[0]',
    },
  },
  claimantPhone:
    'form1[0].#subform[2].Claimants_Telephone_Number_Include_Area_Code[0]',
  claimantEmail: 'form1[0].#subform[2].Preferredemailaddress[0]',
  relationshipToDeceased:
    'form1[0].#subform[2].Claimants_Relationship_To_Deceased_Beneficiary[0]',

  // Section 2: Surviving Relatives
  hasSpouse: 'form1[0].#subform[2].CheckBox_Spouse[0]',
  hasChildren: 'form1[0].#subform[2].CheckBox_Child_Or_Children[0]',
  hasParents: 'form1[0].#subform[2].CheckBox_Parent[0]',
  hasNone: 'form1[0].#subform[2].CheckBox_None[0]',

  // Surviving relatives array (up to 4)
  survivingRelatives: [
    {
      fullName: 'form1[0].#subform[2].Name_First_Middle_Initial_Last[0]',
      relationship: 'form1[0].#subform[2].Relationship_To_Beneficiary[3]',
      dateOfBirth: 'form1[0].#subform[2].Date_Of_Birth_MM_DD_YYYY[0]',
      address: 'form1[0].#subform[2].Complete_Mailing_Address[0]',
    },
    {
      fullName: 'form1[0].#subform[2].Name_First_Middle_Initial_Last[1]',
      relationship: 'form1[0].#subform[2].Relationship_To_Beneficiary[0]',
      dateOfBirth: 'form1[0].#subform[2].Date_Of_Birth_MM_DD_YYYY[1]',
      address: 'form1[0].#subform[2].Complete_Mailing_Address[1]',
    },
    {
      fullName: 'form1[0].#subform[2].Name_First_Middle_Initial_Last[2]',
      relationship: 'form1[0].#subform[2].Relationship_To_Beneficiary[1]',
      dateOfBirth: 'form1[0].#subform[2].Date_Of_Birth_MM_DD_YYYY[2]',
      address: 'form1[0].#subform[2].Complete_Mailing_Address[2]',
    },
    {
      fullName: 'form1[0].#subform[2].Name_First_Middle_Initial_Last[3]',
      relationship: 'form1[0].#subform[2].Relationship_To_Beneficiary[2]',
      dateOfBirth: 'form1[0].#subform[2].Date_Of_Birth_MM_DD_YYYY[3]',
      address: 'form1[0].#subform[2].Complete_Mailing_Address[3]',
    },
  ],

  // Substitution waiver radio button
  substitutionWaiver: 'form1[0].#subform[2].RadioButtonList[0]',

  // Section 3: Expenses (up to 4 entries)
  lastIllnessExpenses: [
    {
      creditorName: 'form1[0].#subform[3].Name_Of_Person_Or_Firm[0]',
      expenseType: 'form1[0].#subform[3].Nature_Of_Expense[0]',
      amount: 'form1[0].#subform[3].Amount[0]',
      isPaid: 'form1[0].#subform[3].RadioButtonList[1]', // Radio for paid status
      paidBy: 'form1[0].#subform[3].Name_Of_Person_Or_Estate[0]',
    },
    {
      creditorName: 'form1[0].#subform[3].Name_Of_Person_Or_Firm[1]',
      expenseType: 'form1[0].#subform[3].Nature_Of_Expense[1]',
      amount: 'form1[0].#subform[3].Amount[1]',
      isPaid: 'form1[0].#subform[3].RadioButtonList[2]',
      paidBy: 'form1[0].#subform[3].Name_Of_Person_Or_Estate[1]',
    },
    {
      creditorName: 'form1[0].#subform[3].Name_Of_Person_Or_Firm[2]',
      expenseType: 'form1[0].#subform[3].Nature_Of_Expense[2]',
      amount: 'form1[0].#subform[3].Amount[2]',
      isPaid: 'form1[0].#subform[3].RadioButtonList[3]',
      paidBy: 'form1[0].#subform[3].Name_Of_Person_Or_Estate[2]',
    },
    {
      creditorName: 'form1[0].#subform[3].Name_Of_Person_Or_Firm[3]',
      expenseType: 'form1[0].#subform[3].Nature_Of_Expense[3]',
      amount: 'form1[0].#subform[3].Amount[3]',
      isPaid: 'form1[0].#subform[3].RadioButtonList[4]',
      paidBy: 'form1[0].#subform[3].Name_Of_Person_Or_Estate[3]',
    },
  ],

  // Reimbursement amount and source
  reimbursementAmount: 'form1[0].#subform[3].Enter_Amount_And_Source[0]',

  // Has estate been administered
  estateAdministered: 'form1[0].#subform[3].RadioButtonList[5]',

  // Other debts (up to 4)
  otherDebts: [
    {
      nature: 'form1[0].#subform[3].Nature_Of_Debt[3]',
      amount: 'form1[0].#subform[3].Amount[7]',
    },
    {
      nature: 'form1[0].#subform[3].Nature_Of_Debt[2]',
      amount: 'form1[0].#subform[3].Amount[6]',
    },
    {
      nature: 'form1[0].#subform[3].Nature_Of_Debt[1]',
      amount: 'form1[0].#subform[3].Amount[5]',
    },
    {
      nature: 'form1[0].#subform[3].Nature_Of_Debt[0]',
      amount: 'form1[0].#subform[3].Amount[4]',
    },
  ],

  // Estate being administered
  isEstateBeingAdministered: 'form1[0].#subform[3].YES[0]',

  // Section 4: Unpaid Creditor Waivers (up to 3)
  unpaidCreditors: [
    {
      name: 'form1[0].#subform[3].Name_Of_Unpaid_Creditor_Or_Firm_Number_1[0]',
      address: 'form1[0].#subform[3].Address_Of_Creditor_Or_Firm[0]',
      signature:
        'form1[0].#subform[3].Signature_Of_Creditor_Or_Person_Signing_For_Firm[0]',
      title: 'form1[0].#subform[3].Title[0]',
      dateSigned: 'form1[0].#subform[3].DateField2[0]',
    },
    {
      name: 'form1[0].#subform[4].Name_Of_Unpaid_Creditor_Number_2[0]',
      address: 'form1[0].#subform[4].Address_Of_Creditor_Or_Firm[1]',
      signature:
        'form1[0].#subform[4].Signature_Of_Creditor_Or_Person_Signing_For_Firm[1]',
      title: 'form1[0].#subform[4].Title[1]',
      dateSigned: 'form1[0].#subform[4].DateField2[1]',
    },
    {
      name: 'form1[0].#subform[4].Name_Of_Unpaid_Creditor_Or_Firm_Number_3[0]',
      address: 'form1[0].#subform[4].Address_Of_Creditor_Or_Firm[2]',
      signature:
        'form1[0].#subform[4].Signature_Of_Creditor_Or_Person_Signing_For_Firm[2]',
      title: 'form1[0].#subform[4].Title[2]',
      dateSigned: 'form1[0].#subform[4].DateField2[2]',
    },
  ],

  // Section 5: Signature
  claimantSignature: 'form1[0].#subform[4].Signature_Of_Claimant[0]',
  dateSigned: 'form1[0].#subform[4].DateField2[3]',

  // Witness signatures (if signing with X)
  witness1: {
    signature: 'form1[0].#subform[4].Signature_Of_Witness[0]',
    nameAndAddress:
      'form1[0].#subform[4].Printed_Name_And_Address_Of_Witness[0]',
  },
  witness2: {
    signature: 'form1[0].#subform[4].Signature_Of_Witness[1]',
    nameAndAddress:
      'form1[0].#subform[4].Printed_Name_And_Address_Of_Witness[1]',
  },

  // Section 6: Remarks
  remarks: 'form1[0].#subform[4].TextField1[0]',
};

export default fieldMapping;

/**
 * Transform functions to convert our form data to backend format
 */

export const transformSSN = ssn => {
  if (!ssn) return {};
  const cleaned = ssn.replace(/\D/g, '');
  return {
    first3: cleaned.substring(0, 3),
    middle2: cleaned.substring(3, 5),
    last4: cleaned.substring(5, 9),
  };
};

export const transformDate = date => {
  if (!date) return {};
  const [year, month, day] = date.split('-');
  return { month, day, year };
};

export const transformPostalCode = postalCode => {
  if (!postalCode) return {};
  const cleaned = postalCode.replace(/\D/g, '');
  return {
    first5: cleaned.substring(0, 5),
    last4: cleaned.substring(5, 9),
  };
};

export const transformFullName = fullName => {
  if (!fullName) return '';
  const parts = [];
  if (fullName.first) parts.push(fullName.first);
  if (fullName.middle) parts.push(fullName.middle);
  if (fullName.last) parts.push(fullName.last);
  return parts.join(' ');
};
