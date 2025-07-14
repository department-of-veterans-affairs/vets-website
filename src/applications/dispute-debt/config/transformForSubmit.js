// This transform function is used to format the data for
//  pdf generation in the submitForm function.
const transformForSubmit = (formConfig, form) => {
  const { data } = form;
  const { veteran } = data;
  const { fullName } = veteran;
  const submissionTime = new Date();

  // Splitting up debts into education and comp & pen based on deduction codes
  const educationDebts = data.selectedDebts.filter(
    debt => debt.deductionCode !== '30',
  );
  const compAndPenDebts = data.selectedDebts.filter(
    debt => debt.deductionCode === '30',
  );

  // formatting veteran information
  const pdfData = {
    veteran: {
      dob: veteran?.dateOfBirth,
      email: veteran?.email,
      ssnLastFour: veteran?.ssn,
      vaFileLastFour: veteran?.fileNumber,
      veteranFullName: {
        first: fullName?.first,
        middle: fullName?.middle,
        last: fullName?.last,
        suffix: fullName?.suffix,
      },
      mailingAddress: {
        ...veteran?.mailingAddress,
      },
      mobilePhone: {
        ...veteran?.mobilePhone,
      },
    },
    submissionDetails: {
      submissionDateTime: submissionTime,
    },
  };

  // Keeping both education and comp & pen debts in the final object to
  //  make generating separate PDFs easier
  return {
    education: educationDebts.length
      ? { ...pdfData, selectedDebts: educationDebts }
      : null,
    compAndPen: compAndPenDebts.length
      ? { ...pdfData, selectedDebts: compAndPenDebts }
      : null,
  };
};

export default transformForSubmit;
