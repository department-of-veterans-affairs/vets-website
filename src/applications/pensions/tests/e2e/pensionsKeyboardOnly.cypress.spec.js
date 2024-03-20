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
import {
  kitchenSinkFixture,
  overflowFixture,
  simpleFixture,
} from './fixtures/data/vetsJsonSchemaFixtures';

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
  cy.wait(['@submitApplication', '@pollSubmission']);
  cy.url().should('include', '/confirmation');
};

describe('Higher-Level Review keyboard only navigation', () => {
  before(() => {
    cypressBeforeAllSetup();
  });
  it('keyboard navigates through a simple form', () => {
    cy.wrap(simpleFixture.data).as('testData');
    cypressSetup(cy);

    cy.get('@testData').then(data => {
      cy.injectAxeThenAxeCheck();

      testForm(data);
    });
  });
  it('keyboard navigates through a maximal form', () => {
    cy.wrap(kitchenSinkFixture.data).as('testData');
    cypressSetup(cy);

    cy.get('@testData').then(data => {
      cy.injectAxeThenAxeCheck();

      testForm(data);
    });
  });
  it('keyboard navigates through an overflow form', () => {
    cy.wrap(overflowFixture.data).as('testData');
    cypressSetup(cy);

    cy.get('@testData').then(data => {
      cy.injectAxeThenAxeCheck();

      testForm(data);
    });
  });
});
