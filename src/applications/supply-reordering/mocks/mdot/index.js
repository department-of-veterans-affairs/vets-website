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
      country: 'UNITED STATES',
      postalCode: '64117',
    },
    temporaryAddress: {
      street: 'PSC 1234 BOX 12345',
      street2: ', ',
      city: 'APO',
      state: 'AE',
      country: 'ARMED FORCES AF,EU,ME,CA',
      postalCode: '09324',
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

// Source: https://github.com/department-of-veterans-affairs/vets-api/blob/f6a4f2fb76739e63a8cbaaa87d5de12db9096bba/config/locales/exceptions.en.yml#L2327
// This manifests as a 404 on the FE.
const veteranNotFoundResponse = {
  status: 404,
  data: {
    errors: [
      {
        title: 'Veteran Not Found',
        detail: 'The veteran could not be found',
        code: 'MDOT_invalid',
        source: 'MDOT::Client',
        status: '401',
      },
    ],
  },
};

// Source: https://github.com/department-of-veterans-affairs/vets-api/blob/f6a4f2fb76739e63a8cbaaa87d5de12db9096bba/config/locales/exceptions.en.yml#L2290
// Seems like this should be status: 500, but just going with what's in the vets-api code.
const internalServerError = {
  status: 500,
  data: {
    errors: [
      {
        title: 'Internal Server Error',
        detail: 'The upstream server returned an error code that is unmapped',
        code: 'unmapped_service_exception',
        source: 'MDOT::Client',
        status: '400',
      },
    ],
  },
};

module.exports = {
  suppliesResponse,
  veteranNotFoundResponse,
  internalServerError,
};
