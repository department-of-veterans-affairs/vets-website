import defaultVaccines from '../fixtures/vaccines/vaccines.json';
import BaseDetailsPage from './BaseDetailsPage';
import {
  formatDateMonthDayCommaYear,
  formatDateYear,
} from '../../../util/dateHelpers';

class VaccinesDetailsPage extends BaseDetailsPage {
  verifyVaccineName = (VaccinesDetails = defaultVaccines.entry[0]) => {
    cy.get('[data-testid="vaccine-name"]').contains(
      VaccinesDetails.resource.vaccineCode.text,
    );
  };

  verifyVaccineDate = (VaccinesDetails = defaultVaccines.entry[0]) => {
    cy.get('[data-testid="header-time"]').contains(
      formatDateMonthDayCommaYear(VaccinesDetails.resource.occurrenceDateTime),
    );
  };

  verifyVaccineDateYearOnly = (VaccinesDetails = defaultVaccines.entry[0]) => {
    cy.get('[data-testid="header-time"]').contains(
      formatDateYear(VaccinesDetails.resource.occurrenceDateTime),
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
