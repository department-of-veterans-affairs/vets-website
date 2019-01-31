const transformedMinimalDataActual = {
  privacyAgreementAccepted: true,
  applicantFullName: {
    first: 'testy',
    last: 'mcTestFace',
  },
  bankAccount: {
    accountType: 'checking',
    routingNumber: '021000021',
    accountNumber: '1',
  },
};

export const transformedMinimalData = JSON.stringify({
  educationBenefitsClaim: {
    form: JSON.stringify(transformedMinimalDataActual),
  },
});

const transformedMaximalDataActual = {
  privacyAgreementAccepted: true,
  applicantFullName: {
    first: 'testy',
    last: 'mcTestFace',
  },
  bankAccount: {
    accountType: 'checking',
    routingNumber: '021000021',
    accountNumber: '1',
  },
};

export const transformedMaximalData = JSON.stringify({
  educationBenefitsClaim: {
    form: JSON.stringify(transformedMaximalDataActual),
  },
});
