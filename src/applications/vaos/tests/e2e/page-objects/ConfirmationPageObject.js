import PageObject from './PageObject';

export class ConfirmationPageObject extends PageObject {
  assertUrl({ isDirect = true } = {}) {
    cy.url().should('include', isDirect ? '/mock1' : '/pending');
    cy.get('va-loading-indicator.hydrated', { timeout: 240000 }).should(
      'not.exist',
    );

    cy.axeCheckBestPractice();

    return this;
  }

  selectReviewAppointments() {
    return this;
  }

  selectScheduleNewAppointment() {
    return this;
  }

  selectAddToCalendar() {
    return this;
  }

  selectPrint() {
    return this;
  }
}

export default new ConfirmationPageObject();
