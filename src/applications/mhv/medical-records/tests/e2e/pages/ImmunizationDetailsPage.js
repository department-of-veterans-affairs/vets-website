import moment from 'moment';
import defaultImmunizationDetail from '../fixtures/vaccines/vaccine-8261.json';

class ImmunizationsDetailsPage {
  verifyImmunizationName = (
    immunizationsDetails = defaultImmunizationDetail,
  ) => {
    cy.get('[data-testid="vaccine-name"]').contains(
      immunizationsDetails.vaccineCode.text,
    );
  };

  verifyImmunizationDate = (
    immunizationsDetails = defaultImmunizationDetail,
  ) => {
    cy.get('[data-testid="header-time"]').contains(
      moment(immunizationsDetails.occurrenceDateTime).format('MMMM D, YYYY'),
    );
  };

  verifyImmunizationLocation = (
    immunizationsDetails = defaultImmunizationDetail,
  ) => {
    cy.get('[data-testid="vaccine-location"]').contains(
      immunizationsDetails.contained[0].name,
    );
  };

  verifyImmunizationNotes = (
    immunizationsDetails = defaultImmunizationDetail,
    noteIndex = 0,
  ) => {
    cy.get('[data-testid="list-item"]')
      .eq(noteIndex)
      .contains(immunizationsDetails.note[noteIndex].text);
  };
}

export default new ImmunizationsDetailsPage();
