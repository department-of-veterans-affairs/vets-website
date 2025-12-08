const subDays = require('date-fns/subDays');
const format = require('date-fns/format');

const createClaimsSuccess = (updatedDaysAgo = 1, open = true) => {
  const daysAgo = subDays(new Date(), updatedDaysAgo);
  const formattedDaysAgo = format(daysAgo, 'yyyy-MM-dd');
  return {
    data: [
      {
        id: '333333',
        type: 'claim',
        attributes: {
          claimDate: '2023-10-18',
          claimPhaseDates: {
            phaseChangeDate: formattedDaysAgo,
          },
          claimType: 'Compensation',
          claimTypeBase: 'compensation claim',
          closeDate: open ? null : '2023-10-31',
          decisionLetterSent: false,
          developmentLetterSent: false,
          displayTitle: 'Claim for compensation',
          documentsNeeded: true,
          endProductCode: '404',
          evidenceWaiverSubmitted5103: false,
          lighthouseId: 266374,
          status: open ? 'EVIDENCE_GATHERING_REVIEW_DECISION' : 'COMPLETE',
        },
      },
      {
        id: '266374',
        type: 'claim',
        attributes: {
          claimDate: '2013-10-18',
          claimPhaseDates: {
            phaseChangeDate: formattedDaysAgo,
          },
          claimType: 'Dependency',
          claimTypeBase: 'request to add or remove a dependent',
          closeDate: open ? null : '2013-10-31',
          decisionLetterSent: false,
          developmentLetterSent: false,
          displayTitle: 'Request to add or remove a dependent',
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
          claimTypeBase: 'request to add or remove a dependent',
          closeDate: formattedDaysAgo,
          decisionLetterSent: false,
          developmentLetterSent: false,
          displayTitle: 'Request to add or remove a dependent',
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
          claimTypeBase: 'compensation claim',
          closeDate: formattedDaysAgo,
          decisionLetterSent: false,
          developmentLetterSent: false,
          displayTitle: 'Claim for compensation',
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

const createClaimsFailure = () => {
  return {
    errors: [
      {
        title: 'Bad Request',
        detail: 'Received a bad request response from the upstream server',
        code: 'EVSS400',
        source: 'EVSS::DisabilityCompensationForm::Service',
        status: '400',
        meta: {},
      },
    ],
  };
};

module.exports = {
  createClaimsFailure,
  createClaimsSuccess,
};
