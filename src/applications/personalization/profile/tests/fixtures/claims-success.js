import { daysAgo } from '../helpers';

const claimsSuccess = () => {
  return {
    data: [
      {
        id: '266374',
        type: 'evss_claims',
        attributes: {
          evssId: 266374,
          dateFiled: '2013-10-18',
          minEstDate: '2014-06-03',
          maxEstDate: '2014-06-08',
          phaseChangeDate: daysAgo(1),
          open: true,
          waiverSubmitted: false,
          documentsNeeded: false,
          developmentLetterSent: true,
          decisionLetterSent: false,
          phase: 2,
          everPhaseBack: false,
          currentPhaseBack: false,
          requestedDecision: false,
          claimType: 'Dependency',
          updatedAt: '2021-01-07T20:47:32.248Z',
        },
      },
      {
        id: '600121251',
        type: 'evss_claims',
        attributes: {
          evssId: 600121251,
          dateFiled: '2018-01-10',
          minEstDate: null,
          maxEstDate: null,
          phaseChangeDate: '2018-06-12',
          open: false,
          waiverSubmitted: false,
          documentsNeeded: false,
          developmentLetterSent: false,
          decisionLetterSent: false,
          phase: 8,
          everPhaseBack: false,
          currentPhaseBack: false,
          requestedDecision: false,
          claimType: 'Dependency',
          updatedAt: '2021-02-08T16:51:48.335Z',
        },
      },
      {
        id: '600090417',
        type: 'evss_claims',
        attributes: {
          evssId: 600090417,
          dateFiled: '2017-01-02',
          minEstDate: null,
          maxEstDate: null,
          phaseChangeDate: '2016-12-06',
          open: false,
          waiverSubmitted: false,
          documentsNeeded: false,
          developmentLetterSent: false,
          decisionLetterSent: false,
          phase: 8,
          everPhaseBack: false,
          currentPhaseBack: false,
          requestedDecision: false,
          claimType: 'Compensation',
          updatedAt: '2021-02-16T21:17:41.458Z',
        },
      },
    ],
    meta: { syncStatus: 'SUCCESS' },
  };
};

export default claimsSuccess;
