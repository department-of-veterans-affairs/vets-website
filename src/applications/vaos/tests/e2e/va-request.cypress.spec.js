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

  // Start flow
  cy.findByText('Start scheduling').click();

  // Choose Type of Care
  newApptTests.chooseTypeOfCareTest('Social work');

  // Choose VA Facility
  cy.url().should('include', '/va-facility');
  cy.axeCheckBestPractice();
  if (facilitySelection) facilitySelection();
  cy.findByText(/Continue/).click();

  // Choose date and slot (AM or PM)
  newApptTests.selectRequestSlotTest();

  // Reason for appointment
  newApptTests.reasonForAppointmentTest(
    'cough',
    /Please provide any additional details/,
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

    expect(xhr.status).to.eq(200);
    expect(xhr.url, 'post url').to.contain(
      '/vaos/v0/appointment_requests?type=va',
    );
    const request = xhr.requestBody;
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
    const request = xhr.requestBody;
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
  cy.axeCheckBestPractice();
}

describe('VAOS request flow', () => {
  beforeEach(() => {});

  it('should submit form successfully for a multi system user', () => {
    initAppointmentListMock();
    initVARequestMock();
    fillOutForm(() => {
      cy.findByLabelText(/Sidney/)
        .focus()
        .click();
    });
  });
  it('should submit form successfully for a single system user', () => {
    initAppointmentListMock();
    initVARequestMock();
    cy.route({
      method: 'GET',
      url: '/vaos/v0/facilities**',
      response: {
        data: facilities.data.slice(0, 1),
      },
    });
    fillOutForm(() => {
      cy.findByLabelText(/Sidney/)
        .focus()
        .click();
    });
  });
  it('should display Cerner how to schedule page if a Cerner facility is chosen', () => {
    initAppointmentListMock();
    initVARequestMock({ cernerFacility: '983' });
    cy.route({
      method: 'GET',
      url: '/vaos/v0/facilities**',
      response: {
        data: facilities.data.slice(0, 1),
      },
    });
    cy.route({
      method: 'GET',
      url: '/vaos/v0/systems/983/direct_scheduling_facilities*',
      response: {
        data: facilities983.data.filter(f => f.id === '983GB'),
      },
    });
    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();
    cy.get('.va-modal-body button').click();
    cy.findAllByRole('tab').should('exist');

    // Start flow
    cy.findByText('Start scheduling').click();

    // Choose Type of Care
    newApptTests.chooseTypeOfCareTest('Social work');

    // Choose VA Facility
    cy.url().should('include', '/va-facility-2');
    cy.axeCheckBestPractice();
    cy.findByLabelText(/Rawlins/)
      .focus()
      .click();
    cy.findByText(/Continue/).click();

    cy.url().should('include', '/how-to-schedule');
    cy.findByText(/Rawlins VA Clinic/);
    cy.findByText(/To schedule an appointment online at this facility/);
    cy.axeCheckBestPractice();
  });
});
