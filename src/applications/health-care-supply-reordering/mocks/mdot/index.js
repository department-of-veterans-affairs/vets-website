const suppliesResponse = {
  formData: {
    fullName: {
      first: 'Greg',
      middle: 'A',
      last: 'Anderson',
    },
    permanentAddress: {
      street: '101 EXAMPLE STREET',
      street2: 'APT 2',
      city: 'KANSAS CITY',
      state: 'MO',
      country: 'United States',
      postalCode: '64117',
    },
    temporaryAddress: {
      street: '17250 W COLFAX AVE',
      street2: 'A-204',
      city: 'GOLDEN',
      state: 'CO',
      country: 'United States',
      postalCode: '80401',
    },
    ssnLastFour: '1200',
    gender: 'M',
    vetEmail: 'vets.gov.user+1@gmail.com',
    dateOfBirth: '1933-04-05',
    eligibility: {
      accessories: true,
      apneas: true,
      batteries: true,
    },
    supplies: [
      {
        productName: 'ERHK HE11 680 MINI',
        productGroup: 'Accessory',
        productId: 6584,
        availableForReorder: true,
        lastOrderDate: '2022-05-16',
        nextAvailabilityDate: '2022-10-16',
        quantity: 5,
      },
      {
        productName: 'AIRFIT F10 M',
        productGroup: 'Apnea',
        productId: 6641,
        availableForReorder: true,
        lastOrderDate: '2022-07-05',
        nextAvailabilityDate: '2022-12-05',
        quantity: 1,
      },
      {
        productName: 'AIRFIT P10',
        productGroup: 'Apnea',
        productId: 6650,
        availableForReorder: true,
        lastOrderDate: '2022-07-05',
        nextAvailabilityDate: '2022-12-05',
        quantity: 1,
      },
      {
        productName: 'AIRCURVE10-ASV-CLIMATELINE',
        productGroup: 'Apnea',
        productId: 8467,
        lastOrderDate: '2022-07-06',
        nextAvailabilityDate: '2022-12-06',
        quantity: 1,
      },
    ],
  },
  metadata: {
    version: 0,
    prefill: true,
    returnUrl: '/veteran-information',
  },
};

module.exports = { suppliesResponse };
