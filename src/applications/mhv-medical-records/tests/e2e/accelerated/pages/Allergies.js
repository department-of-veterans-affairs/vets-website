import sessionStatus from '../fixtures/session/default.json';

class Allergies {
  setIntercepts = ({ allergiesData, useOhData = true } = {}) => {
    cy.intercept('POST', '/my_health/v1/medical_records/session', {}).as(
      'session',
    );
    cy.intercept('GET', '/my_health/v1/medical_records/session/status', req => {
      req.reply(sessionStatus);
    });

    cy.intercept('GET', '/my_health/v1/medical_records/allergies*', req => {
      // check the correct param was used
      if (useOhData) {
        expect(req.url).to.contain('use_oh_data_path=1');
      } else {
        expect(req.url).to.not.contain('use_oh_data_path=1');
      }
      req.reply(allergiesData);
    }).as('allergies-list');
  };

  checkLandingPageLinks = () => {
    cy.get('[data-testid="labs-and-tests-oh-landing-page-link"]').should(
      'be.visible',
    );
    cy.get('[data-testid="summary-and-notes-oh-landing-page-link"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vaccines-oh-landing-page-link"]').should(
      'be.visible',
    );
    cy.get('[data-testid="health-conditions-oh-landing-page-link"]').should(
      'be.visible',
    );

    cy.get('[data-testid="vitals-oh-landing-page-link"]').should('be.visible');
  };

  goToAllergiesPage = () => {
    cy.get('[data-testid="allergies-landing-page-link"]')
      .should('be.visible')
      .click();
  };
}

export default new Allergies();
