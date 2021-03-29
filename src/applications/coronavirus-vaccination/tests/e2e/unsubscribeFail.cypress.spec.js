import featureTogglesEnabled from './fixtures/toggle-covid-feature.json';

describe('COVID-19 Vaccination Preparation Form', () => {
  it('should fail to unsubscribe the user', () => {
    cy.server();
    cy.route({
      method: 'PUT',
      url: '**/covid_vaccine/v0/registration/opt_out',
      status: 404,
    });
    cy.route('GET', '/v0/feature_toggles*', featureTogglesEnabled).as(
      'feature',
    );
    cy.visit(
      'health-care/covid-19-vaccine/stay-informed/unsubscribe?sid=00000',
    );
    cy.injectAxe();

    cy.get('#covid-vaccination-heading-unsubscribe').contains('Unsubscribe');
    cy.get('.va-introtext').contains(
      "We're sorry. We couldn't unsubscribe you from COVID-19 vaccine updates at this time. Please try again later.",
    );
    cy.server({ enable: false });
  });
});
