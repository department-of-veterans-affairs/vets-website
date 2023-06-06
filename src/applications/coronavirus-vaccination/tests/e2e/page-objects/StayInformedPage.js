class StayInformedPage {
  loadPage() {
    cy.visit('health-care/covid-19-vaccine/stay-informed/');
    cy.wait('@feature');
    cy.get('.vads-l-row').contains('What you should know about signing up');
    cy.injectAxe();
    cy.axeCheck();
  }

  checkAccordions(accordionBodies) {
    accordionBodies.forEach(accordionBody => {
      cy.get('va-accordion-item')
        .next()
        .get('button')
        .first()
        .type('{shift}');
      cy.get('div').contains(accordionBody);
    });
  }

  continueWithoutSigningIn(auth = false) {
    if (auth) {
      cy.get('.usa-button').contains('Sign in');
      cy.findByText('Continue without signing in', { selector: 'a' }).click();
    } else {
      cy.get('.usa-button').contains('Sign up now');
      cy.findByText('Sign up now', { selector: 'a' }).click();
    }
    cy.url().should(
      'include',
      '/health-care/covid-19-vaccine/stay-informed/form',
    );
    cy.get('#covid-vaccination-heading-form').contains(
      'Sign up for vaccine updates',
    );
  }

  sameZipCode(sameZipCode) {
    cy.get('#root_locationDetails-label').contains(
      'Will you be in this zip code for the next 6 to 12 months?',
    );
    // eslint-disable-next-line no-unused-expressions
    sameZipCode
      ? cy.get(`#root_locationDetails_0`).check()
      : cy.get(`#root_locationDetails_1`).check();
  }

  vaccineInterest(interestedInVaccine) {
    cy.get('#root_vaccineInterest-label').contains(
      'Do you plan to get a COVID-19 vaccine when one is available to you?',
    );
    // eslint-disable-next-line no-unused-expressions
    interestedInVaccine
      ? cy.get('#root_vaccineInterest_0').check()
      : cy.get('#root_vaccineInterest_1').check();
  }

  fillForm(fields) {
    fields.forEach(field => {
      // eslint-disable-next-line no-unused-expressions
      field.clear
        ? cy
            .findByLabelText(field.field)
            .clear()
            .type(field.value)
        : cy.findByLabelText(field.field).select(field.value);
    });
  }

  submitForm() {
    cy.intercept('POST', '**/covid_vaccine/v0/registration', {
      status: 200,
    }).as('response');

    cy.get('.usa-button')
      .contains('Submit form')
      .click();

    cy.wait('@response');

    // Confirmation page
    cy.url().should(
      'include',
      '/health-care/covid-19-vaccine/stay-informed/confirmation',
    );

    cy.get('#covid-vaccination-heading-confirmation').contains(
      "We've received your information",
    );
  }

  validateSubmission() {
    cy.get('.vads-l-row').contains(
      'Thank you for signing up to stay informed about COVID-19 vaccines at VA',
    );
  }

  checkForHelpInfo() {
    cy.get('.help-talk').contains(
      'If you have questions or need help filling out this form, call our MyVA411 main information line at 800-698-2411 (TTY: 711).',
    );
  }
}

export default StayInformedPage;
