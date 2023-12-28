import moment from 'moment';
import defaultVaccines from '../fixtures/vaccines/vaccines.json';

class VaccinesDetailsPage {
  verifyVaccineName = (VaccinesDetails = defaultVaccines.entry[0]) => {
    cy.get('[data-testid="vaccine-name"]').contains(
      VaccinesDetails.resource.vaccineCode.text,
    );
  };

  verifyVaccineDate = (VaccinesDetails = defaultVaccines.entry[0]) => {
    cy.get('[data-testid="header-time"]').contains(
      moment(VaccinesDetails.resource.occurrenceDateTime).format(
        'MMMM D, YYYY',
      ),
    );
  };

  verifyVaccineLocation = (VaccinesDetails = defaultVaccines.entry[0]) => {
    cy.get('[data-testid="vaccine-location"]').contains(
      VaccinesDetails.resource.contained[0].name,
    );
  };

  verifyVaccineNotes = (
    VaccinesDetails = defaultVaccines.entry[0],
    noteIndex = 0,
  ) => {
    if (VaccinesDetails.resource.note.length === 1) {
      cy.get('[data-testid="list-item-single"]')
        .eq(noteIndex)
        .contains(VaccinesDetails.note[noteIndex].text);
    }

    if (VaccinesDetails.resource.note.length > 1) {
      cy.get('[data-testid="list-item-multiple"]')
        .eq(noteIndex)
        .contains(VaccinesDetails.resource.note[noteIndex].text);
    }
  };
}

export default new VaccinesDetailsPage();
