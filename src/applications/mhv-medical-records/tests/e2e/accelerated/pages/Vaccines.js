import sessionStatus from '../fixtures/session/default.json';
import MedicalRecordsLandingPage from '../../pages/MedicalRecordsLandingPage';

class Vaccines {
  setIntercepts = ({ vaccinesData }) => {
    cy.intercept('POST', '/v0/datadog_action', {}).as('datadogAction');
    cy.intercept('POST', '/my_health/v1/medical_records/session', {}).as(
      'session',
    );
    cy.intercept('GET', '/my_health/v1/medical_records/session/status', req => {
      req.reply(sessionStatus);
    });
    cy.intercept('GET', '/my_health/v2/medical_records/immunization*', req => {
      req.reply(vaccinesData);
    }).as('vaccines-list');
    MedicalRecordsLandingPage.uumIntercept();
  };

  setDetailIntercepts = ({ vaccineDetailData, vaccineId }) => {
    cy.intercept('POST', '/my_health/v1/medical_records/session', {}).as(
      'session',
    );
    cy.intercept('GET', '/my_health/v1/medical_records/session/status', req => {
      req.reply(sessionStatus);
    });
    cy.intercept(
      'GET',
      `/my_health/v2/medical_records/immunizations/${vaccineId}`,
      req => {
        req.reply(vaccineDetailData);
      },
    ).as('vaccine-detail');
  };

  goToVaccinesPage = () => {
    cy.get('[data-testid="vaccines-landing-page-link"]').as('vaccines-link');
    cy.get('@vaccines-link').should('be.visible');
    cy.get('@vaccines-link').click();
  };

  clickVaccineDetailsLink = (vaccineIndex = 0) => {
    cy.findAllByTestId('record-list-item')
      .eq(vaccineIndex)
      .find('a')
      .click();
  };

  // Vaccine details page verification methods
  verifyVaccineName = expectedName => {
    cy.get('[data-testid="vaccine-name"]').should('contain', expectedName);
  };

  verifyVaccineDate = expectedDate => {
    cy.get('[data-testid="header-time"]').should('contain', expectedDate);
  };

  verifyVaccineLocation = expectedLocation => {
    cy.get('[data-testid="vaccine-provider"]').should(
      'contain',
      expectedLocation,
    );
  };

  verifyVaccineManufacturer = expectedManufacturer => {
    cy.get('[data-testid="vaccine-manufacturer"]').should(
      'contain',
      expectedManufacturer,
    );
  };

  verifyVaccineReaction = expectedReaction => {
    cy.get('[data-testid="vaccine-reactions"]').should(
      'contain',
      expectedReaction,
    );
  };

  verifyVaccineNotes = expectedNotes => {
    cy.get('[data-testid="vaccine-notes"]').should('contain', expectedNotes);
  };

  verifyVaccineShortDescription = expectedShortDescription => {
    cy.get('[data-testid="vaccine-description"]').should(
      'contain',
      expectedShortDescription,
    );
  };

  viewNextPage = () => {
    cy.get(
      'nav > ul > li.usa-pagination__item.usa-pagination__arrow > a',
    ).click();
  };
}

export default new Vaccines();
