import { normal } from 'platform/testing/e2e/timeouts';
import { createE2eTest, baseUrl } from 'platform/testing/e2e/helpers';
import { testQuestionScenario } from './screener-test-question-scenarios';

const visitorPassTravel459 = {
  title: 'Visitor pass',
  questions: [
    { id: 'question-isStaff', value: 'no' },
    { id: 'question-fever', value: 'no' },
    { id: 'question-cough', value: 'no' },
    { id: 'question-flu', value: 'no' },
    { id: 'question-congestion', value: 'no' },
    { id: 'question-exposure', value: 'no' },
    { id: 'question-travel-459', value: 'no' },
  ],
  result: {
    class: 'covid-screener-results-pass',
  },
};

const visitorScreeningTravel459 = {
  title: 'Visitor needs more screening',
  questions: [
    { id: 'question-isStaff', value: 'no' },
    { id: 'question-fever', value: 'no' },
    { id: 'question-cough', value: 'yes' },
    { id: 'question-flu', value: 'no' },
    { id: 'question-congestion', value: 'no' },
    { id: 'question-exposure', value: 'no' },
    { id: 'question-travel-459', value: 'yes' },
  ],
  result: {
    class: 'covid-screener-results-more-screening',
  },
};

// custom travel question
export default createE2eTest(client => {
  client
    .url(`${baseUrl}/covid19screen/459`)
    .waitForElementVisible('body', normal)
    .assert.visible('div[id=question-isStaff]')
    .assert.visible('div[class*=covid-screener-results-incomplete]')
    .axeCheck('.main');

  // visitor travel passing answers
  testQuestionScenario({ scenario: visitorPassTravel459, client });

  // visitor travel needs more screening
  testQuestionScenario({ scenario: visitorScreeningTravel459, client });
});
