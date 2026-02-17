import sessionStatus from '../fixtures/session/default.json';
import vamc from '../../fixtures/facilities/vamc-ehr.json';

class Allergies {
  setIntercepts = ({ allergiesData, useOhData = true } = {}) => {
    cy.intercept('POST', '/v0/datadog_action', {}).as('datadogAction');

    cy.intercept('POST', '/my_health/v1/medical_records/session', {}).as(
      'session',
    );
    cy.intercept('GET', '/my_health/v1/medical_records/session/status', req => {
      req.reply(sessionStatus);
    });

    cy.intercept('GET', '/data/cms/vamc-ehr.json', vamc).as('vamcEhr');

    cy.intercept('GET', '/my_health/v1/medical_records/allergies*', req => {
      if (useOhData) {
        expect(req.url).to.contain('use_oh_data_path=1');
      } else {
        expect(req.url).to.not.contain('use_oh_data_path=1');
      }
      req.reply(allergiesData);
    }).as('allergies-list');

    cy.intercept('GET', '/my_health/v2/medical_records/allergies*', req => {
      req.reply(allergiesData);
    }).as('allergies-list');
  };

  checkLandingPageLinks = () => {
    cy.get('[data-testid="allergies-landing-page-link"]').should('be.visible');
  };

  goToAllergiesPage = () => {
    cy.findByTestId('allergies-landing-page-link').scrollIntoView();
    cy.findByTestId('allergies-landing-page-link').click({ force: true });
    cy.wait('@allergies-list');
    // Wait for page to load
    cy.get('h1').should('be.visible').and('be.focused');
  };

  selectAllergy = ({ index = 0 } = {}) => {
    cy.get('[data-testid="record-list-item"]')
      .eq(index)
      .find('a')
      .first()
      .click({ waitForAnimations: true });
  };

  checkUnifiedAllergyListItem = ({ index = 0 } = {}) => {
    cy.get('[data-testid="record-list-item"]')
      .eq(index)
      .should('be.visible')
      .within(() => {
        cy.get('a').should('be.visible');
        cy.contains('Date entered:').should('be.visible');
      });
  };

  validateAllergyDetailPage = () => {
    cy.url().should('include', '/allergies/');
    cy.get('h1').should('be.visible');
    cy.contains('Date entered:').should('be.visible');
  };

  // Helper methods for list page assertions
  verifyListItemName = ({ index = 0, name } = {}) => {
    cy.get('[data-testid="record-list-item"]')
      .eq(index)
      .within(() => {
        cy.get('a').should('contain', name);
        cy.contains('Date entered:').should('be.visible');
      });
  };

  verifyFirstListItem = () => {
    cy.get('[data-testid="record-list-item"]')
      .first()
      .within(() => {
        cy.get('a').should('be.visible');
        cy.contains('Date entered:').should('be.visible');
      });
  };

  // Helper methods for detail page assertions
  verifyDetailPageHeader = name => {
    cy.url().should('include', '/allergies/');
    cy.get('h1').should('contain', name);
  };

  verifyDetailPageContent = (expectedContent = []) => {
    expectedContent.forEach(content => {
      cy.contains(content).should('be.visible');
    });
  };

  verifyV2UnifiedFormat = () => {
    cy.contains('Medication').should('be.visible');
  };

  verifyVistaFormat = () => {
    cy.get('[data-testid="allergy-type"]').should('exist');
  };

  verifyOHFormat = () => {
    cy.contains('Date entered').should('be.visible');
    cy.get('h1').should('exist');
  };
}

export default new Allergies();
