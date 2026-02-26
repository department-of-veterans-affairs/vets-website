import { medicationsUrls } from '../../../util/constants';

class MedicationsHistoryPage {
  visitPage = () => {
    cy.visit(medicationsUrls.MEDICATIONS_HISTORY);
  };

  verifyHeading = () => {
    cy.findByTestId('medication-history-heading').should(
      'have.text',
      'Medication history',
    );
  };
}

export default MedicationsHistoryPage;
