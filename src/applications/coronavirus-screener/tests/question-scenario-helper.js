import { normal, slow } from 'platform/testing/e2e/timeouts';

// wait time before clicking
const pause = 1000;

export function testQuestionScenario({ scenario, routeOption, client }) {
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
    .assert.visible(
      `div[class*=${scenario.result.class}]`,
      `${scenario.title} on route: ${routeOption}`,
    );
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

export const fullTestRouteOptions = ['/', '/es'];

export const expectTextbyLanguage = {
  en: 'COVID-19 screening tool',
  es: 'Herramienta de evaluación para COVID-19',
};

export const routeOptions = [
  {
    route: '/es',
    expectedText: `${expectTextbyLanguage.es}`,
    title: 'Route /es (expect Spanish)',
  },
  {
    route: '/123',
    expectedText: `${expectTextbyLanguage.en}`,
    title: 'Route /123 (expect English)',
  },
  {
    route: '/123/es',
    expectedText: `${expectTextbyLanguage.es}`,
    title: 'Route /123/es (expect Spanish)',
  },
  {
    route: '/',
    expectedText: `${expectTextbyLanguage.en}`,
    title: 'Route / (expect English)',
  },
  {
    route: '/fr',
    expectedText: `${expectTextbyLanguage.en}`,
    title: 'Route /fr (expect English)',
  },
  {
    route: '/459gh',
    expectedText: `${expectTextbyLanguage.en}`,
    title: 'Route /459gh (expect English)',
  },
  {
    route: '/459gh/es',
    expectedText: `${expectTextbyLanguage.es}`,
    title: 'Route /459gh/es (expect Spanish)',
  },
  {
    route: '/459gh/en',
    expectedText: `${expectTextbyLanguage.en}`,
    title: 'Route /459gh/en (expect English)',
  },
  {
    route: '/526/es/purple',
    expectedText: `${expectTextbyLanguage.es}`,
    title: 'Route /526/es/purple (expect Spanish)',
  },
];
