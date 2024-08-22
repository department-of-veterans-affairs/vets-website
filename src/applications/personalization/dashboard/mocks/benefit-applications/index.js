const formatISO = require('date-fns/formatISO');
const subDays = require('date-fns/subDays');

const createApplications = (updatedDaysAgo = 1) => {
  const daysAgo = subDays(Date.now(), updatedDaysAgo);

  return {
    data: [
      {
        id: '3b03b5a0-3ad9-4207-b61e-3a13ed1c8b80',
        type: 'submission_status',
        attributes: {
          id: '3b03b5a0-3ad9-4207-b61e-3a13ed1c8b80',
          detail: '',
          formType: '21-0845',
          message: null,
          status: 'received',
          createdAt: '2023-12-15T20:40:47.583Z',
          updatedAt: formatISO(daysAgo),
        },
      },
    ],
  };
};

module.exports = {
  createApplications,
};
