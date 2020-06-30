import { normal, slow } from 'platform/testing/e2e/timeouts';

// wait time before clicking
const pause = 500;

export function testQuestionScenario({ scenario, client }) {
  client.refresh().waitForElementVisible('body', normal);
  scenario.questions.forEach(question => {
    client
      .waitForElementVisible(`div[id=${question.id}]`, slow)
      .assert.visible(`div[id=${question.id}]`)
      // extra workaround for https://github.com/nightwatchjs/nightwatch/issues/1221
      .pause(pause)
      .click(`div[id=${question.id}] > button[value=${question.value}]`);
  });
  client
    .waitForElementVisible(`div[class*=${scenario.result.class}]`, slow)
    .assert.visible(`div[class*=${scenario.result.class}]`, scenario.title);
}

export const visitorPass = {
  title: 'Visitor pass',
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

export const visitorScreening = {
  title: 'Visitor needs more screening',
  questions: [
    { id: 'question-isStaff', value: 'no' },
    { id: 'question-fever', value: 'no' },
    { id: 'question-cough', value: 'yes' },
    { id: 'question-flu', value: 'no' },
    { id: 'question-congestion', value: 'no' },
    { id: 'question-exposure', value: 'no' },
  ],
  result: {
    class: 'covid-screener-results-more-screening',
  },
};

export const staffPass = {
  title: 'Staff pass',
  questions: [
    { id: 'question-isStaff', value: 'yes' },
    { id: 'question-fever', value: 'no' },
    { id: 'question-cough', value: 'no' },
    { id: 'question-flu', value: 'no' },
    { id: 'question-congestion', value: 'no' },
    { id: 'question-exposure-staff', value: 'no' },
  ],
  result: {
    class: 'covid-screener-results-pass',
  },
};

export const staffScreening = {
  title: 'Staff needs more screening',
  questions: [
    { id: 'question-isStaff', value: 'yes' },
    { id: 'question-fever', value: 'no' },
    { id: 'question-cough', value: 'no' },
    { id: 'question-flu', value: 'no' },
    { id: 'question-congestion', value: 'no' },
    { id: 'question-exposure-staff', value: 'yes' },
  ],
  result: {
    class: 'covid-screener-results-more-screening',
  },
};

export const visitorPassTravel = {
  title: 'Visitor pass',
  questions: [
    { id: 'question-isStaff', value: 'no' },
    { id: 'question-fever', value: 'no' },
    { id: 'question-cough', value: 'no' },
    { id: 'question-flu', value: 'no' },
    { id: 'question-congestion', value: 'no' },
    { id: 'question-exposure', value: 'no' },
    { id: 'question-travel', value: 'no' },
  ],
  result: {
    class: 'covid-screener-results-pass',
  },
};

export const visitorScreeningTravel = {
  title: 'Visitor needs more screening',
  questions: [
    { id: 'question-isStaff', value: 'no' },
    { id: 'question-fever', value: 'no' },
    { id: 'question-cough', value: 'yes' },
    { id: 'question-flu', value: 'no' },
    { id: 'question-congestion', value: 'no' },
    { id: 'question-exposure', value: 'no' },
    { id: 'question-travel', value: 'yes' },
  ],
  result: {
    class: 'covid-screener-results-more-screening',
  },
};
