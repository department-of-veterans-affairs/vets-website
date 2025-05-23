import { PROFILE_PATHS } from '@@profile/constants';

class VeteranStatusCardPage {
  visitVeteranStatusCardPage = () => {
    cy.visit(PROFILE_PATHS.VETERAN_STATUS_CARD);
  };

  veteranStatusShouldExist = () => {
    cy.findByRole('heading', { name: /Veteran Status Card/i }).should('exist');
    cy.findByText('Name').should('exist');
    cy.findByText('Latest period of service').should('exist');
  };

  veteranStatusShouldNotExist = () => {
    cy.findByText('Name').should('not.exist');
    cy.findByText('Latest period of service').should('not.exist');
  };
}

export default new VeteranStatusCardPage();
