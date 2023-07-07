import { daysAgo } from '../helpers';

const claimsSuccess = (updatedDaysAgo = 1, open = true) => {
  return {
    data: [
      {
        id: '266374',
        type: 'claim',
        attributes: {
          claimDate: '2013-10-18',
          claimPhaseDates: {
            phaseChangeDate: daysAgo(updatedDaysAgo),
          },
          claimType: 'Dependency',
          closeDate: null,
          decisionLetterSent: false,
          developmentLetterSent: false,
          documentsNeeded: false,
          endProductCode: '404',
          evidenceWaiverSubmitted5103: false,
          lighthouseId: 266374,
          status: open ? 'Initial review' : 'Closed',
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
          status: 'Closed',
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
          status: 'Closed',
        },
      },
    ],
    meta: { syncStatus: 'SUCCESS' },
  };
};

export default claimsSuccess;
