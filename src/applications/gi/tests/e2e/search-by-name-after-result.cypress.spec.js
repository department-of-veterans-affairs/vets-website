import data from '../data/calculator-constants.json';

describe('go bill CT Rearch By Name After Result', () => {
  beforeEach(() => {
    cy.intercept('GET', 'v1/gi/calculator_constants', {
      statusCode: 200,
      body: data,
    });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
    cy.visit('education/gi-bill-comparison-tool/');
    cy.get('[data-testid="ct-input"]').type('Texas');
    cy.get('[data-testid="search-btn"]').click();
  });
  it('should show reslut when user types School, employer, or training provider in the search input and hits Search button', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('[id="name-search-results-count"]').as('searchResults');
    cy.get('@searchResults').should('be.focused');
    cy.get('@searchResults').should(
      'contain',
      'Showing 183 search results for "Texas"',
    );
  });
  describe('Update tuition', () => {
    const updateTuition =
      'button[id="update-tuition,-housing,-and-monthly-benefit-estimates-accordion-button"]';
    const learMore =
      '[aria-label="Learn more about VA education and training programs"]';
    const giBillChapter = 'select[id="giBillChapter"]';
    const militaryStatus = 'select[id="militaryStatus"]';

    it('should show Update Tuition accordion not expanded and when user click on it, it should expanded', () => {
      cy.injectAxeThenAxeCheck();
      cy.get(updateTuition).should('not.have.attr', 'aria-expanded', 'true');
      cy.get(updateTuition).click();
      cy.get(updateTuition).should('have.attr', 'aria-expanded', 'true');
    });
    it('should show GI Bill benefit learn more link and a dropdown and also should show military status select dropdown', () => {
      cy.injectAxeThenAxeCheck();
      cy.get(updateTuition).click();
      cy.get(giBillChapter).should('exist');
      cy.get(giBillChapter).select('33b');
      cy.get(`${giBillChapter} > [class="vads-u-font-weight--bold"]`).should(
        'contain',
        'Fry Scholarship (Ch 33)',
      );
      cy.get(militaryStatus).should('exist');
      cy.get(militaryStatus).select('child');
      cy.get(`${militaryStatus} > [class="vads-u-font-weight--bold"]`).should(
        'contain',
        'Child',
      );
      cy.get(learMore).should('contain', 'Learn more');
    });
    it('should show popup about  GI Bill benefit when Learn more link is clicked and when x button click it should close modal', () => {
      cy.injectAxeThenAxeCheck();
      const modalAriaLabel =
        '[aria-label="Which GI Bill benefit do you want to use? modal"]';
      cy.get(updateTuition).click();
      cy.get(learMore).click();
      cy.get(`${modalAriaLabel} > div > div > div > h2`).should(
        'contain',
        'Which GI Bill benefit do you want to use?',
      );
      cy.get(`${modalAriaLabel} > div > button`).click();
      cy.get(`${modalAriaLabel} > div > div > div > h2`).should('not.exist');
    });
    it('should Cumulative Post-9/11 service select dropdown and learn more link and when link more is click popup should show', () => {
      cy.injectAxeThenAxeCheck();
      const learnMoreButton =
        'button[aria-label="Learn more about Cumulative Post-9/11 service"]';
      cy.get(updateTuition).click();
      cy.get(learnMoreButton).should('exist');
      cy.get('select[id="cumulativeService"]')
        .as('dropdownSelect')
        .should('exist');
      cy.get('@dropdownSelect').select('0.9');
      cy.get('@dropdownSelect').should('contain', '30 months: 90%');
      cy.get(learnMoreButton).click();
      cy.get(
        '[aria-label="Close Cumulative Post-9/11 service modal"] + div > div > h2',
      )
        .as('CloseModal')
        .should('contain', 'Cumulative Post-9/11 service');
      cy.get('[aria-label="Close Cumulative Post-9/11 service modal"]').click();
      cy.get('@CloseModal').should('not.exist');
    });
    it('should show classes in person question with learn more link and when links clicked popup should show', () => {
      cy.injectAxeThenAxeCheck();
      cy.get(updateTuition).click();
      cy.get('[data-testid="in-person-classes-?"]').should(
        'contain',
        'Will you be taking any classes in person?',
      );
      cy.get('[data-testid="in-person-classes-?"] > span > button').click();
      cy.get(
        '[aria-label="Close Your housing allowance is determined by where you take classes modal"] + div > div > h2',
      )
        .as('housingAllowance')
        .should(
          'contain',
          'Your housing allowance is determined by where you take classes',
        );
      cy.get(
        '[aria-label="Close Your housing allowance is determined by where you take classes modal"]',
      ).click();
      cy.get('@housingAllowance').should('not.exist');
    });
    it('should different  military status options based on the GI Bill benefit ', () => {
      cy.injectAxeThenAxeCheck();
      const CompletedAnEnlistment =
        '[aria-label="Completed an enlistment of (MGIB): modal"]';
      cy.get(updateTuition).click();
      cy.get(giBillChapter).select('33a');
      cy.get(militaryStatus)
        .find('option')
        .should('have.length', 3);
      cy.get('[id="spouseActiveDuty"]').should('not.exist');
      cy.get('[id="cumulativeService"]')
        .as('cumulativeService')
        .find('option')
        .should('have.length', 8);
      cy.get(giBillChapter).select('33b');
      cy.get(militaryStatus)
        .find('option')
        .should('have.length', 2);
      cy.get('[id="spouseActiveDuty"]').should('exist');
      cy.get('@cumulativeService').should('not.exist');
      cy.get(CompletedAnEnlistment).should('not.exist');
      cy.get('[id="enlistmentService"]').should('not.exist');
      cy.get(giBillChapter).select('30');
      cy.get(militaryStatus)
        .find('option')
        .should('have.length', 2);
      cy.get('[id="enlistmentService"]').should('exist');
      cy.get('[id="enlistmentService-dropdown"] button').click();
      cy.get(`${CompletedAnEnlistment}  h2`)
        .as('CompletedAnEnlistment')
        .should('contain', 'Completed an enlistment of (MGIB):');
      cy.get(`${CompletedAnEnlistment} button`).click();
      cy.get(CompletedAnEnlistment).should('not.exist');
      cy.get(giBillChapter).select('1606');
      cy.get(militaryStatus)
        .find('option')
        .should('have.length', 1);
      cy.get(CompletedAnEnlistment).should('not.exist');
      cy.get('[id="enlistmentService"]').should('not.exist');
      cy.get('[data-testid="to-apply-for-VR&E"]').should('not.exist');
      cy.get(giBillChapter).select('31');
      cy.get(militaryStatus)
        .find('option')
        .should('have.length', 1);
      cy.get('[data-testid="to-apply-for-VR&E"]').should(
        'contain',
        'To apply for VR&E benefits, please',
      );
      cy.get('[id="eligForPostGiBill"]').should('exist');
      cy.get('[id="numberOfDependents"]').should('exist');
      cy.get('select[id="eligForPostGiBill"]').select('yes');
      cy.get('[id="numberOfDependents"]').should('not.exist');
      cy.get(giBillChapter).select('35');
      cy.get(militaryStatus)
        .find('option')
        .should('have.length', 2);
      cy.get('[data-testid="to-apply-for-VR&E"]').should('not.exist');
      cy.get('[id="eligForPostGiBill"]').should('not.exist');
    });
    it('should not display Is your spouse currently on active duty? when military status is child', () => {
      cy.injectAxeThenAxeCheck();
      cy.get(updateTuition).click();
      cy.get(giBillChapter).select('35');
      cy.get(militaryStatus).select('spouse');
      cy.get('[id="spouseActiveDuty"]').should('exist');
      cy.get(militaryStatus).select('child');
      cy.get('[id="spouseActiveDuty"]').should('not.exist');
    });
  });
});
