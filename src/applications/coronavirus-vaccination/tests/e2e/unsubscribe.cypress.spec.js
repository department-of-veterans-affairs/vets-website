import featureTogglesEnabled from './fixtures/toggle-covid-feature.json';

describe('COVID-19 Vaccination Preparation Form', () => {
  it('should successfully unsubscribe the user', () => {
    cy.server();
    cy.route('PUT', '**/covid_vaccine/v0/registration/opt_out**', {
      status: 200,
    });
    cy.route('GET', '/v0/feature_toggles*', featureTogglesEnabled).as(
      'feature',
    );
    cy.visit(
      'health-care/covid-19-vaccine/stay-informed/unsubscribe?sid=12345',
    );
    cy.injectAxe();

    cy.get('#covid-vaccination-heading-unsubscribe').contains('Unsubscribe');
    cy.get('.va-introtext').contains(
      "You've unsubscribed from COVID-19 vaccine updates. We won't send you any more emails.",
    );
    cy.server({ enable: false });
  });
});
