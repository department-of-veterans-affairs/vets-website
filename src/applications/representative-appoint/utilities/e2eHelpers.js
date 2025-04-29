export const ROOT = '/get-help-from-accredited-representative/appoint-rep';
export const START_LINK = 'introduction';

export const clickStartUnauth = () =>
  cy
    .get('.schemaform-start-button')
    .should('be.visible')
    .click();

export const clickStartAuth = () =>
  cy
    .get('a[href="#start"]')
    .eq(0)
    .should('be.visible')
    .click();

export const verifyUrl = link => cy.url().should('contain', `${ROOT}/${link}`);

export const selectRadio = (name, index) => {
  cy.get(`va-radio[name="root_${name}"]`)
    .should('exist')
    .find('va-radio-option')
    .eq(index)
    .click();
};
export const selectCheckbox = (name, index) => {
  cy.get(`va-checkbox-group[name="root_${name}"]`)
    .should('exist')
    .find('va-checkbox')
    .eq(index)
    .click();
};

export const clickBack = () => cy.contains('button', 'Back').click();

export const clickContinue = () =>
  cy.findByRole('button', { name: /continue/i }).click();
