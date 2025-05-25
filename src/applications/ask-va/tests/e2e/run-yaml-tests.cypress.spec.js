/// <reference types="cypress" />

import YAML from 'yaml';
import mockUserDefault from './fixtures/userDefault.json';

import mockMultipleInquiries from './fixtures/mockMultipleInquiries.json';
import mockOneInquiry from './fixtures/mockOneInquiry.json';
import mockNoInquiries from './fixtures/mockNoInquiries.json';

import mockAVAProfile from './fixtures/userAVAProfile.json';
import mockAVAProfileMissingInfo from './fixtures/userAVAProfileMissingInfo.json';

import interceptAskVaResponses from './fixtures/api-mocks-for-ask-va';
import interceptVaGovResponses from './fixtures/api-mocks-for-va-gov';
import intercept3rdPartyResponses from './fixtures/api-mocks-for-3rd-party';

import STEPS from './actions';

import formsTestsToRun from './fixtures/flows/forms/tests-to-run.json';
import dashBoardTestsToRun from './fixtures/flows/dashboard/tests-to-run.json';

const EMPTY_FLOW_YML = `
flow:
  steps:
    - action: log
      value:  No steps defined in this flow.
`.trim();

const executeSteps = (steps, folder) => {
  let index = 0;

  for (const step of steps) {
    switch (step.action) {
      case 'click':
        switch (step.target) {
          case 'tab':
            STEPS.clickTab(step.value);
            break;
          case 'link':
            STEPS.clickLink(step.value);
            break;
          case 'call-to-action':
            STEPS.clickCallToActionButton('primary');
            break;
          case 'call-to-action-secondary':
            STEPS.clickCallToActionButton('secondary', step.value);
            break;
          case 'call-to-action-not-primary':
            STEPS.clickCallToActionButton('neither', step.value);
            break;
          case 'radio': // TODO: Refactor into a single radio button function, if possible
            STEPS.clickRadioButton(step.value);
            break;
          case 'radioYesNo': // NOTE: This is a special case for radio buttons with 'Yes' and 'No' labels
            STEPS.clickRadioButtonYesNo(step.value);
            break;
          case 'search':
            STEPS.clickSearchButton(step.value);
            break;
          default:
            throw new Error(
              `Unknown click target for step #${index + 1}: ${step.target}`,
            );
        }
        break;
      case 'exists':
        switch (step.target) {
          case 'header':
            cy.log('STEPS');
            cy.log(STEPS);
            STEPS.ensureExists(step.value);
            break;
          case 'paragraph':
            STEPS.ensureExists(step.value, 'p');
            break;
          case 'error':
            STEPS.ensureExists(step.value, 'span.usa-error-message');
            break;
          case 'errorInput':
            STEPS.ensureExists(step.value, 'span.usa-input-error-message');
            break;
          default:
            throw new Error(
              `Unknown exists target for step #${index + 1}: ${step.target}`,
            );
        }
        break;
      case 'typeTextInput':
        STEPS.typeText(step.target, step.value);
        break;
      case 'typeTextArea':
        STEPS.typeTextArea(step.target, step.value);
        break;
      case 'select':
        if (step.target === 'status') {
          step.target = 'va-select[name="status"] select.usa-select';
        } else if (step.target === 'category') {
          step.target = 'va-select[name="category"] select.usa-select';
        }
        STEPS.selectOption(step.target, step.value);
        break;
      case 'log':
        cy.log(step.value);
        break;
      case 'include':
        if (step.target === 'page') {
          // TODO: run steps from the included page
          const p = `src/applications/ask-va/tests/e2e/fixtures/flows/${folder}/include-pages/${
            step.value
          }.yml`;
          cy.wrap(null).then(() => {
            cy.readFile(`${p}`).then(f => {
              const flow = YAML.parse(f); // .flow;
              executeSteps(flow.steps, folder);
            });
          });
        }
        break;
      default:
        throw new Error(
          `Unknown action for step #${index + 1}: ${step.action} on target ${
            step.target
          }`,
        );
    }
    index += 1;
  }
};

describe('YAML tests', () => {
  describe(`Preload flows`, () => {
    describe('Run tests', () => {
      // eslint-disable-next-line func-names
      const testRunner = function(folder, path, file) {
        let flowYML = EMPTY_FLOW_YML;
        const p = `src/applications/ask-va/tests/e2e/fixtures/flows/${folder}/${path}/${file}`;
        cy.readFile(p).then(f => {
          flowYML = f;

          const { flow } = YAML.parse(flowYML);
          cy.log(`Flow.runOnCI ${flow.runOnCI}`);
          cy.log(`File ${file}`);

          if (flow.runOnCI === true) {
            if (['13m.yml'].includes(file)) {
              cy.visit(
                'http://localhost:3001/contact-us/ask-va/user/dashboard/A-20250409-2205184',
              );
            } else {
              cy.visit('http://localhost:3001/contact-us/ask-va/');
            }
            cy.injectAxeThenAxeCheck();
            executeSteps(flow.steps, folder);
          } else {
            this.skip();
          }
        });
      };

      // eslint-disable-next-line func-names
      const runAndLogTest = function(folder, path, file) {
        if (file.endsWith('.yml')) {
          cy.log('-------------------');
          cy.log(`Run tests in ${file}, ${path} in ${folder}`);
          cy.log('-------------------');

          if (folder === 'forms') {
            if (path === 'authenticated') {
              if (['13g.yml', '17g.yml'].includes(file)) {
                cy.intercept(
                  'GET',
                  '/v0/in_progress_forms/0873',
                  mockAVAProfileMissingInfo,
                );
              } else {
                cy.intercept(
                  'GET',
                  '/v0/in_progress_forms/0873',
                  mockAVAProfile,
                );
              }
              cy.login(mockUserDefault);
            } else {
              cy.clearAllCookies();
            }
          } else {
            if (['4k.yml'].includes(file)) {
              cy.intercept(
                'GET',
                'http://localhost:3000/ask_va_api/v0/inquiries',
                mockMultipleInquiries,
              );
            } else if (['14g.yml', '18g.yml'].includes(file)) {
              cy.intercept(
                'GET',
                'http://localhost:3000/ask_va_api/v0/inquiries',
                mockOneInquiry,
              );
            } else {
              cy.intercept(
                'GET',
                `http://localhost:3000/ask_va_api/v0/inquiries`,
                mockNoInquiries,
              );
            }
            cy.login(mockUserDefault);
          }
        }
        testRunner.call(this, folder, path, file);
      };

      beforeEach(() => {
        // Intercept all relevant API calls for the Ask VA page
        interceptAskVaResponses();
        interceptVaGovResponses();
        intercept3rdPartyResponses();
      });

      const runTestsForFilesInPath = (folder, files) => {
        const paths = Object.keys(files);
        for (const path of paths) {
          if (path !== 'include-pages') {
            (() => {
              for (const file of files[path]) {
                // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required, func-names
                it(`Run tests in ${folder} for ${file}`, function() {
                  runAndLogTest.call(this, folder, path, file);
                });
              }
            })();
          }
        }
      };
      runTestsForFilesInPath('dashboard', dashBoardTestsToRun);
      runTestsForFilesInPath('forms', formsTestsToRun);
    });
  });
});
