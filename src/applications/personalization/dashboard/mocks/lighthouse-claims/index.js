const subDays = require('date-fns/addDays');
const format = require('date-fns/format');

const createLighthouseClaimsSuccess = (updatedDaysAgo = 1, open = true) => {
  const daysAgo = subDays(new Date(), updatedDaysAgo);
  const formattedDaysAgo = format(daysAgo, 'yyyy-MM-dd');
  return {
    data: [
      {
        id: '266374',
        type: 'claim',
        attributes: {
          claimDate: '2013-10-18',
          claimPhaseDates: {
            phaseChangeDate: formattedDaysAgo,
          },
          claimType: 'Dependency',
          closeDate: null,
          decisionLetterSent: false,
          developmentLetterSent: true,
          documentsNeeded: false,
          endProductCode: '404',
          evidenceWaiverSubmitted5103: false,
          lighthouseId: 266374,
          status: open ? 'Initial review' : 'Complete',
        },
      },
      {
        id: '600121251',
        type: 'claim',
        attributes: {
          claimDate: '2018-01-10',
          claimPhaseDates: {
            phaseChangeDate: '2018-06-12',
          },
          claimType: 'Dependency',
          closeDate: null,
          decisionLetterSent: false,
          developmentLetterSent: false,
          documentsNeeded: false,
          endProductCode: '404',
          evidenceWaiverSubmitted5103: false,
          lighthouseId: 600121251,
          status: 'Complete',
        },
      },
      {
        id: '600090417',
        type: 'claim',
        attributes: {
          claimDate: '2017-01-02',
          claimPhaseDates: {
            phaseChangeDate: '2016-12-06',
          },
          claimType: 'Compensation',
          closeDate: null,
          decisionLetterSent: false,
          developmentLetterSent: false,
          documentsNeeded: false,
          endProductCode: '404',
          evidenceWaiverSubmitted5103: false,
          lighthouseId: 600090417,
          status: 'Complete',
        },
      },
    ],
  };
};

module.exports = {
  createLighthouseClaimsSuccess,
};
