import { medicationsUrls } from '../../../util/constants';

class MedicationsInProgressPage {
  visitPage = (apiVersion, fixture) => {
    cy.intercept('GET', `/my_health/${apiVersion}/prescriptions*`, fixture).as(
      'prescriptions',
    );
    cy.visit(medicationsUrls.MEDICATIONS_IN_PROGRESS);
  };

  visitPageWithError = (apiVersion, errorResponse) => {
    cy.intercept(
      'GET',
      `/my_health/${apiVersion}/prescriptions*`,
      errorResponse,
    ).as('prescriptionsError');
    cy.visit(medicationsUrls.MEDICATIONS_IN_PROGRESS);
  };

  verifyHeading = () => {
    cy.findByTestId('in-progress-medications-heading').should(
      'have.text',
      'In-progress medications',
    );
  };

  verifyProcessListSteps = () => {
    cy.findByText('Request submitted').should('exist');
    cy.findByText('Fill in progress').should('exist');
    cy.findByText('Medication shipped').should('exist');
  };

  verifySubmittedPrescription = name => {
    cy.findByTestId('submitted-prescriptions').within(() => {
      cy.findByRole('link', { name }).should('exist');
    });
  };

  verifyInProgressPrescription = name => {
    cy.findByTestId('in-progress-prescriptions').within(() => {
      cy.findByRole('link', { name }).should('exist');
    });
  };

  verifyShippedPrescription = name => {
    cy.findByTestId('shipped-prescriptions').within(() => {
      cy.findByRole('link', { name }).should('exist');
    });
  };

  verifyPrescriptionNotInList = name => {
    cy.findByRole('link', { name }).should('not.exist');
  };

  verifyNeedHelpSection = () => {
    cy.findByTestId('rx-need-help-container').should('exist');
  };

  verifyApiErrorNotification = () => {
    cy.findByTestId('api-error-notification').should('exist');
    cy.findByTestId('no-medications-list').should('exist');
  };
}

export default MedicationsInProgressPage;
