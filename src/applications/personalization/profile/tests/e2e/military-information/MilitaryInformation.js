import { PROFILE_PATHS } from '@@profile/constants';

class MilitaryInformationPage {
  visitMilitaryInformationPage = () => {
    cy.visit(PROFILE_PATHS.MILITARY_INFORMATION);
  };

  visitPersonalInformationPage = () => {
    cy.visit(PROFILE_PATHS.PERSONAL_INFORMATION);
  };

  visitContactInformationPage = () => {
    cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);
  };

  heroErrorMessageShouldNotExist = () => {
    cy.get('[data-testid="not-all-data-available-error"]').should('not.exist');
  };

  serviceDownMessageShouldExist = () => {
    cy.get('[data-testid="service-is-down-banner"]').should('exist');
  };

  notAVeteranMessageShouldExist = () => {
    cy.findByTestId('not-a-veteran-alert').should('exist');
  };

  notInDeersMessageShouldExist = () => {
    cy.findByTestId('not-in-deers-alert').should('exist');
  };

  veteranStatusShouldExist = () => {
    cy.findByText(/Proof of Veteran status/).should('exist');
  };

  veteranStatusShouldNotExist = () => {
    cy.findByText(/Proof of Veteran status/).should('not.exist');
  };
}

export default new MilitaryInformationPage();
