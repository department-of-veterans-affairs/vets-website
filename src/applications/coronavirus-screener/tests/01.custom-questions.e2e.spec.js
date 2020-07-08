import { normal } from 'platform/testing/e2e/timeouts';
import { createE2eTest, baseUrl } from 'platform/testing/e2e/helpers';
import { testQuestionScenario } from './question-scenario-helper';

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

// custom travel question /459
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

  // staff travel passing
  testQuestionScenario({ scenario: staffPassTravel459, client });

  // staff travel more screening
  testQuestionScenario({ scenario: staffScreeningTravel459, client });
});



const visitorPassTravel459GH = visitorPassTravel459;
visitorPassTravel459GH.question.[6].id = 'question-travel-459GH';

const visitorScreeningTravel459GH = visitorScreeningTravel459;
visitorScreeningTravel459GH.question.[6].id = 'question-travel-459GH';

const staffPassTravel459GH = staffPassTravel459;
staffPassTravel459GH.question.[6].id = 'question-travel-459GH';

const staffScreeningTravel459GH = staffScreeningTravel459;
staffScreeningTravel459GH.question.[6].id = 'question-travel-459GH';



// custom travel question /459GH
export default createE2eTest(client => {
  client
    .url(`${baseUrl}/covid19screen/459GH`)
    .waitForElementVisible('body', normal)
    .assert.visible('div[id=question-isStaff]')
    .assert.visible('div[class*=covid-screener-results-incomplete]')
    .axeCheck('.main');

  // visitor travel passing answers
  testQuestionScenario({ scenario: visitorPassTravel459GH, client });

  // visitor travel needs more screening
  testQuestionScenario({ scenario: visitorScreeningTravel459GH, client });

  // staff travel passing
  testQuestionScenario({ scenario: staffPassTravel459GH, client });

  // staff travel more screening
  testQuestionScenario({ scenario: staffScreeningTravel459GH, client });
});


// custom travel question case insensitive /459gh 
export default createE2eTest(client => {
  client
    .url(`${baseUrl}/covid19screen/459gh`)
    .waitForElementVisible('body', normal)
    .assert.visible('div[id=question-isStaff]')
    .assert.visible('div[class*=covid-screener-results-incomplete]')
    .axeCheck('.main');

  // visitor travel passing answers
  testQuestionScenario({ scenario: visitorPassTravel459GH, client });

  // visitor travel needs more screening
  testQuestionScenario({ scenario: visitorScreeningTravel459GH, client });

  // staff travel passing
  testQuestionScenario({ scenario: staffPassTravel459GH, client });

  // staff travel more screening
  testQuestionScenario({ scenario: staffScreeningTravel459GH, client });
});

