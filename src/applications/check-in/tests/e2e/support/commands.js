import mockCheckIn from '../../../api/local-mock-api/mocks/v2/check.in.responses';
import mockSession from '../../../api/local-mock-api/mocks/v2/sessions.responses';
import mockPatientCheckIns from '../../../api/local-mock-api/mocks/v2/patient.check.in.responses';

Cypress.Commands.add('authenticate', () => {
  cy.intercept('GET', '/check_in/v2/sessions/*', req => {
    req.reply(
      mockSession.createMockSuccessResponse('some-token', 'read.basic'),
    );
  });
  cy.intercept('POST', '/check_in/v2/sessions', req => {
    req.reply(mockSession.createMockSuccessResponse('some-token', 'read.full'));
  });
});
Cypress.Commands.add('alreadyAuthenticated', () => {
  cy.intercept('GET', '/check_in/v2/sessions/*', req => {
    req.reply(mockSession.createMockSuccessResponse('some-token', 'read.full'));
  });
});
Cypress.Commands.add('successfulCheckin', () => {
  cy.intercept('POST', '/check_in/v2/patient_check_ins/', req => {
    req.reply(mockCheckIn.createMockSuccessResponse());
  });
});
Cypress.Commands.add('failedCheckin', () => {
  cy.intercept('POST', '/check_in/v2/patient_check_ins/', req => {
    req.reply(mockCheckIn.createMockFailedResponse({}));
  });
});
Cypress.Commands.add(
  'getAppointments',
  (appointments = null, token = null, numberOfCheckInAbledAppointments = 2) => {
    cy.intercept('GET', '/check_in/v2/patient_check_ins/*', req => {
      const rv = mockPatientCheckIns.createMultipleAppointments(
        token,
        numberOfCheckInAbledAppointments,
      );
      if (appointments && appointments.length) {
        const customAppointments = [];
        appointments.forEach(appointment => {
          const createdAppointment = mockPatientCheckIns.createAppointment();
          customAppointments.push(
            Object.assign(createdAppointment, appointment),
          );
        });
        rv.payload.appointments = customAppointments;
      }
      req.reply(rv);
    });
    cy.intercept('POST', '/check_in/v2/patient_check_ins/', req => {
      req.reply(mockCheckIn.createMockSuccessResponse({}));
    });
  },
);
Cypress.Commands.add('getSingleAppointment', () => {
  cy.intercept('GET', '/check_in/v2/patient_check_ins/*', req => {
    const rv = mockPatientCheckIns.createMultipleAppointments({}, 1);
    req.reply(rv);
  });
  cy.intercept('POST', '/check_in/v2/patient_check_ins/', req => {
    req.reply(mockCheckIn.createMockSuccessResponse({}));
  });
});
Cypress.Commands.add('signIn', () => {
  cy.get('[label="Your last name"]')
    .shadow()
    .find('input')
    .type('Smith');
  cy.get('[label="Last 4 digits of your Social Security number"]')
    .shadow()
    .find('input')
    .type('4837');
  cy.get('[data-testid=check-in-button]').click();
});
