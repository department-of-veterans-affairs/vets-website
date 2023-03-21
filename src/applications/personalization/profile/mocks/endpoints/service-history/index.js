const none = {
  data: {
    id: '',
    type: 'arrays',
    attributes: {
      serviceHistory: [],
    },
  },
};

const generateServiceHistory = ({
  branchOfService = 'Air Force',
  dataSource = 'api.va_profile',
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
            personnelCategoryTypeCode: 'V',
          },
          {
            branchOfService,
            beginDate: '2005-04-12',
            endDate: '2009-04-11',
            personnelCategoryTypeCode: 'A',
          },
        ],
      },
    },
  };
};

const airForce = generateServiceHistory({ branchOfService: 'Air Force' });
const spaceForce = generateServiceHistory({ branchOfService: 'Space Force' });

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
  spaceForce,
  generateServiceHistoryError,
};
