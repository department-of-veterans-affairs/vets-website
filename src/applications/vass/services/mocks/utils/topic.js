/** @typedef {import('../../../utils/appointments').Topic} Topic */

const mockTopics = [
  { topicId: 'burial', topicName: 'Burial' },
  {
    topicId: 'personalized-career-planning',
    topicName: 'Personalized Career Planning and Guidance (Chapter 36)',
  },
  { topicId: 'compensation', topicName: 'Compensation' },
  { topicId: 'dental', topicName: 'Dental' },
  { topicId: 'discharge-upgrade', topicName: 'Discharge upgrade' },
  { topicId: 'education', topicName: 'Education' },
  { topicId: 'finance', topicName: 'Finance' },
  { topicId: 'health-care', topicName: 'Health care' },
  { topicId: 'insurance', topicName: 'Insurance' },
  { topicId: 'legal', topicName: 'Legal' },
  { topicId: 'loan-gauranty', topicName: 'Loan Gauranty' },
  {
    topicId: 'mental-health-support-resources',
    topicName: 'Mental health support/resources',
  },
  { topicId: 'pension', topicName: 'Pension' },
  { topicId: 'va-records', topicName: 'VA records' },
  {
    topicId: 'veteran-readiness-and-employment',
    topicName: 'Veteran Readiness and Employment (Chapter 31)',
  },
  {
    topicId: 'women-veterans-coordinator',
    topicName: 'Women Veterans Coordinator',
  },
  { topicId: 'general-va-benefits', topicName: 'General VA benefits' },
];

/**
 * Creates the default set of mock topics.
 * @param {number} [numberOfTopics=17] - Number of topics to include in the response.
 * @returns {Topic[]} Array of topic objects.
 */
const createDefaultTopics = (numberOfTopics = 17) => {
  return mockTopics.slice(0, numberOfTopics);
};

module.exports = {
  createDefaultTopics,
};
