import chunk from 'lodash/chunk';
import { FAF_SORT_OPTIONS } from '../../constants';
import stub from '../../constants/stub.json';
import { SELECTORS as s } from './helpers';

describe('functionality of Find Forms', () => {
  it('search the form and expect dom to have elements', () => {
    cy.intercept('GET', '/v0/forms?query=health', stub).as('getFindAForm');
    cy.visit('/find-forms/');
    cy.get(s.APP);

    cy.get(s.FINDFORM_INPUT_ROOT)
      .shadow()
      .find('input')
      .scrollIntoView()
      .clear()
      .focus()
      .type('health', { force: true })
      .should('not.be.disabled');

    cy.get(s.FINDFORM_INPUT_ROOT)
      .shadow()
      .find('button')
      .should('exist')
      .click();

    cy.wait('@getFindAForm');

    cy.get(`${s.SEARCH_RESULT_TITLE}`).should('exist');

    cy.injectAxe();
    cy.axeCheck();

    // iterate through all pages and ensure each form download link is present on each form result.
    const validForms = stub.data.filter(form => form.attributes.validPdf);

    const pageLength = 10;
    const pages = chunk(validForms, pageLength);

    pages.forEach((page, pageNumber) => {
      page.forEach(form => {
        cy.get(`button[data-testid="pdf-link-${form.id}"]`).should('exist');
      });

      const nextPage = pageNumber + 1;
      const hasNextPage = nextPage < pages.length;

      if (hasNextPage) {
        cy.get(s.NEXT_PAGE)
          .click()
          .then(() => cy.axeCheck());
      }
    });

    // Ensure Sort Widget exists
    cy.get(`${s.SORT_SELECT_WIDGET}`);
    cy.get(`${s.SORT_SELECT_WIDGET}`)
      .shadow()
      .get(`option`)
      // Finds both the shadow DOM option and the React Fiber option, so have to multiply 'expected' by 2,
      // and plus 1 due to the DST component adding a default select option to the dropdown
      .should('have.length', FAF_SORT_OPTIONS.length * 2 + 1);
    cy.get(`${s.SORT_SELECT_WIDGET}`)
      .shadow()
      .get('option')
      .should('be.selected')
      .should('contain', FAF_SORT_OPTIONS[0]);
  });

  it('opens PDF modal', () => {
    cy.intercept('GET', '/v0/forms?query=health', { data: [stub.data[0]] }).as(
      'getFindAForm',
    );

    cy.visit('/find-forms/?q=health');
    cy.get('button[data-testid^="pdf-link"]').then($links => {
      const randomIndex = Math.floor(Math.random() * $links.length);
      cy.wrap($links)
        .eq(randomIndex)
        .scrollIntoView()
        .click({ force: true });
    });

    const modal = () => cy.get(s.MODAL, { timeout: 25000 });

    modal()
      .scrollIntoView()
      .within(() => {
        cy.get(s.ADOBE_LINK)
          .should('contain.text', 'Get Acrobat Reader for free from Adobe')
          .should('have.attr', 'href')
          .and('include', 'https://get.adobe.com/reader/');

        cy.get(s.MODAL_DOWNLOAD_LINK)
          .should('contain.text', 'Download VA Form 10-252')
          .should('have.attr', 'href')
          .and(
            'include',
            'https://www.va.gov/vaforms/medical/pdf/10-252%20Authorization%20To%20Release%20Protected%20Health%20Information%20To%20State%20Local%20Public%20Authorities.pdf',
          );

        cy.get(s.MODAL_CLOSE_BUTTON).click();
      });

    cy.get(s.MODAL).should('not.be.visible');

    cy.injectAxe();
    cy.axeCheck();
  });
});
