import session from '../mocks/v2/sessions';
import preCheckInData from '../mocks/v2/pre-check-in-data';
import checkInData from '../mocks/v2/check-in-data';
import btsss from '../mocks/v2/btsss';
import sharedData from '../mocks/v2/shared';
import featureToggles from '../mocks/v2/feature-toggles';

const dateFns = require('date-fns');

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
          checkInExperienceTravelReimbursement: true,
        }),
      );
    },
    withTravelPay: () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        featureToggles.generateFeatureToggles({
          checkInExperienceEnabled: true,
          preCheckInEnabled: true,
          checkInExperienceTranslationDisclaimerSpanishEnabled: true,
          checkInExperienceTravelReimbursement: true,
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
          checkInExperienceTravelReimbursement: true,
          checkInExperienceUpcomingAppointmentsEnabled: true,
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
        req.reply(errorCode, session.get.createMockFailedResponse(errorCode));
      });
    },
  };

  initializeSessionPost = {
    withSuccess: extraValidation => {
      cy.intercept('POST', `/check_in/v2/sessions`, req => {
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
        const { lastName, dob } = req.body?.session || {};
        if (dob === '1935-04-07' && lastName === 'Smith') {
          req.reply(
            session.post.createMockSuccessResponse('some-token', 'read.full'),
          );
        } else {
          req.reply(400, session.post.createMockValidateErrorResponse());
        }
      });
    },
    withValidationMaxAttempts: () => {
      cy.intercept('POST', '/check_in/v2/sessions', req => {
        req.reply(410, session.post.createMockMaxValidateErrorResponse());
      });
    },
    withFailure: (errorCode = 401) => {
      cy.intercept('POST', '/check_in/v2/sessions', req => {
        req.reply(errorCode, session.post.createMockFailedResponse(errorCode));
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
      uuid = sharedData.get.defaultUUID,
    } = {}) => {
      cy.intercept('GET', '/check_in/v2/pre_check_ins/*', req => {
        if (extraValidation) {
          extraValidation(req);
        }
        req.reply(
          preCheckInData.get.createMockSuccessResponse(
            uuid,
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
        uuid,
        demographicsNeedsUpdate,
        demographicsConfirmedAt,
        nextOfKinNeedsUpdate,
        nextOfKinConfirmedAt,
        emergencyContactNeedsUpdate,
        emergencyContactConfirmedAt,
      );
    },
    withAllDemographicsCurrent: () => {
      const yesterday = dateFns.sub(new Date(), { days: -1 }).toISOString();
      const data = preCheckInData.get.createMockSuccessResponse(
        null,
        false,
        yesterday,
        false,
        yesterday,
        false,
        yesterday,
      );
      cy.intercept('GET', '/check_in/v2/pre_check_ins/*', req => {
        req.reply(data);
      });
      return data;
    },
    withAlreadyCompleted: () => {
      const data = preCheckInData.get.createMockSuccessResponse(
        preCheckInData.get.alreadyPreCheckedInUUID,
      );
      cy.intercept('GET', '/check_in/v2/pre_check_ins/*', req => {
        req.reply(data);
      });
      return data;
    },
    withCanceledAppointment: () => {
      const data = preCheckInData.get.createMockSuccessResponse(
        preCheckInData.get.canceledAppointmentUUID,
      );
      cy.intercept('GET', '/check_in/v2/pre_check_ins/*', req => {
        req.reply(data);
      });
      return data;
    },
    withExpired: () => {
      const data = preCheckInData.get.createMockSuccessResponse(
        preCheckInData.get.expiredUUID,
      );
      cy.intercept('GET', '/check_in/v2/pre_check_ins/*', req => {
        req.reply(data);
      });
      return data;
    },
    withDayOfAppointment: () => {
      const data = preCheckInData.get.createMockSuccessResponse(
        preCheckInData.get.withDayofAppointmentUUID,
      );
      cy.intercept('GET', '/check_in/v2/pre_check_ins/*', req => {
        req.reply(data);
      });
      return data;
    },
    withBadData: ({
      extraValidation = null,
      demographicsNeedsUpdate = true,
      demographicsConfirmedAt = null,
      nextOfKinNeedsUpdate = true,
      nextOfKinConfirmedAt = null,
      emergencyContactNeedsUpdate = true,
      emergencyContactConfirmedAt = null,
      uuid = 'no-uuid',
    } = {}) => {
      const data = preCheckInData.get.createMockSuccessResponse(
        uuid,
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
        req.reply(errorCode, sharedData.get.createMockFailedResponse());
      });
    },
    withUuidNotFound: () => {
      cy.intercept('GET', `/check_in/v2/pre_check_ins/*`, req => {
        req.reply(404, sharedData.get.createMockNotFoundResponse());
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
        req.reply(errorCode, sharedData.post.createMockFailedResponse());
      }).as('post-pre_check_ins-failure');
    },
  };

  initializeCheckInDataGet = {
    withSuccess: ({
      extraValidation = null,
      appointments = null,
      token = sharedData.get.defaultUUID,
      demographicsNeedsUpdate = true,
      demographicsConfirmedAt = null,
      nextOfKinNeedsUpdate = true,
      nextOfKinConfirmedAt = null,
      emergencyContactNeedsUpdate = true,
      emergencyContactConfirmedAt = null,
      timezone = 'browser',
    } = {}) => {
      cy.intercept('GET', `/check_in/v2/patient_check_ins/*`, req => {
        const rv = sharedData.get.createAppointments(
          token,
          demographicsNeedsUpdate,
          demographicsConfirmedAt,
          nextOfKinNeedsUpdate,
          nextOfKinConfirmedAt,
          emergencyContactNeedsUpdate,
          emergencyContactConfirmedAt,
          timezone,
        );
        if (appointments && appointments.length) {
          const customAppointments = [];
          appointments.forEach((appointment, index) => {
            const createdAppointment = sharedData.get.createAppointment(
              'ELIGIBLE',
              'some-facility',
              `000${index}`,
              'TEST CLINIC',
              false,
              '',
              timezone,
            );
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
      token = sharedData.get.defaultUUID,
      demographicsNeedsUpdate = true,
      demographicsConfirmedAt = null,
      nextOfKinNeedsUpdate = true,
      nextOfKinConfirmedAt = null,
      emergencyContactNeedsUpdate = true,
      emergencyContactConfirmedAt = null,
    } = {}) => {
      cy.intercept('GET', `/check_in/v2/patient_check_ins/*`, req => {
        const rv = sharedData.get.createAppointments(
          token,
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
        req.reply(errorCode, sharedData.get.createMockFailedResponse());
      });
    },
    withUuidNotFound: () => {
      cy.intercept('GET', `/check_in/v2/patient_check_ins/*`, req => {
        req.reply(404, sharedData.get.createMockNotFoundResponse());
      });
    },
    withPast15MinuteWindow: () => {
      cy.intercept(`/check_in/v2/patient_check_ins/*`, req => {
        const rv = sharedData.get.createAppointments(
          sharedData.get.checkInTooLateUUID,
        );
        req.reply(rv);
      });
    },
    withSuccessAndUpdate: ({
      extraValidation = null,
      appointments = null,
      token = sharedData.get.defaultUUID,
      demographicsNeedsUpdate = true,
      demographicsConfirmedAt = null,
      nextOfKinNeedsUpdate = true,
      nextOfKinConfirmedAt = null,
      emergencyContactNeedsUpdate = true,
      emergencyContactConfirmedAt = null,
      timezone = 'browser',
    } = {}) => {
      cy.intercept(`/check_in/v2/patient_check_ins/*`, req => {
        const rv = sharedData.get.createAppointments(
          token,
          demographicsNeedsUpdate,
          demographicsConfirmedAt,
          nextOfKinNeedsUpdate,
          nextOfKinConfirmedAt,
          emergencyContactNeedsUpdate,
          emergencyContactConfirmedAt,
          timezone,
        );
        if (appointments && appointments.length) {
          const customAppointments = [];
          appointments.forEach(appointment => {
            const createdAppointment = sharedData.get.createAppointment({
              eligibility: 'INELIGIBLE_ALREADY_CHECKED_IN',
            });
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
      }).as('reloadOnDetails');
      cy.intercept(`/check_in/v2/patient_check_ins/*`, { times: 1 }, req => {
        const rv = sharedData.get.createAppointments(
          token,
          demographicsNeedsUpdate,
          demographicsConfirmedAt,
          nextOfKinNeedsUpdate,
          nextOfKinConfirmedAt,
          emergencyContactNeedsUpdate,
          emergencyContactConfirmedAt,
          timezone,
        );
        if (appointments && appointments.length) {
          const customAppointments = [];
          appointments.forEach(appointment => {
            const createdAppointment = sharedData.get.createAppointment({
              eligibility: 'ELIGIBLE',
            });
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
      }).as('completeCheckIn');
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
        req.reply(errorCode, sharedData.post.createMockFailedResponse({}));
      });
    },
  };

  initializeAddressValidationPost = {
    withSuccess: () => {
      cy.intercept('POST', `/check_in/v2/validate_address/`, req => {
        req.reply(
          checkInData.post.createMockAddressValidationSuccessResponse(),
        );
      });
    },
    withFailure: (errorCode = 400) => {
      cy.intercept('POST', `/check_in/v2/validate_address/`, req => {
        req.reply(
          errorCode,
          checkInData.post.createMockAddressValidationErrorResponse({}),
        );
      });
    },
  };

  initializeDemographicsPatch = {
    withSuccess: () => {
      cy.intercept('PATCH', `/check_in/v2/demographics/*`, req => {
        req.reply(checkInData.patch.createMockSuccessResponse());
      }).as('demographicsPatchSuccessAlias');
    },
    withFailure: (errorCode = 400, delay = 0) => {
      cy.intercept('PATCH', `/check_in/v2/demographics/*`, req => {
        req.on('response', res => {
          res.setDelay(delay);
        });
        req.reply(errorCode, sharedData.patch.createMockFailedResponse({}));
      }).as('demographicsPatchFailureAlias');
    },
  };

  initializeBtsssPost = {
    withSuccess: (times = 1) => {
      cy.intercept(`/check_in/v0/travel_claims/`, { times }, req => {
        req.reply(202, btsss.post.createMockSuccessResponse());
      }).as('btsssPostSuccess');
    },
    withFailure: (times = 1) => {
      cy.intercept(`/check_in/v0/travel_claims/`, { times }, req => {
        req.reply(500, btsss.post.createMockFailedResponse());
      }).as('btsssPostFailure');
    },
  };

  initializeCheckInDataGetOH = {
    withSuccess: token => {
      cy.intercept('GET', `/check_in/v2/patient_check_ins/*`, req => {
        const rv = sharedData.get.createAppointmentsOH(token);
        req.reply(rv);
      });
    },
    withFailure: (errorCode = 400) => {
      cy.intercept('GET', `/check_in/v2/patient_check_ins/*`, req => {
        req.reply(errorCode, sharedData.get.createMockFailedResponse());
      });
    },
    withUuidNotFound: () => {
      cy.intercept('GET', `/check_in/v2/patient_check_ins/*`, req => {
        req.reply(404, sharedData.get.createMockNotFoundResponse());
      });
    },
  };

  initializeUpcomingAppointmentsDataGet = {
    withSuccess: ({ uuid = sharedData.get.defaultUUID } = {}) => {
      cy.intercept('GET', '/check_in/v2/sessions/*/appointments*', req => {
        req.reply(sharedData.get.createUpcomingAppointments(uuid));
      });
      return sharedData.get.createUpcomingAppointments(uuid);
    },
    withFailure: (errorCode = 400) => {
      cy.intercept('GET', `/check_in/v2/sessions/*/appointments`, req => {
        req.reply(errorCode, sharedData.get.createMockFailedResponse());
      });
    },
  };
}

export default new ApiInitializer();
