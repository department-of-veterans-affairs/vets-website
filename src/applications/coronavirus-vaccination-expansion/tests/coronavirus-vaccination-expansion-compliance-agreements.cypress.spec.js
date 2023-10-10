describe('COVID-19 SAVE LIVES Act sign up', () => {
  describe('when leaving one checkbox unchecked', () => {
    before(() => {
      cy.visit('health-care/covid-19-vaccine/sign-up/');
      cy.injectAxe();
    });

    it('should throw a validation error', () => {
      cy.axeCheck();

      cy.intercept('GET', '/covid_vaccine/v0/facilities/20002', {
        statusCode: 200,
        body: {
          data: [
            {
              id: 'vha_688',
              type: 'vaccination_facility',
              attributes: {
                name: 'Washington DC VAMC',
                distance: 5.2,
                city: 'Washington',
                state: 'DC',
              },
            },
          ],
        },
      }).as('getWashingtonDCFacilities');

      cy.intercept('POST', '/covid_vaccine/v0/expanded_registration', {
        statusCode: 200,
        body: {},
      }).as('submitForm');

      cy.get('va-radio-option[label="No"]').click({
        force: true,
      });

      cy.get('button')
        .contains('Continue')
        .click();

      cy.get('label')
        .contains('CHAMPVA')
        .click({ force: true });

      cy.get('button')
        .contains('Continue')
        .click();

      cy.findByLabelText(/First name/i)
        .clear()
        .type('Ralph');

      cy.findByLabelText(/Last name/i)
        .clear()
        .type('Wiggum');

      cy.findByLabelText('Month').select('1');

      cy.findByLabelText('Day').select('1');

      cy.findByLabelText('Year').type('1984');

      cy.findByLabelText('Female').click();

      cy.findByLabelText(/Social Security number/i).type('111223332');

      cy.get('button')
        .contains('Continue')
        .click();

      cy.findByLabelText(/U.S. street address where you live now/i)
        .first()
        .type('123 Maple Ave');

      cy.findByLabelText(/U.S. city/i).type('Washington');

      cy.findByLabelText(/U.S. state or territory/i).select('DC');

      cy.findByLabelText(/Zip code/i).type('20002');

      cy.findByLabelText(/Phone number/i).type('202-555-1122');

      cy.get('button')
        .contains('Continue')
        .click();

      cy.wait('@getWashingtonDCFacilities');

      cy.get('va-radio-option')
        .first()
        .click();

      cy.get('button')
        .contains('Continue')
        .click();

      cy.get('h2').contains('Review your information');

      // Ensure link to Notice of Privacy Practices exists.
      cy.get('a#kif-privacy-policy')
        .should('have.attr', 'href')
        .and(
          'include',
          'https://www.va.gov/files/2022-10/10-163p_(004)_-Notices_of_Privacy_Practices-_PRINT_ONLY.pdf',
        );

      // When neither truthfulness or privacy statements are checked, two errors are thrown.
      cy.get('.usa-button-primary')
        .contains('Submit form')
        .click();

      cy.get('#truthfulness-checkbox')
        .shadow()
        .find('#checkbox-error-message')
        .contains(
          /You must certify that your submission is truthful before submitting/i,
        );

      cy.get('va-checkbox')
        .shadow()
        .find('#checkbox-error-message')
        .contains(
          /You must certify that you have access to VA's privacy practice information before submitting/i,
        );

      cy.get('#truthfulness-checkbox')
        .shadow()
        .find('input')
        .click();

      // When truthful statement is checked and privacy is not, correct error is thrown.
      cy.get('.usa-button-primary')
        .contains('Submit form')
        .click();

      cy.get('#privacy-practices-checkbox')
        .shadow()
        .find('#checkbox-error-message')
        .contains(
          /You must certify that you have access to VA's privacy practice information before submitting/i,
        );

      // Uncheck truthful statement and check privacy statement.
      cy.get('#truthfulness-checkbox')
        .shadow()
        .find('input')
        .click();
      cy.get('#privacy-practices-checkbox')
        .shadow()
        .find('input')
        .click();

      // When privacy statement is checked and truthfulness is not, correct error is thrown.
      cy.get('.usa-button-primary')
        .contains('Submit form')
        .click();

      cy.get('#truthfulness-checkbox')
        .shadow()
        .find('#checkbox-error-message')
        .contains(
          /You must certify that your submission is truthful before submitting/i,
        );

      // When both are checked, form submits.
      cy.get('#truthfulness-checkbox')
        .shadow()
        .find('input')
        .click();

      cy.get('.usa-button-primary')
        .contains('Submit form')
        .click();
      cy.wait('@submitForm');
      cy.get('h2')
        .first()
        .contains(/We've received your information/i);
    });
  });
});
