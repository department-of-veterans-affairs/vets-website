const none = {
  data: {
    id: '',
    type: 'arrays',
    attributes: {
      serviceHistory: [],
    },
  },
};

const generateServiceHistory = ({ branchOfService = 'Air Force' }) => {
  return {
    data: {
      id: '',
      type: 'arrays',
      attributes: {
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

module.exports = {
  none,
  error,
  airForce,
  spaceForce,
};
