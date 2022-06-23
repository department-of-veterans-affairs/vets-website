import {
  PROFILE_PATHS,
  PROFILE_PATHS_LGBTQ_ENHANCEMENT,
} from '@@profile/constants';

class MilitaryInformationPage {
  visitMilitaryInformationPage = () => {
    cy.visit(PROFILE_PATHS.MILITARY_INFORMATION);
  };

  visitPersonalInformationPage = () => {
    cy.visit(PROFILE_PATHS.PERSONAL_INFORMATION);
  };

  visitContactInformationPage = () => {
    cy.visit(PROFILE_PATHS_LGBTQ_ENHANCEMENT.CONTACT_INFORMATION);
  };

  heroErrorMessageShouldNotExist = () => {
    cy.get('[data-testid="not-all-data-available-error"]').should('not.exist');
  };

  serviceDownMessageShouldExist = () => {
    cy.get('[data-testid="service-is-down-banner"]').should('exist');
  };
}

export default new MilitaryInformationPage();
