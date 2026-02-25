const none = {
  data: {
    id: '',
    type: 'arrays',
    attributes: {
      serviceHistory: [],
      vetStatusEligibility: {
        confirmed: false,
        title: 'There’s a problem with your discharge status records',
        message: [
          'We’re sorry. To fix the problem with your records, call the Defense Manpower Data Center at 800-538-9552 (TTY: 711). They’re open Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.',
        ],
        status: 'warning',
      },
    },
  },
};

const generateServiceHistory = ({
  branchOfService = 'Air Force',
  dischargeCode = 'A',
  dataSource = 'api.va_profile',
  eligibility = {
    confirmed: true,
    message: [],
  },
}) => {
  return {
    data: {
      id: '',
      type: 'arrays',
      attributes: {
        dataSource,
        serviceHistory: [
          {
            branchOfService,
            beginDate: '2009-04-12',
            endDate: '2013-04-11',
            periodOfServiceTypeCode: 'V',
            periodOfServiceTypeText: 'Reserve member',
            characterOfDischargeCode: dischargeCode,
          },
          {
            branchOfService,
            beginDate: '2005-04-12',
            endDate: '2009-04-11',
            periodOfServiceTypeCode: 'A',
            periodOfServiceTypeText: 'Active duty member',
            characterOfDischargeCode: dischargeCode,
          },
        ],
        vetStatusEligibility: eligibility,
      },
    },
  };
};

const airForce = generateServiceHistory({ branchOfService: 'Air Force' });
const army = generateServiceHistory({ branchOfService: 'Army' });
const coastGuard = generateServiceHistory({ branchOfService: 'Coast Guard' });
const marineCorps = generateServiceHistory({ branchOfService: 'Marine Corps' });
const navy = generateServiceHistory({ branchOfService: 'Navy' });
const spaceForce = generateServiceHistory({ branchOfService: 'Space Force' });
const dishonorableDischarge = generateServiceHistory({
  branchOfService: 'Air Force',
  dischargeCode: 'F',
  eligibility: {
    confirmed: false,
    message: [],
  },
});
const unknownDischarge = generateServiceHistory({
  branchOfService: 'Air Force',
  dischargeCode: 'DVN',
  eligibility: {
    confirmed: false,
    message: [],
  },
});

const error = {
  errors: [
    {
      title: 'Internal server error',
      detail: 'Internal server error',
      code: '500',
      status: '500',
    },
  ],
};

const noServiceFound = {
  errors: [
    {
      title: 'No service found',
      detail: 'No service found',
      code: '403',
      status: '403',
    },
  ],
};

const generateServiceHistoryError = (errorType = '500') => {
  return {
    data: {
      attributes: {
        error: errorType === '403' ? noServiceFound : error,
      },
    },
  };
};

module.exports = {
  none,
  noServiceFound,
  error,
  airForce,
  army,
  coastGuard,
  marineCorps,
  navy,
  spaceForce,
  dishonorableDischarge,
  unknownDischarge,
  generateServiceHistoryError,
};
