import mockCheckInV2 from '../../../api/local-mock-api/mocks/v2/check.in.responses';
import mockSessionV2 from '../../../api/local-mock-api/mocks/v2/sessions.responses';
import mockPatientCheckInsV2 from '../../../api/local-mock-api/mocks/v2/patient.check.in.responses';

const mockCheckIn = {
  v2: mockCheckInV2,
};
const mockSession = {
  v2: mockSessionV2,
};
const mockPatientCheckIns = {
  v2: mockPatientCheckInsV2,
};
const defaultAPIVersion = 'v2';

Cypress.Commands.add('authenticate', (version = defaultAPIVersion) => {
  cy.intercept('GET', `/check_in/${version}/sessions/*`, req => {
    req.reply(
      mockSession[version].createMockSuccessResponse(
        'some-token',
        'read.basic',
      ),
    );
  });
  cy.intercept('POST', `/check_in/${version}/sessions`, req => {
    req.reply(
      mockSession[version].createMockSuccessResponse('some-token', 'read.full'),
    );
  });
});
Cypress.Commands.add('alreadyAuthenticated', (version = defaultAPIVersion) => {
  cy.intercept('GET', `/check_in/${version}/sessions/*`, req => {
    req.reply(
      mockSession[version].createMockSuccessResponse('some-token', 'read.full'),
    );
  });
});
Cypress.Commands.add('successfulCheckin', (version = defaultAPIVersion) => {
  cy.intercept('POST', `/check_in/${version}/patient_check_ins/`, req => {
    req.reply(mockCheckIn[version].createMockSuccessResponse());
  });
});
Cypress.Commands.add('failedCheckin', (version = defaultAPIVersion) => {
  cy.intercept('POST', `/check_in/${version}/patient_check_ins/`, req => {
    req.reply(mockCheckIn[version].createMockFailedResponse({}));
  });
});
Cypress.Commands.add(
  'getAppointments',
  (
    appointments = null,
    token = null,
    numberOfCheckInAbledAppointments = 2,
    version = defaultAPIVersion,
  ) => {
    cy.intercept('GET', `/check_in/${version}/patient_check_ins/*`, req => {
      const rv = mockPatientCheckIns[version].createMultipleAppointments(
        token,
        numberOfCheckInAbledAppointments,
      );
      if (appointments && appointments.length) {
        const customAppointments = [];
        appointments.forEach(appointment => {
          const createdAppointment = mockPatientCheckIns[
            version
          ].createAppointment();
          customAppointments.push(
            Object.assign(createdAppointment, appointment),
          );
        });
        rv.payload.appointments = customAppointments;
      }
      req.reply(rv);
    });
    cy.intercept('POST', `/check_in/${version}/patient_check_ins/`, req => {
      req.reply(mockCheckIn[version].createMockSuccessResponse({}));
    });
  },
);
Cypress.Commands.add('getSingleAppointment', (version = defaultAPIVersion) => {
  cy.intercept('GET', `/check_in/${version}/patient_check_ins/*`, req => {
    const rv = mockPatientCheckIns[version].createMultipleAppointments({}, 1);
    req.reply(rv);
  });
  cy.intercept('POST', `/check_in/${version}/patient_check_ins/`, req => {
    req.reply(mockCheckIn[version].createMockSuccessResponse({}));
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
