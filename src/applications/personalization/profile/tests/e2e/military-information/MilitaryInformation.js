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
}

export default new MilitaryInformationPage();
