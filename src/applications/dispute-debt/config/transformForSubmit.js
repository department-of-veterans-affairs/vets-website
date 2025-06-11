const transformForSubmit = (formConfig, form) => {
  const { data } = form;
  const { veteran } = data;
  const { fullName } = veteran;

  // TODO: localization?
  const submissionTime = new Date();

  // return formatted data to generate the PDFs
  return {
    ...data,
    veteran: {
      dob: veteran.dateOfBirth,
      email: veteran.email,
      ssnLastFour: veteran.ssn,
      vaFileLastFour: veteran.fileNumber,
      veteranFullName: {
        first: fullName.first,
        middle: fullName.middle,
        last: fullName.last,
        suffix: fullName.suffix,
      },
      mailingAddress: {
        ...veteran.mailingAddress,
      },
      mobilePhone: {
        ...veteran.mobilePhone,
      },
    },
    submissionDetails: {
      submissionDateTime: submissionTime,
    },
  };
};

export default transformForSubmit;
