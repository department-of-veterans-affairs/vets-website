import { mockDirectScheduleSlotsApi } from '../vaos-cypress-helpers';
import PageObject from './PageObject';

export class ClinicChoicePageObject extends PageObject {
  assertUrl() {
    // cy.url().should('include', url, { timeout: 5000 });
    cy.url().should('include', '/clinic', { timeout: 5000 });
    cy.axeCheckBestPractice();

    return this;
  }

  selectClinic(selection, isCovid = false) {
    if (isCovid) {
      cy.findByText(/Choose a clinic/i, { selector: 'h1' });
    } else {
      cy.findByText(/Choose a VA clinic/i, { selector: 'h1' });
    }

    cy.findByLabelText(selection).as('radio');
    cy.get('@radio').check();

    // Get the selected clinic id
    cy.get('@radio')
      .invoke('val')
      .then(value => {
        const tokens = value.split('_');
        const [, clinicId] = tokens;
        mockDirectScheduleSlotsApi({ clinicId, apiVersion: 2 });
      });

    return this;
  }
}

export default new ClinicChoicePageObject();
