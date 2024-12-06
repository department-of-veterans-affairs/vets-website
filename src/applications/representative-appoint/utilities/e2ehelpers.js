export const ROOT = '/get-help-from-accredited-representative/appoint-rep';
export const START_LINK = 'introduction';

export const clickStart = () =>
  cy
    .get('.schemaform-start-button')
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

export const typeFirstName = text => {
  cy.get('input[name="root_veteranFullName_first"]').type(text);
};
export const typeMiddleName = text => {
  cy.get('input[name="root_veteranFullName_middle"]').type(text);
};
export const typeLastName = text => {
  cy.get('input[name="root_veteranFullName_last"]').type(text);
};

export const selectMonth = month => {
  cy.get('va-select.usa-form-group--month-select')
    .shadow()
    .find('select')
    .select(month);
};
export const selectDay = day => {
  cy.get('input[name="root_veteranDateOfBirthDay"]').type(day);
};

export const selectYear = year => {
  cy.get('input[name="root_veteranDateOfBirthYear"]').type(year);
};

export const selectCountry = country => {
  cy.get('va-select[name="root_veteranHomeAddress_country"]')
    .shadow()
    .find('select')
    .select(country);
};

export const inputStreetAddress = streetAddress => {
  cy.get('input[name="root_veteranHomeAddress_street"]').type(streetAddress);
};
export const inputCity = city => {
  cy.get('input[name="root_veteranHomeAddress_city"]').type(city);
};

export const inputPostalCode = postalCode => {
  cy.get('input[name="root_veteranHomeAddress_postalCode"]').type(postalCode);
};

export const selectState = state => {
  cy.get('va-select[name="root_veteranHomeAddress_state"]')
    .shadow()
    .find('select')
    .select(state);
};
export const inputPhone = phone => {
  cy.get('input[name="root_Primary phone"]').type(phone);
};
export const inputSSN = ssn => {
  cy.get('input[name="root_veteranSocialSecurityNumber"]').type(ssn);
};

export const clickBack = () => cy.contains('button', 'Back').click();

export const clickContinue = () =>
  cy.findByRole('button', { name: /continue/i }).click();
