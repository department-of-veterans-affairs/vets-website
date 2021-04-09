export function prefillTransformer(pages, formData, metadata) {
  const {
    veteranFullName,
    veteranSocialSecurityNumber,
    homePhone,
    mobilePhone,
    email,
    address,
    dateOfBirth,
    bankAccount,
  } = formData;

  const newFormData = {
    'view:applicantInformation': {
      veteranFullName,
      veteranSocialSecurityNumber,
      dateOfBirth,
    },
    'view:contactInformation': {
      'view:phoneAndEmail': {
        mobilePhone,
        alternatePhone: homePhone,
        email,
      },
      address,
    },
    'view:directDeposit': {
      bankAccount: {
        accountType: bankAccount.accountType.toLowerCase(),
        routingNumber: bankAccount.routingNumber,
        accountNumber: bankAccount.accountNumber,
      },
    },
  };

  return {
    metadata,
    formData: newFormData,
    pages,
  };
}
