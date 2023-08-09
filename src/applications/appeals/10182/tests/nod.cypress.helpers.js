import { getDate } from '../../shared/utils/dates';
import { SELECTED } from '../../shared/constants';

export const getRandomDate = () =>
  getDate({
    offset: {
      months: -Math.floor(Math.random() * 6 + 1),
      days: -Math.floor(Math.random() * 10),
    },
  });

export const fixDecisionDates = (data, { unselected }) => {
  return data.map(issue => {
    const newDate = getRandomDate();
    // remove selected value so Cypress can click-select
    if (issue.decisionDate) {
      return {
        ...issue,
        decisionDate: newDate,
        [SELECTED]: unselected ? false : issue[SELECTED],
      };
    }
    return {
      ...issue,
      attributes: {
        ...issue.attributes,
        approxDecisionDate: newDate,
      },
      [SELECTED]: unselected ? false : issue[SELECTED],
    };
  });
};

const date = getDate({ offset: { months: -2 } });

export const mockContestableIssues = ({ contestedIssues }) =>
  contestedIssues.map(issue => ({
    id: null,
    type: 'contestableIssue',
    attributes: {
      ...issue.attributes,
      approxDecisionDate: date,
    },
    [SELECTED]: false,
  }));
