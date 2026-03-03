import { medicationsUrls } from '../../../util/constants';

class MedicationsInProgressPage {
  visitPage = () => {
    cy.visit(medicationsUrls.MEDICATIONS_IN_PROGRESS);
  };

  verifyHeading = () => {
    cy.findByTestId('in-progress-medications-heading').should(
      'have.text',
      'In-progress medications',
    );
  };
}

export default MedicationsInProgressPage;
