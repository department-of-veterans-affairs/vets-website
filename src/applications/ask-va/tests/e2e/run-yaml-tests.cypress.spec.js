/// <reference types="cypress" />

import YAML from 'yaml';
import mockUser from './fixtures/user.json';

import interceptAskVaResponses from './fixtures/api-mocks-for-ask-va';
import interceptVaGovResponses from './fixtures/api-mocks-for-va-gov';
import intercept3rdPartyResponses from './fixtures/api-mocks-for-3rd-party';

import STEPS from './actions';

import testsToRun from './fixtures/tests-to-run.json';

const EMPTY_FLOW_YML = `
flow:
  steps:
    - action: log
      value:  No steps defined in this flow.
`.trim();

const executeSteps = steps => {
  let index = 0;

  for (const step of steps) {
    switch (step.action) {
      case 'click':
        switch (step.target) {
          case 'link':
            STEPS.clickLink(step.value);
            break;
          case 'call-to-action':
            STEPS.clickCallToActionButton();
            break;
          case 'call-to-action-not-primary':
            STEPS.clickCallToActionButton(false, step.value);
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
        // let target = step.target;
        if (step.target === 'month') {
          step.target =
            'va-select.usa-form-group--month-select select.usa-select';
        }
        STEPS.selectOption(step.target, step.value);
        break;
      case 'log':
        cy.log(step.value);
        // console.log(step.value);
        break;
      case 'include':
        if (step.target === 'page') {
          // TODO: run steps from the included page
          const p = `src/applications/ask-va/tests/e2e/fixtures/flows/include-pages/${step.value}.yml`;
          cy.wrap(null).then(() => {
            cy.readFile(`${p}`).then(f => {
              const flow = YAML.parse(f); // .flow;
              executeSteps(flow.steps);
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
  // // const paths = ["unauthenticated"]; // , "authenticated"];
  // let files = {
  //   unauthenticated: [],
  //   authenticated: [],
  //   'include-pages': [],
  // };

  // // const includePages = {};

  // // const preloadIncludes = (files) => {
  // //   const paths = Object.keys(files);

  // //   for (const path of paths) {
  // //     if (path === "include-pages") {
  // //       const p = `./cypress/e2e/1-getting-started/flows/${path}`;
  // //       cy.log(`Preloading includes in ${p}`);

  // //       for (const file of files[path]) {
  // //         cy.readFile(`${p}/${file}`).then((f) => {
  // //           const flow = YAML.parse(f).flow;
  // //           includePages[file] = flow;
  // //         });
  // //       }

  // //       let flowYML = EMPTY_FLOW_YML;
  // //     }
  // //   }
  // // };

  describe(`Preload flows`, () => {
    describe('Run tests', () => {
      const files = testsToRun;
      const paths = Object.keys(files);

      // const foo = preloadIncludes(files);

      beforeEach(() => {
        // Intercept all relevant API calls for the Ask VA page
        interceptAskVaResponses();
        interceptVaGovResponses();
        intercept3rdPartyResponses();

        // Intercept the user API request and log in
        cy.intercept('GET', `/avs/v0/avs/*`, mockUser);
        cy.login();

        // TODO: This should be in the interceptAskVaResponses function -- Joe
        cy.intercept('POST', `/ask_va_api/v0/inquiries`, '1234566');
      });

      for (const path of paths) {
        if (path === 'include-pages') {
          // don't run the include-pages scripts
          // they're just snippets to be run in larger flows
          // ---
          // eslint-disable-next-line no-continue
          continue;
        }

        for (const file of files[path]) {
          it(`Run tests in ${file}`, () => {
            if (file.endsWith('.yml')) {
              cy.log('-------------------');
              cy.log(`Run tests in ${file}`);
              cy.log('-------------------');
              let flowYML = EMPTY_FLOW_YML;

              const p = `src/applications/ask-va/tests/e2e/fixtures/flows/${path}/${file}`;
              cy.readFile(p).then(f => {
                flowYML = f;

                const { flow } = YAML.parse(flowYML);

                // TODO: Add check for CI here.
                if (flow.runOnCI === true) {
                  // cy.visit('https://staging.va.gov/contact-us/ask-va/');
                  cy.visit('http://localhost:3001/contact-us/ask-va/');
                  cy.injectAxeThenAxeCheck();
                  executeSteps(flow.steps);
                }
              });
            }
          });
        }
      }
    });
  });
});
