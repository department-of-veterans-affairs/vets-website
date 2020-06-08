import { normal, slow } from 'platform/testing/e2e/timeouts';
import { createE2eTest, baseUrl } from 'platform/testing/e2e/helpers';
import { production } from '../manifest.json';

const allNo = {
  questions: [
    { id: 'question-isStaff', value: 'no' },
    { id: 'question-fever', value: 'no' },
    { id: 'question-cough', value: 'no' },
    { id: 'question-flu', value: 'no' },
    { id: 'question-congestion', value: 'no' },
    { id: 'question-exposure', value: 'no' },
  ],
  result: {
    class: 'covid-screener-results-pass',
  },
};

function testQuestionScenario({ scenario, client }) {
  scenario.questions.forEach((question, index, arr) => {
    client
      .waitForElementVisible(`div[id=${question.id}]`, slow)
      .assert.visible(`div[id=${question.id}]`)
      // extra click workaround for https://github.com/nightwatchjs/nightwatch/issues/1221
      .click(`div[id=${question.id}] > button[value=${question.value}]`)
      .click(`div[id=${question.id}] > button[value=${question.value}]`);
  });
  client
    .waitForElementVisible(`div[class*=${scenario.result.class}]`, slow)
    .assert.visible(`div[class*=${scenario.result.class}]`);
}

export default createE2eTest(client => {
  client
    .url(`${baseUrl}/covid19screen`)
    .waitForElementVisible('body', normal)
    .assert.visible('div[id=question-isStaff]')
    .assert.visible('div[class*=covid-screener-results-incomplete]')
    .axeCheck('.main');

  // all "no" should result in "pass"
  testQuestionScenario({ scenario: allNo, client });
});

// module.exports['@disabled'] = !production || __BUILDTYPE__ !== 'production';
