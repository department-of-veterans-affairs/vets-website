import stub from '../../constants/stub.json';
import { FAF_SORT_OPTIONS } from '../../constants';
import * as h from './helpers';

describe('find forms search results', () => {
  it('should properly display search results', () => {
    cy.intercept('GET', '/v0/forms?query=health', stub).as('getFindAForm');
    cy.visit('/find-forms/');

    // Wait for page to fully load before proceeding
    h.waitForPageToLoad();

    cy.injectAxeThenAxeCheck();

    h.typeSearchTerm('health');
    h.clickSearch();

    cy.wait('@getFindAForm');
    h.verifyElementExists(h.SEARCH_RESULT_TITLE);

    h.validateSearchResult(
      '10-252',
      'Authorization to Release Protected Health Information to State/Local Public Health Authorities',
      'November 2020',
      'Health care, Records',
      0,
      true,
    );

    h.goToNextPage();

    h.validateSearchResult(
      '10-0137',
      'VA Advance Directive: Durable Power of Attorney for Health Care and Living Will',
      'July 2020',
      'Health care',
      1,
      true,
    );

    h.goToPrevPage();

    h.validateSearchResult(
      '10-10EZ',
      'Instructions and Enrollment Application for Health Benefits',
      'January 2020',
      'Health care',
      7,
      true,
      'Fill out VA Form 10-10EZ online',
    );

    // Ensure Sort Widget exists
    cy.get(`${h.SORT_SELECT_WIDGET}`);
    cy.get(`${h.SORT_SELECT_WIDGET}`)
      .shadow()
      .get(`option`)
      // Finds both the shadow DOM option and the React Fiber option, so have to multiply 'expected' by 2,
      // and plus 1 due to the DST component adding a default select option to the dropdown
      .should('have.length', FAF_SORT_OPTIONS.length * 2 + 1);
    cy.get(`${h.SORT_SELECT_WIDGET}`)
      .shadow()
      .get('option')
      .should('be.selected')
      .should('contain', FAF_SORT_OPTIONS[0]);
  });

  it('shows proper no results messaging for non-DD214 searches', () => {
    cy.intercept('GET', '/v0/forms?query=invalid', { data: [] }).as(
      'getFindAForm',
    );
    cy.visit('/find-forms/?q=invalid');

    // Wait for page to fully load before proceeding
    h.waitForPageToLoad();

    cy.injectAxeThenAxeCheck();
    cy.wait('@getFindAForm');

    h.verifyElementShouldContainText(
      h.NO_RESULTS,
      `No results were found for "invalid." Try using fewer words or broadening your search. If you’re looking for non-VA forms, go to the .`,
    );

    h.verifyElementDoesNotExist(h.NO_RESULTS_DD214);
  });

  it('shows proper no results messaging for DD214', () => {
    cy.intercept('GET', '/v0/forms?query=dd214', { data: [] }).as(
      'getFindAForm',
    );
    cy.visit('/find-forms/?q=dd214');

    // Wait for page to fully load before proceeding
    h.waitForPageToLoad();

    cy.injectAxeThenAxeCheck();
    cy.wait('@getFindAForm');

    h.verifyElementShouldContainText(
      h.NO_RESULTS,
      `No results were found for "dd214." Try using fewer words or broadening your search. If you’re looking for non-VA forms, go to the .`,
    );

    h.verifyTextInsideLink(
      h.NO_RESULTS_DD214,
      'Need to request your military records including DD214?',
    );
  });

  it('opens PDF modal', () => {
    cy.intercept('GET', '/v0/forms?query=health', { data: [stub.data[0]] }).as(
      'getFindAForm',
    );

    cy.visit('/find-forms/?q=health');

    // Wait for page to fully load before proceeding
    h.waitForPageToLoad();

    cy.injectAxeThenAxeCheck();
    cy.get('button[data-testid^="pdf-link"]', { timeout: 15000 })
      .eq(0)
      .click({ force: true });

    const modal = () => cy.get(h.MODAL, { timeout: 25000 });

    modal()
      .scrollIntoView()
      .within(() => {
        cy.get('va-link[external]')
          .should('have.attr', 'text', 'Get Acrobat Reader for free from Adobe')
          .should('have.attr', 'href', 'https://get.adobe.com/reader/');

        cy.get('va-link[download]')
          .should('have.attr', 'filetype', 'PDF')
          .should('have.attr', 'text', 'Download VA Form 10-252')
          .should(
            'have.attr',
            'href',
            'https://www.va.gov/vaforms/medical/pdf/10-252%20Authorization%20To%20Release%20Protected%20Health%20Information%20To%20State%20Local%20Public%20Authorities.pdf',
          );

        cy.get(h.MODAL_CLOSE_BUTTON).click();
      });

    cy.get(h.MODAL).should('not.be.visible');

    cy.injectAxeThenAxeCheck();
  });
});
