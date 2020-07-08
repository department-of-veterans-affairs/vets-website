import { normal } from 'platform/testing/e2e/timeouts';
import { createE2eTest, baseUrl } from 'platform/testing/e2e/helpers';
import { testQuestionScenario } from './question-scenario-helper';

// visitor travel passing answers
const visitorPassTravel459 = {
  title: 'Visitor pass travel 459',
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

// visitor travel needs more screening
const visitorScreeningTravel459 = {
  title: 'Visitor needs more screening travel 459',
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

// staff travel passing
const staffPassTravel459 = {
  title: 'Staff pass travel 459',
  questions: [
    { id: 'question-isStaff', value: 'yes' },
    { id: 'question-fever', value: 'no' },
    { id: 'question-cough', value: 'no' },
    { id: 'question-flu', value: 'no' },
    { id: 'question-congestion', value: 'no' },
    { id: 'question-exposure-staff', value: 'no' },
    { id: 'question-travel-459', value: 'no' },
  ],
  result: {
    class: 'covid-screener-results-pass',
  },
};

// staff travel more screening
const staffScreeningTravel459 = {
  title: 'Staff needs more screening travel 459',
  questions: [
    { id: 'question-isStaff', value: 'yes' },
    { id: 'question-fever', value: 'no' },
    { id: 'question-cough', value: 'no' },
    { id: 'question-flu', value: 'no' },
    { id: 'question-congestion', value: 'no' },
    { id: 'question-exposure-staff', value: 'no' },
    { id: 'question-travel-459', value: 'yes' },
  ],
  result: {
    class: 'covid-screener-results-more-screening',
  },
};

const visitorPassTravel459GH = visitorPassTravel459;
visitorPassTravel459GH.question[6].id = 'question-travel-459GH';

const visitorScreeningTravel459GH = visitorScreeningTravel459;
visitorScreeningTravel459GH.question[6].id = 'question-travel-459GH';

const staffPassTravel459GH = staffPassTravel459;
staffPassTravel459GH.question[6].id = 'question-travel-459GH';

const staffScreeningTravel459GH = staffScreeningTravel459;
staffScreeningTravel459GH.question[6].id = 'question-travel-459GH';

export default createE2eTest(client => {
  // custom travel question /459
  client
    .url(`${baseUrl}/covid19screen/459`)
    .waitForElementVisible('body', normal)
    .assert.visible('div[id=question-isStaff]')
    .assert.visible('div[class*=covid-screener-results-incomplete]')
    .axeCheck('.main');

  testQuestionScenario({ scenario: visitorPassTravel459, client });
  testQuestionScenario({ scenario: visitorScreeningTravel459, client });
  testQuestionScenario({ scenario: staffPassTravel459, client });
  testQuestionScenario({ scenario: staffScreeningTravel459, client });

  // custom travel question /459GH
  client
    .url(`${baseUrl}/covid19screen/459GH`)
    .waitForElementVisible('body', normal)
    .assert.visible('div[id=question-isStaff]')
    .assert.visible('div[class*=covid-screener-results-incomplete]')
    .axeCheck('.main');

  testQuestionScenario({ scenario: visitorPassTravel459GH, client });
  testQuestionScenario({ scenario: visitorScreeningTravel459GH, client });
  testQuestionScenario({ scenario: staffPassTravel459GH, client });
  testQuestionScenario({ scenario: staffScreeningTravel459GH, client });

  // custom travel question case insensitive /459gh
  client
    .url(`${baseUrl}/covid19screen/459gh`)
    .waitForElementVisible('body', normal)
    .assert.visible('div[id=question-isStaff]')
    .assert.visible('div[class*=covid-screener-results-incomplete]')
    .axeCheck('.main');

  testQuestionScenario({ scenario: visitorPassTravel459GH, client });
  testQuestionScenario({ scenario: visitorScreeningTravel459GH, client });
  testQuestionScenario({ scenario: staffPassTravel459GH, client });
  testQuestionScenario({ scenario: staffScreeningTravel459GH, client });
});
