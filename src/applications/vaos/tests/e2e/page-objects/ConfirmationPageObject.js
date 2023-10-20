import PageObject from './PageObject';

class ConfirmationPageObject extends PageObject {
  assertUrl({ url = '/confirmation', apiVersion = 0 } = {}) {
    if (apiVersion === 0) cy.url().should('include', url);
    else cy.url().should('include', '/mock1');
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
