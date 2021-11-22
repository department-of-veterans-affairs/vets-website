import { getDate } from '../utils/dates';
import { SELECTED } from '../constants';

export const getRandomDate = () =>
  getDate({
    offset: {
      months: -Math.floor(Math.random() * 6 + 1),
      days: -Math.floor(Math.random() * 10),
    },
  });

export const fixDecisionDates = data => {
  return data.map(issue => {
    const newDate = getRandomDate();
    // remove selected value so Cypress can click-select
    if (issue.decisionDate) {
      return {
        ...issue,
        decisionDate: newDate,
        [SELECTED]: false,
      };
    }
    return {
      ...issue,
      attributes: {
        ...issue.attributes,
        approxDecisionDate: newDate,
      },
      [SELECTED]: false,
    };
  });
};
