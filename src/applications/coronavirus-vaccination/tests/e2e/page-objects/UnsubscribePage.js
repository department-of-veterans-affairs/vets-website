import featureTogglesEnabled from '../fixtures/toggle-covid-feature.json';

class UnsubscribePage {
  loadPage(status, pageId) {
    let optOutRoute;
    if (status === 200) optOutRoute = '**';

    cy.intercept(
      'PUT',
      `**/covid_vaccine/v0/registration/opt_out${optOutRoute}`,
      { status },
    );

    cy.intercept('GET', '/v0/feature_toggles*', featureTogglesEnabled).as(
      'feature',
    );

    cy.visit(
      `health-care/covid-19-vaccine/stay-informed/unsubscribe?sid=${pageId}`,
    );
    cy.get('#covid-vaccination-heading-unsubscribe').contains('Unsubscribe');
  }

  confirmUnsubscription(status) {
    if (status === 'failed') {
      cy.get('.va-introtext').contains(
        "We're sorry. We couldn't unsubscribe you from COVID-19 vaccine updates at this time. Please try again later.",
      );
    } else {
      cy.get('.va-introtext').contains(
        "You've unsubscribed from COVID-19 vaccine updates. We won't send you any more emails.",
      );
    }
  }
}

export default UnsubscribePage;
