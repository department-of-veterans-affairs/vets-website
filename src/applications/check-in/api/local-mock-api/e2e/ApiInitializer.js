import session from '../mocks/v2/sessions';
import preCheckInData from '../mocks/v2/pre-check-in-data';
import checkInData from '../mocks/v2/check-in-data';
import featureToggles from '../mocks/v2/feature-toggles';

class ApiInitializer {
  initializeFeatureToggle = {
    withAppsDisabled: () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        featureToggles.generateFeatureToggles({
          checkInExperienceEnabled: false,
          preCheckInEnabled: false,
        }),
      );
    },
    withCurrentFeatures: () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        featureToggles.generateFeatureToggles({
          checkInExperienceEnabled: true,
          preCheckInEnabled: true,
          checkInExperienceUpdateInformationPageEnabled: false,
          emergencyContactEnabled: true,
          checkInExperienceEditingPreCheckInEnabled: false,
        }),
      );
    },
    withPreCheckInEditEnabled: () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        featureToggles.generateFeatureToggles({
          checkInExperienceEnabled: true,
          preCheckInEnabled: true,
          checkInExperienceUpdateInformationPageEnabled: false,
          emergencyContactEnabled: true,
          checkInExperienceEditingPreCheckInEnabled: true,
        }),
      );
    },
    withAllFeatures: () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        featureToggles.generateFeatureToggles({
          checkInExperienceEnabled: true,
          preCheckInEnabled: true,
          checkInExperienceUpdateInformationPageEnabled: true,
          emergencyContactEnabled: true,
        }),
      );
    },
  };

  initializeSessionGet = {
    withSuccessfulNewSession: extraValidation => {
      cy.intercept('GET', '/check_in/v2/sessions/*', req => {
        if (extraValidation) {
          extraValidation(req);
        }
        req.reply(
          session.get.createMockSuccessResponse('some-token', 'read.basic'),
        );
      });
    },
    withSuccessfulReturningSession: () => {
      cy.intercept('GET', '/check_in/v2/sessions/*', req => {
        req.reply(
          session.get.createMockSuccessResponse({
            uuid: 'some-token',
            permissions: 'read.full',
          }),
        );
      });
    },
    withFailure: (errorCode = 400) => {
      cy.intercept('GET', '/check_in/v2/sessions/*', req => {
        req.reply(errorCode, session.get.createMockFailedResponse());
      });
    },
  };

  initializeSessionPost = {
    withSuccess: extraValidation => {
      cy.intercept('POST', '/check_in/v2/sessions', req => {
        if (extraValidation) {
          extraValidation(req);
        }
        req.reply(
          session.post.createMockSuccessResponse('some-token', 'read.full'),
        );
      });
    },
    withValidation: () => {
      cy.intercept('POST', '/check_in/v2/sessions', req => {
        const { last4, lastName } = req.body?.session || {};
        if (last4 === '1234' && lastName === 'Smith') {
          req.reply(
            session.post.createMockSuccessResponse('some-token', 'read.full'),
          );
        } else {
          req.reply(400, session.post.createMockValidateErrorResponse());
        }
      });
    },
    withFailure: (errorCode = 400) => {
      cy.intercept('POST', '/check_in/v2/sessions', req => {
        req.reply(errorCode, session.post.createMockFailedResponse());
      });
    },
  };

  initializePreCheckInDataGet = {
    withSuccess: ({
      extraValidation = null,
      demographicsNeedsUpdate = true,
      demographicsConfirmedAt = null,
      nextOfKinNeedsUpdate = true,
      nextOfKinConfirmedAt = null,
      emergencyContactNeedsUpdate = true,
      emergencyContactConfirmedAt = null,
    } = {}) => {
      cy.intercept('GET', '/check_in/v2/pre_check_ins/*', req => {
        if (extraValidation) {
          extraValidation(req);
        }
        req.reply(
          preCheckInData.get.createMockSuccessResponse(
            'some-token',
            demographicsNeedsUpdate,
            demographicsConfirmedAt,
            nextOfKinNeedsUpdate,
            nextOfKinConfirmedAt,
            emergencyContactNeedsUpdate,
            emergencyContactConfirmedAt,
          ),
        );
      });
      return preCheckInData.get.createMockSuccessResponse(
        'some-token',
        demographicsNeedsUpdate,
        demographicsConfirmedAt,
        nextOfKinNeedsUpdate,
        nextOfKinConfirmedAt,
        emergencyContactNeedsUpdate,
        emergencyContactConfirmedAt,
      );
    },
    withBadData: ({
      extraValidation = null,
      demographicsNeedsUpdate = true,
      demographicsConfirmedAt = null,
      nextOfKinNeedsUpdate = true,
      nextOfKinConfirmedAt = null,
      emergencyContactNeedsUpdate = true,
      emergencyContactConfirmedAt = null,
    } = {}) => {
      const data = preCheckInData.get.createMockSuccessResponse(
        'some-token',
        demographicsNeedsUpdate,
        demographicsConfirmedAt,
        nextOfKinNeedsUpdate,
        nextOfKinConfirmedAt,
        emergencyContactNeedsUpdate,
        emergencyContactConfirmedAt,
      );
      cy.intercept('GET', '/check_in/v2/pre_check_ins/*', req => {
        if (extraValidation) {
          extraValidation(req);
        }
        data.payload.appointments[0].startTime = 'invalid';
        req.reply(data);
      });
      return data;
    },
    withFailure: (errorCode = 400) => {
      cy.intercept('GET', '/check_in/v2/pre_check_ins/*', req => {
        req.reply(errorCode, preCheckInData.get.createMockFailedResponse());
      });
    },
  };

  initializePreCheckInDataPost = {
    withSuccess: extraValidation => {
      cy.intercept('POST', '/check_in/v2/pre_check_ins/', req => {
        if (extraValidation) {
          extraValidation(req);
        }
        req.reply(preCheckInData.post.createMockSuccessResponse('some-token'));
      }).as('post-pre_check_ins-success');
    },
    withFailure: (errorCode = 400) => {
      cy.intercept('POST', '/check_in/v2/pre_check_ins/', req => {
        req.reply(errorCode, preCheckInData.post.createMockFailedResponse());
      }).as('post-pre_check_ins-failure');
    },
  };

  initializeCheckInDataGet = {
    withSuccess: ({
      extraValidation = null,
      appointments = null,
      token = checkInData.get.defaultUUID,
      numberOfCheckInAbledAppointments = 2,
      demographicsNeedsUpdate = true,
      demographicsConfirmedAt = null,
      nextOfKinNeedsUpdate = true,
      nextOfKinConfirmedAt = null,
      emergencyContactNeedsUpdate = true,
      emergencyContactConfirmedAt = null,
    } = {}) => {
      cy.intercept('GET', `/check_in/v2/patient_check_ins/*`, req => {
        const rv = checkInData.get.createMultipleAppointments(
          token,
          numberOfCheckInAbledAppointments,
          demographicsNeedsUpdate,
          demographicsConfirmedAt,
          nextOfKinNeedsUpdate,
          nextOfKinConfirmedAt,
          emergencyContactNeedsUpdate,
          emergencyContactConfirmedAt,
        );
        if (appointments && appointments.length) {
          const customAppointments = [];
          appointments.forEach(appointment => {
            const createdAppointment = checkInData.get.createAppointment();
            customAppointments.push(
              Object.assign(createdAppointment, appointment),
            );
          });
          rv.payload.appointments = customAppointments;
        }
        if (extraValidation) {
          extraValidation(req);
        }
        req.reply(rv);
      });
    },
    withBadData: ({
      extraValidation = null,
      token = checkInData.get.defaultUUID,
      numberOfCheckInAbledAppointments = 2,
      demographicsNeedsUpdate = true,
      demographicsConfirmedAt = null,
      nextOfKinNeedsUpdate = true,
      nextOfKinConfirmedAt = null,
      emergencyContactNeedsUpdate = true,
      emergencyContactConfirmedAt = null,
    } = {}) => {
      cy.intercept('GET', `/check_in/v2/patient_check_ins/*`, req => {
        const rv = checkInData.get.createMultipleAppointments(
          token,
          numberOfCheckInAbledAppointments,
          demographicsNeedsUpdate,
          demographicsConfirmedAt,
          nextOfKinNeedsUpdate,
          nextOfKinConfirmedAt,
          emergencyContactNeedsUpdate,
          emergencyContactConfirmedAt,
        );
        rv.payload.appointments[0].startTime = 'invalid';
        if (extraValidation) {
          extraValidation(req);
        }
        req.reply(rv);
      });
    },
    withFailure: (errorCode = 400) => {
      cy.intercept('GET', `/check_in/v2/patient_check_ins/*`, req => {
        req.reply(errorCode, checkInData.get.createMockFailedResponse());
      });
    },
  };

  initializeCheckInDataPost = {
    withSuccess: extraValidation => {
      cy.intercept('POST', `/check_in/v2/patient_check_ins/`, req => {
        if (extraValidation) {
          extraValidation(req);
        }
        req.reply(checkInData.post.createMockSuccessResponse());
      });
    },
    withFailure: (errorCode = 400) => {
      cy.intercept('POST', `/check_in/v2/patient_check_ins/`, req => {
        req.reply(errorCode, checkInData.post.createMockFailedResponse({}));
      });
    },
  };
}

export default new ApiInitializer();
