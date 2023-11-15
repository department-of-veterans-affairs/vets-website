import moment from 'moment';
import PageObject from './PageObject';

export class PreferredDatePageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/preferred-date');
    cy.axeCheckBestPractice();

    return this;
  }

  typeDate({ date } = {}) {
    let preferredDate;
    if (date) {
      preferredDate = moment(date);
    } else {
      preferredDate = moment()
        .add(1, 'month')
        .startOf('month')
        .add(4, 'days');
    }
    cy.findByLabelText('Month').select(preferredDate.format('MMMM'));
    cy.findByLabelText('Day').select(preferredDate.format('D'));
    cy.findByLabelText('Year').type(preferredDate.format('YYYY'));

    return this;
  }
}

export default new PreferredDatePageObject();
