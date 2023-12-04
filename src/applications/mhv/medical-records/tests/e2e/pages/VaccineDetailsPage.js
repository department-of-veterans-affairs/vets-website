import moment from 'moment';
import defaultVaccineDetail from '../fixtures/vaccines/vaccine-8261.json';

class VaccinesDetailsPage {
  verifyVaccineName = (VaccinesDetails = defaultVaccineDetail) => {
    cy.get('[data-testid="vaccine-name"]').contains(
      VaccinesDetails.vaccineCode.text,
    );
  };

  verifyVaccineDate = (VaccinesDetails = defaultVaccineDetail) => {
    cy.get('[data-testid="header-time"]').contains(
      moment(VaccinesDetails.occurrenceDateTime).format('MMMM D, YYYY'),
    );
  };

  verifyVaccineLocation = (VaccinesDetails = defaultVaccineDetail) => {
    cy.get('[data-testid="vaccine-location"]').contains(
      VaccinesDetails.contained[0].name,
    );
  };

  verifyVaccineNotes = (
    VaccinesDetails = defaultVaccineDetail,
    noteIndex = 0,
  ) => {
    if (VaccinesDetails.note.length === 1) {
      cy.get('[data-testid="list-item-single"]')
        .eq(noteIndex)
        .contains(VaccinesDetails.note[noteIndex].text);
    }

    if (VaccinesDetails.note.length > 1) {
      cy.get('[data-testid="list-item-multiple"]')
        .eq(noteIndex)
        .contains(VaccinesDetails.note[noteIndex].text);
    }
  };
}

export default new VaccinesDetailsPage();
