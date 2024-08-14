const prefill = {
  formData: {
    data: {
      attributes: {
        veteran: {
          address: {
            addressLine1: '623 Lesser Dr',
            city: 'Fort Collins',
            stateCode: 'CO',
            zipCode5: '80524',
            countryName: 'USA',
          },
          firstName: 'John',
          lastName: 'Donut',
          middleName: 'Jelly',
          phone: {
            areaCode: '970',
            phoneNumber: '5561289',
          },
          emailAddressText: 'sample@email.com',
          ssn: '3607',
        },
      },
    },
  },
  metadata: {
    version: 0,
    prefill: true,
    returnUrl: '/veteran-details',
  },
};

module.exports = {
  prefill,
};
