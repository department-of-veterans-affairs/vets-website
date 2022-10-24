import session from '../mocks/v2/sessions';
import preCheckInData from '../mocks/v2/pre-check-in-data';
import checkInData from '../mocks/v2/check-in-data';
import btsss from '../mocks/v2/btsss';
import sharedData from '../mocks/v2/shared';
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
          emergencyContactEnabled: true,
          checkInExperiencePhoneAppointmentsEnabled: true,
          checkInExperienceLorotaSecurityUpdatesEnabled: true,
          checkInExperienceLorotaDeletionEnabled: true,
          checkInExperienceTravelReimbursement: false,
        }),
      );
    },
    withDayOfDemographicsFlagsEnabled: () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        featureToggles.generateFeatureToggles({
          checkInExperienceEnabled: true,
          preCheckInEnabled: true,
          emergencyContactEnabled: true,
          checkInExperienceDayOfDemographicsFlagsEnabled: true,
        }),
      );
    },
    withDayOfTranslationEnabled: () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        featureToggles.generateFeatureToggles({
          checkInExperienceEnabled: true,
          preCheckInEnabled: true,
          emergencyContactEnabled: true,
          checkInExperienceDayOfDemographicsFlagsEnabled: true,
          checkInExperienceDayOfTranslationEnabled: true,
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
          checkInExperienceDayOfDemographicsFlagsEnabled: true,
          checkInExperienceLorotaSecurityUpdatesEnabled: true,
          checkInExperiencePhoneAppointmentsEnabled: true,
          checkInExperienceLorotaDeletionEnabled: false,
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
          emergencyContactEnabled: true,
          checkInExperienceTravelReimbursement: true,
        }),
      );
    },
    withLorotaSecurityUpdate: () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        featureToggles.generateFeatureToggles({
          checkInExperienceEnabled: true,
          preCheckInEnabled: true,
          emergencyContactEnabled: true,
          checkInExperiencePhoneAppointmentsEnabled: false,
          checkInExperienceLorotaSecurityUpdatesEnabled: true,
        }),
      );
    },
    withPhoneAppointments: () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        featureToggles.generateFeatureToggles({
          checkInExperienceEnabled: true,
          preCheckInEnabled: true,
          emergencyContactEnabled: true,
          checkInExperienceLorotaSecurityUpdatesEnabled: true,
          checkInExperiencePhoneAppointmentsEnabled: true,
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
        const { last4, lastName, dob } = req.body?.session || {};
        if (
          (last4 === '1234' || dob === '1989-03-15') &&
          lastName === 'Smith'
        ) {
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
      token = sharedData.get.defaultUUID,
      numberOfCheckInAbledAppointments = 2,
      demographicsNeedsUpdate = true,
      demographicsConfirmedAt = null,
      nextOfKinNeedsUpdate = true,
      nextOfKinConfirmedAt = null,
      emergencyContactNeedsUpdate = true,
      emergencyContactConfirmedAt = null,
      timezone = 'browser',
    } = {}) => {
      cy.intercept('GET', `/check_in/v2/patient_check_ins/*`, req => {
        const rv = sharedData.get.createMultipleAppointments(
          token,
          numberOfCheckInAbledAppointments,
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
      numberOfCheckInAbledAppointments = 2,
      demographicsNeedsUpdate = true,
      demographicsConfirmedAt = null,
      nextOfKinNeedsUpdate = true,
      nextOfKinConfirmedAt = null,
      emergencyContactNeedsUpdate = true,
      emergencyContactConfirmedAt = null,
    } = {}) => {
      cy.intercept('GET', `/check_in/v2/patient_check_ins/*`, req => {
        const rv = sharedData.get.createMultipleAppointments(
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
        req.reply(errorCode, checkInData.patch.createMockFailedResponse({}));
      }).as('demographicsPatchFailureAlias');
    },
  };

  initializeBtsssPost = {
    withSuccess: () => {
      cy.intercept('POST', `/check_in/v2/btsss/`, req => {
        req.reply(btsss.post.createMockSuccessResponse());
      });
    },
    withFailure: (errorCode = 500) => {
      cy.intercept('POST', `/check_in/v2/btsss/`, req => {
        req.reply(errorCode, btsss.post.createMockFailedResponse({}));
      });
    },
  };
}

export default new ApiInitializer();
