const container = '[data-testid="rs-container"]';

export const verifyText = (selector, expectedValue, index = 0) =>
  cy
    .get(container)
    .find(selector)
    .eq(index)
    .should('be.visible')
    .should('have.text', expectedValue);

export const verifyShadowText = (wc, expectedValue, index = 0) =>
  cy
    .get(wc)
    .eq(index)
    .shadow()
    .find('a')
    .should('be.visible')
    .should('have.text', expectedValue);

export const verifyElement = (selector, index = 0) =>
  cy
    .get(container)
    .find(selector)
    .eq(index)
    .should('be.visible');

export const verifyUrl = linkUrl => cy.url().should('contain', linkUrl);

export const clearInput = selector =>
  cy
    .get(selector)
    .shadow()
    .get('input')
    .first()
    .focus()
    .clear();

export const verifyResult = (
  selector,
  category,
  linkText,
  summary,
  index = 0,
) => {
  cy.get(container)
    .find('ul li')
    .eq(index)
    .should('exist')
    .within(() => {
      cy.get(`[id="${selector}"]`)
        .should('be.visible')
        .should('have.text', `Article type: ${category}`);

      verifyShadowText('va-link', linkText);

      cy.get('p')
        .should('be.visible')
        .should('have.text', summary);

      cy.get('va-link')
        .should('have.attr', 'href')
        .and('include', selector);
    });
};

export const expandSearchMenu = () => cy.get('va-icon[icon="add"]').click();

export const closeSearchMenu = () => cy.get('va-icon[icon="remove"]').click();

export const verifyElementNotVisible = selector =>
  cy.get(selector).should('not.be.visible');

export const typeInInput = (selector, value) =>
  cy
    .get(selector)
    .shadow()
    .get('input')
    .first()
    .click()
    .type(value, { force: true });

export const goToNextPage = () => {
  cy.get('va-pagination')
    .should('exist')
    .scrollIntoView();

  cy.get('va-pagination')
    .shadow()
    .get('.usa-pagination__item')
    .eq(1)
    .click();
};

export const clickSitewideRadio = () => {
  cy.get('va-radio')
    .should('exist')
    .scrollIntoView();

  cy.get('va-radio')
    .shadow()
    .get('va-radio-option')
    .eq(1)
    .click();
};

export const verifySearchInputsExist = () => {
  verifyElement('va-radio');
  verifyText('va-radio-option', 'Resources and Support', 0);
  verifyText('va-radio-option', 'All VA.gov', 1);
  verifyElement('va-search-input');
};

export const verifySearchInputsDoNotExist = () => {
  verifyElementNotVisible('va-radio');
  verifyElementNotVisible('va-radio-option');
  verifyElementNotVisible('va-search-input');
};
