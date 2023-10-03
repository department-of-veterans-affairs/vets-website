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
          closeDate: open ? null : '2013-10-31',
          decisionLetterSent: false,
          developmentLetterSent: false,
          documentsNeeded: false,
          endProductCode: '404',
          evidenceWaiverSubmitted5103: false,
          lighthouseId: 266374,
          status: open ? 'INITIAL_REVIEW' : 'COMPLETE',
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
          closeDate: daysAgo(90),
          decisionLetterSent: false,
          developmentLetterSent: false,
          documentsNeeded: false,
          endProductCode: '404',
          evidenceWaiverSubmitted5103: false,
          lighthouseId: 600121251,
          status: 'COMPLETE',
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
          closeDate: daysAgo(90),
          decisionLetterSent: false,
          developmentLetterSent: false,
          documentsNeeded: false,
          endProductCode: '404',
          evidenceWaiverSubmitted5103: false,
          lighthouseId: 600090417,
          status: 'COMPLETE',
        },
      },
    ],
  };
};

export default claimsSuccess;
