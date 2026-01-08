import kitchenSinkFixture from 'vets-json-schema/dist/21P-527EZ-KITCHEN_SINK-cypress-example.json';
import overflowFixture from 'vets-json-schema/dist/21P-527EZ-OVERFLOW-cypress-example.json';
import simpleFixture from 'vets-json-schema/dist/21P-527EZ-SIMPLE-cypress-example.json';

import formConfig from '../../config/form';
import cypressSetup, { cypressBeforeAllSetup } from './cypress.setup';
import {
  keyboardTestArrayPages,
  keyboardTestPage,
  fillReviewPage,
  fillSchema,
  fillField,
} from './helpers/keyboardOnlyHelpers';
import { shouldHaveVaTextInputError } from './helpers';
import pagePaths from './pagePaths';

const skipInCI = (testKey, callback) =>
  Cypress.env('CI')
    ? context.skip(testKey, callback)
    : context(testKey, callback);

const testForm = (data, pageHooks = {}) => {
  const { chapters } = formConfig;

  cy.clickStartForm();

  let pathsVisited = [];
  Object.values(chapters).forEach(chapter => {
    Object.values(chapter.pages).forEach(page => {
      if (pathsVisited.includes(page.path)) return;
      const pageHook = pageHooks[page.path];
      if (typeof pageHook === 'function') {
        pathsVisited = pathsVisited.concat(pageHook(page, chapter, data));
      } else if (page.path.includes(':index')) {
        pathsVisited = pathsVisited.concat(
          keyboardTestArrayPages(page, chapter, data),
        );
      } else {
        pathsVisited = pathsVisited.concat(keyboardTestPage(page, data));
      }
    });
  });

  fillReviewPage(data);
  cy.wait(['@submitApplication']);
  cy.url().should('include', '/confirmation');
};

describe('Pensions keyboard only navigation', () => {
  before(() => {
    cypressBeforeAllSetup();
  });
  context('Simple', () => {
    it('keyboard navigates through the form', () => {
      cy.wrap(simpleFixture.data).as('testData');
      cypressSetup(cy);

      cy.get('@testData').then(data => {
        cy.injectAxeThenAxeCheck();

        testForm(data);
      });
    });
  });
  skipInCI('Kitchen sink', () => {
    it('keyboard navigates through the form', () => {
      cy.wrap(kitchenSinkFixture.data).as('testData');
      cypressSetup(cy);

      cy.get('@testData').then(data => {
        cy.injectAxeThenAxeCheck();

        testForm(data);
      });
    });
  });
  skipInCI('Overflow', () => {
    it('keyboard navigates through the form', () => {
      cy.wrap(overflowFixture.data).as('testData');
      cypressSetup(cy);

      cy.get('@testData').then(data => {
        cy.injectAxeThenAxeCheck();

        testForm(data);
      });
    });
  });
  context('Unhappy paths', () => {
    it('validates missing SSN', () => {
      cy.wrap(simpleFixture.data).as('testData');
      cypressSetup(cy);

      cy.get('@testData').then(data => {
        cy.injectAxeThenAxeCheck();

        testForm(data, {
          [pagePaths.applicantInformation]: (page, chapter, d) => {
            fillSchema({
              schema: page.schema.properties.veteranFullName,
              uiSchema: page.uiSchema.veteranFullName,
              path: ['veteranFullName'],
              data: d,
            });
            fillField({
              fieldData: d.veteranDateOfBirth,
              elementSchema: page.schema.properties.veteranDateOfBirth,
              type: 'VaMemorableDateField',
              elementPath: ['veteranDateOfBirth'],
            });
            cy.tabToContinueForm();
            shouldHaveVaTextInputError(
              'root_veteranSocialSecurityNumber',
              'Enter a valid 9-digit Social Security number (dashes allowed)',
            );

            // returning the keyboard test page allows the test to continue with a valid SSN
            return keyboardTestPage(page, d);
          },
        });
      });
    });
  });
});
