import kitchenSinkFixture from 'vets-json-schema/dist/21P-527EZ-KITCHEN_SINK-cypress-example.json';
import overflowFixture from 'vets-json-schema/dist/21P-527EZ-OVERFLOW-cypress-example.json';
import simpleFixture from 'vets-json-schema/dist/21P-527EZ-SIMPLE-cypress-example.json';

import formConfig from '../../config/form';
import cypressSetup, { cypressBeforeAllSetup } from './cypress.setup';
import {
  keyboardTestArrayPages,
  keyboardTestPage,
  startForm,
  fillReviewPage,
} from './helpers/keyboardOnlyHelpers';

const skipInCI = (testKey, callback) =>
  Cypress.env('CI')
    ? context.skip(testKey, callback)
    : context(testKey, callback);

const testForm = data => {
  const { chapters } = formConfig;
  startForm();

  let pathsVisited = [];
  Object.values(chapters).forEach(chapter => {
    Object.values(chapter.pages).forEach(page => {
      if (pathsVisited.includes(page.path)) return;
      if (page.path.includes(':index')) {
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

describe('Higher-Level Review keyboard only navigation', () => {
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
  context('Kitchen sink', () => {
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
});
