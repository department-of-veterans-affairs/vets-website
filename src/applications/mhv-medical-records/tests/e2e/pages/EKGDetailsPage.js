// import Utilities from './Utilities';
// import DetailsPage from './DetailsPage';
import BaseDetailsPage from './BaseDetailsPage';

class EKGDetailsPage extends BaseDetailsPage {
  verifyTitle = recordName => {
    cy.get('[data-testid="ekg-record-name"]').should('be.visible');
    cy.get('[data-testid="ekg-record-name"]').contains(recordName);
  };

  verifyDate = date => {
    // In need of future revision:
    // See moment function in verifyVaccineDate() in VaccineDetailsPage.js
    cy.get('[data-testid="header-time"]').contains(date);
  };

  verifyOrderingLocation = facility => {
    cy.get('[data-testid="ekg-record-facility"]').contains(facility);
  };

  verifyResults = () => {
    cy.get('[data-testid="ekg-results"]').contains(
      'Your EKG results aren’t available in this tool. To get your EKG',
    );
    cy.get('[data-testid="ekg-results"]').contains(
      'results, you can request a copy of your complete medical record from',
    );
    cy.get('[data-testid="ekg-results"]').contains('your VA health facility.');
  };
}

export default new EKGDetailsPage();
