import chunk from 'lodash/chunk';
import stub from '../../constants/stub.json';
import { FAF_SORT_OPTIONS } from '../../constants';
import * as h from './helpers';

describe('find forms search results', () => {
  it.only('should properly display search results', () => {
    cy.intercept('GET', '/v0/forms?query=health', stub).as('getFindAForm');
    cy.visit('/find-forms/');
    cy.injectAxeThenAxeCheck();

    h.typeSearchTerm('health');
    h.clickSearch();

    cy.wait('@getFindAForm');
    cy.get(h.SEARCH_RESULT_TITLE).should('exist');

    // iterate through all pages and ensure each form download link is present on each form result.
    // const validForms = stub.data.filter(form => form.attributes.validPdf);

    // const pageLength = 10;
    // const pages = chunk(validForms, pageLength);

    // console.log('pages: ', pages);

    // pages.forEach((page, pageNumber) => {
      // page.forEach(form => {
      //   cy.get(`button[data-testid="pdf-link-${form.id}"]`)
      //     .scrollIntoView()
      //     .should('exist');
      // });

      // const nextPage = pageNumber + 1;
      // console.log('nextPage: ', nextPage);
      // console.log('pages.length: ', pages.length);
      // const hasNextPage = nextPage < pages.length;

      // console.log('hasNextPage: ', hasNextPage);
      // console.log('next page:', cy.get(h.NEXT_PAGE));
      // console.log('nextPage: ', nextPage);

      // if (hasNextPage) {
      //   cy.get('va-pagination')
      //     .scrollIntoView()
      //     .shadow()
      //     .findByText(/Next/i)
      //     .click();
        // h.goToNextPage().then(() => cy.axeCheck());
      // }
    });

    // Ensure Sort Widget exists
    // cy.get(`${h.SORT_SELECT_WIDGET}`);
    // cy.get(`${h.SORT_SELECT_WIDGET}`)
    //   .shadow()
    //   .get(`option`)
    //   // Finds both the shadow DOM option and the React Fiber option, so have to multiply 'expected' by 2,
    //   // and plus 1 due to the DST component adding a default select option to the dropdown
    //   .should('have.length', FAF_SORT_OPTIONS.length * 2 + 1);
    // cy.get(`${h.SORT_SELECT_WIDGET}`)
    //   .shadow()
    //   .get('option')
    //   .should('be.selected')
    //   .should('contain', FAF_SORT_OPTIONS[0]);
  });

  // it('opens PDF modal', () => {
  //   cy.intercept('GET', '/v0/forms?query=health', { data: [stub.data[0]] }).as(
  //     'getFindAForm',
  //   );

  //   cy.visit('/find-forms/?q=health');
  //   cy.injectAxeThenAxeCheck();
  //   cy.get('button[data-testid^="pdf-link"]').eq(0)
  //       .click({ force: true });
  //   });

  //   const modal = () => cy.get(h.MODAL, { timeout: 25000 });

  //   modal()
  //     .scrollIntoView()
  //     .within(() => {
  //       cy.get(h.ADOBE_LINK)
  //         .should('contain.text', 'Get Acrobat Reader for free from Adobe')
  //         .should('have.attr', 'href')
  //         .and('include', 'https://get.adobe.com/reader/');

  //       cy.get(h.MODAL_DOWNLOAD_LINK)
  //         .should('contain.text', 'Download VA Form 10-252')
  //         .should('have.attr', 'href')
  //         .and(
  //           'include',
  //           'https://www.va.gov/vaforms/medical/pdf/10-252%20Authorization%20To%20Release%20Protected%20Health%20Information%20To%20State%20Local%20Public%20Authorities.pdf',
  //         );

  //       cy.get(h.MODAL_CLOSE_BUTTON).click();
  //     });

  //   cy.get(h.MODAL).should('not.be.visible');

  //   cy.injectAxe();
  //   cy.axeCheck();
  // });
});
