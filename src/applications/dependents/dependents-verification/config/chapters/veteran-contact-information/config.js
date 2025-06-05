export const customConfig = {
  key: 'personalInformation',
  path: 'veteran-contact-information',
  // depends: formData => formData?.claimantType === 'VETERAN' && hasSession(),
  veteranContactInformation: {
    name: { show: true, required: true },
    ssn: { show: true, required: true },
    vaFileNumber: { show: true, required: false },
  },
  // Temporarily use form data until pre-fill is wired up
  dataAdapter: {
    ssnPath: 'veteranSocialSecurityNumber',
    vaFileNumber: 'vaFileNumber',
  },
};
