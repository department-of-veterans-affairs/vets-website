import {
  chooseFirstRadioIfUnknown,
  chooseVaRadioByValue,
  clickContinue,
  expandAccordion,
  expectPath,
  fillNewConditionAutocomplete,
  fillNewConditionDate,
  selectSideOfBody,
  waitForOneOfPaths,
} from './cypressHelpers';

// Page 0 (intro): visit, verify, click start
export const startApplication = () => {
  cy.visit('/user-testing/conditions/');
  cy.get('body').should('have.attr', 'data-location', 'introduction');
  cy.contains(
    'a.schemaform-start-button',
    /Start your application without signing in/i,
  )
    .should('be.visible')
    .click();
};

// Page 1 (conditions intro): verify + Continue
export const conditionsInfo = () => {
  expectPath('/user-testing/conditions/conditions-mango-intro', '');
  cy.get('body').should('have.attr', 'data-location', 'conditions-mango-intro');
  cy.contains('h3', /Add your disabilities and conditions/i).should(
    'be.visible',
  );
  cy.get('#nav-form-header')
    .should('have.attr', 'current', '1')
    .and('have.attr', 'total', '2');
  clickContinue();
};

export const addCondition = (index = 0) => {
  const base = `/user-testing/conditions/conditions-mango/${index}`;
  cy.location('pathname').should('eq', `${base}/condition`);
  cy.location('search').should('eq', '?add=true');
  cy.contains('h3', /^Add a condition$/i).should('be.visible');
};

// Page 2 (condition type): choose first radio (or change if needed) + Continue
export const chooseConditionType = (index = 0) => {
  const BASE = `/user-testing/conditions/conditions-mango/${index}`;
  expectPath(`${BASE}/condition`, '?add=true');
  chooseFirstRadioIfUnknown();
  clickContinue();
};

// Page 3 (autocomplete condition): type + Continue
export const enterNewCondition = (
  index = 0,
  conditionText = 'ankle sprain',
) => {
  const BASE = `/user-testing/conditions/conditions-mango/${index}`;
  expectPath(`${BASE}/new-condition`, '?add=true');
  fillNewConditionAutocomplete(conditionText);
  clickContinue();
};

// Pages 4–5 (optional side-of-body) then date
export const sideOfBodyThenDate = (
  index = 0,
  dateYyyyMmDd = '2022-06-15',
  sideIfShown = 'LEFT',
) => {
  const BASE = `/user-testing/conditions/conditions-mango/${index}`;
  const SIDE_PATH = `${BASE}/side-of-body`;
  const DATE_PATH = `${BASE}/new-condition-date`;

  waitForOneOfPaths([SIDE_PATH, DATE_PATH], '?add=true');

  cy.location('pathname').then(path => {
    if (path === SIDE_PATH) {
      selectSideOfBody(sideIfShown);
      clickContinue();
      expectPath(DATE_PATH, '?add=true');
      fillNewConditionDate(dateYyyyMmDd);
      clickContinue();
    } else if (path === DATE_PATH) {
      fillNewConditionDate(dateYyyyMmDd);
      clickContinue();
    } else {
      throw new Error(`Unexpected path after autocomplete: ${path}`);
    }
  });
};

// Page 6 (cause): choose first radio + Continue
export const chooseCause = (index = 0) => {
  const BASE = `/user-testing/conditions/conditions-mango/${index}`;
  expectPath(`${BASE}/cause`, '?add=true');
  chooseFirstRadioIfUnknown();
  clickContinue();
};

// Page 7 (cause NEW details): enter details + Continue
export const enterCauseNewDetails = (
  index = 0,
  details = 'Condition started in 2022 after training—no prior history.',
) => {
  const BASE = `/user-testing/conditions/conditions-mango/${index}`;
  expectPath(`${BASE}/cause-new`, '?add=true');

  // Wait for the specific textarea to be ready before typing
  cy.get('va-textarea', { includeShadowDom: true })
    .shadow()
    .find('textarea')
    .clear()
    .type(details, { force: true });

  clickContinue();
};

// Page 8 (summary): verify, choose No for add another, Continue
export const finishSummaryNoMore = (expectSnippet = /ankle/i) => {
  expectPath('/user-testing/conditions/conditions-mango-summary', '');
  cy.contains(/Review your conditions/i).should('exist');
  cy.contains(expectSnippet).should('exist'); // confirm condition appears
  chooseVaRadioByValue('root_view:hasConditions', 'N');
  clickContinue();
};

// Page 9 (review & submit): verify, expand accordion
export const reviewAndExpand = () => {
  expectPath('/user-testing/conditions/review-and-submit', '');
  cy.contains(/review application/i).should('exist');
  // If your expand helper takes an index, keep it; otherwise a simple click is okay
  expandAccordion(0);
};

// Choose "Yes" on the summary to add another condition, then Continue
export const finishSummaryAddMore = () => {
  expectPath('/user-testing/conditions/conditions-mango-summary', '');
  cy.contains(/Review your conditions/i).should('exist');
  chooseVaRadioByValue('root_view:hasConditions', 'Y');
  clickContinue();
};

// Add a rated disability at the given index (skips side-of-body & cause)
export const addRatedDisability = (index, dateYyyyMmDd = '2021-08-20') => {
  const BASE = `/user-testing/conditions/conditions-mango/${index}`;
  // Page 2 — pick “rated disability” radio option (you’re already on /{index}/condition?add=true)
  expectPath(`${BASE}/condition`, '?add=true');
  // This picks the 2nd option (first rated item) — adjust if your list changes
  cy.get('va-radio-option')
    .eq(1)
    .within(() => {
      cy.get('input[type="radio"]').check({ force: true });
    });
  clickContinue();

  // Goes straight to rated disability date
  expectPath(`${BASE}/rated-disability-date`, '?add=true');
  fillNewConditionDate(dateYyyyMmDd);
  clickContinue();

  // Back to the summary
  expectPath('/user-testing/conditions/conditions-mango-summary', '');
};
