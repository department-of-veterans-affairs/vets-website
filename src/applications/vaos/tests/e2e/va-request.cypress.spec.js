import moment from 'moment';
import {
  initAppointmentListMock,
  initVARequestMock,
} from './vaos-cypress-helpers';
import * as newApptTests from './vaos-cypress-schedule-appointment-helpers';
import facilities from '../../services/mocks/var/facilities.json';
import facilities983 from '../../services/mocks/var/facilities_983.json';

function fillOutForm(facilitySelection) {
  cy.visit('health-care/schedule-view-va-appointments/appointments/');
  cy.injectAxe();
  cy.get('.va-modal-body button').click();
  cy.findAllByRole('tab').should('exist');

  // Select primary care appointment type
  cy.get('#schedule-new-appointment-0').click();

  // Start flow
  cy.findByText('Start scheduling').click();

  // Choose Type of Care
  newApptTests.chooseTypeOfCareTest('Social work');

  // Choose VA Facility
  cy.url().should('include', '/va-facility');
  cy.axeCheckBestPractice();
  if (facilitySelection) facilitySelection();
  cy.findByText(/Continue/).click({ force: true });

  // Choose date and slot (AM or PM)
  newApptTests.selectRequestSlotTest();

  // Reason for appointment
  newApptTests.reasonForAppointmentTest(
    'cough',
    /Please give us more detail about why/,
  );

  // Visit type
  newApptTests.howToBeSeenTest();

  // Contact info
  newApptTests.contactInfoTest();

  // Review
  cy.url().should('include', '/review');
  cy.axeCheckBestPractice();
  cy.findByText('Request appointment').click();

  // Check form requestBody is as expected
  cy.wait('@appointmentRequests').should(xhr => {
    let date = moment()
      .add(5, 'days')
      .add(1, 'months')
      .startOf('month');

    // Check for weekend and select following Monday if true
    if (date.weekday() === 0) {
      date = date.add(1, 'days').format('MM/DD/YYYY');
    } else if (date.weekday() === 6) {
      date = date.add(2, 'days').format('MM/DD/YYYY');
    } else {
      date = date.format('MM/DD/YYYY');
    }

    expect(xhr.response.statusCode).to.eq(200);
    expect(xhr.response.url).to.eq(/vaos\/v0\/appointment_requests?type=va/);
    const request = xhr.request.body;
    expect(request)
      .to.have.property('optionDate1')
      .to.equal(date);
    expect(request)
      .to.have.property('optionDate2')
      .to.equal('No Date Selected');
    expect(request)
      .to.have.property('optionDate3')
      .to.equal('No Date Selected');

    expect(request.facility.facilityCode).to.eq('983GB');
    expect(request.facility.parentSiteCode).to.eq('983');
    expect(request).to.have.property('typeOfCareId', '125');
    expect(request).to.have.property('visitType', 'Office Visit');
    expect(request).to.have.property('optionTime1', 'AM');
    expect(request).to.have.property('optionTime2', 'No Time Selected');
    expect(request).to.have.property('optionTime3', 'No Time Selected');
    expect(request).to.have.property('email', 'veteran@gmail.com');
    expect(request).to.have.property('phoneNumber', '5035551234');
  });

  // Check messages requestBody is as expected
  cy.wait('@requestMessages').should(xhr => {
    const request = xhr.request.ody;
    expect(request).to.have.property('messageText', 'cough');
  });

  // Confirmation page
  cy.findByText('Your appointment request has been submitted');
  cy.findByText('VA appointment');
  cy.get('.additional-info-button')
    .focus()
    .click();
  cy.findByText('Follow-up/Routine');
  cy.findByText('cough');
}

describe('VAOS request flow', () => {
  beforeEach(() => {});

  it('should submit form successfully for a multi system user', () => {
    initAppointmentListMock();
    initVARequestMock();
    fillOutForm(() => {
      cy.findByLabelText(/Sidney/).click({ force: true });
    });
  });
  it.skip('should submit form successfully for a single system user', () => {
    initAppointmentListMock();
    initVARequestMock();
    cy.intercept('GET', '/vaos/v0/facilities**', {
      body: {
        data: facilities.data.slice(0, 1),
      },
    });
    fillOutForm(() => {
      cy.findByLabelText(/Sidney/).click({ force: true });
    });
  });
  it.skip('should submit form successfully for a user with multi system including a Cerner facility', () => {
    initAppointmentListMock();
    initVARequestMock({ cernerUser: true });
    cy.intercept('GET', '/vaos/v0/facilities**', {
      body: {
        data: facilities.data.slice(0, 1),
      },
    });
    cy.intercept('GET', '/vaos/v0/systems/983/direct_scheduling_facilities*', {
      body: {
        data: facilities983.data.filter(f => f.id === '983GB'),
      },
    });
    fillOutForm();
  });
});
