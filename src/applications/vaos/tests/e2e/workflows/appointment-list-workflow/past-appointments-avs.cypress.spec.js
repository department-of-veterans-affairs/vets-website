/* eslint-disable no-plusplus */
// @ts-check
import { subDays } from 'date-fns';
import { APPOINTMENT_STATUS } from '../../../../utils/constants';
import MockAppointmentResponse from '../../../fixtures/MockAppointmentResponse';
import MockUser from '../../../fixtures/MockUser';
import PastAppointmentListPageObject from '../../page-objects/AppointmentList/PastAppointmentListPageObject';
import AppointmentDetailPageObject from '../../page-objects/AppointmentList/AppointmentDetailPageObject';
import {
  mockAppointmentsGetApi,
  mockFeatureToggles,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';

describe('VAOS past appointment AVS flow', () => {
  beforeEach(() => {
    vaosSetup();
    mockVamcEhrApi();
    cy.login(new MockUser());
  });

  describe('When feature flag is disabled, should not show section when no error occurs', () => {
    describe('and is an OH appointment', () => {
      const yesterday = subDays(new Date(), 1);
      const responseObj = {
        id: '1',
        cancellable: false,
        localStartTime: yesterday,
        status: APPOINTMENT_STATUS.booked,
        past: true,
        isCerner: true,
        avsPath: null,
      };
      it('and travelPayViewClaimDetails is enabled', () => {
        mockFeatureToggles({
          vaOnlineSchedulingAddOhAvs: false,
          travelPayViewClaimDetails: true,
        });

        const response = new MockAppointmentResponse(responseObj);

        mockAppointmentsGetApi({ response: [response] });

        PastAppointmentListPageObject.visit().selectListItem();
        AppointmentDetailPageObject.assertUrl()
          .assertHeading({ name: /past in.person appointment/i, level: 1 })
          .assertAfterVisitSummaryDoesNotExist();

        cy.axeCheckBestPractice();
      });

      it('and travelPayViewClaimDetails is disabled', () => {
        mockFeatureToggles({
          vaOnlineSchedulingAddOhAvs: false,
          travelPayViewClaimDetails: false,
        });

        const response = new MockAppointmentResponse(responseObj);

        mockAppointmentsGetApi({ response: [response] });

        PastAppointmentListPageObject.visit().selectListItem();
        AppointmentDetailPageObject.assertUrl()
          .assertHeading({
            name: /past in.person appointment/i,
            level: 1,
          })
          .assertAfterVisitSummaryVistALink({
            exists: false,
          })
          .assertAfterVisitSummaryDoesNotExist();

        cy.axeCheckBestPractice();
      });
    });
    describe('and is NOT an OH appointment', () => {
      const yesterday = subDays(new Date(), 1);
      const responseObj = {
        id: '1',
        cancellable: false,
        localStartTime: yesterday,
        status: APPOINTMENT_STATUS.booked,
        past: true,
        isCerner: false,
        avsPath: 'https://va.gov/avs/12345',
      };
      it('and travelPayViewClaimDetails is enabled', () => {
        mockFeatureToggles({
          vaOnlineSchedulingAddOhAvs: false,
          travelPayViewClaimDetails: true,
        });

        const response = new MockAppointmentResponse(responseObj);

        mockAppointmentsGetApi({ response: [response] });

        PastAppointmentListPageObject.visit().selectListItem();
        AppointmentDetailPageObject.assertUrl()
          .assertHeading({
            name: /past in.person appointment/i,
            level: 1,
          })
          .assertAfterVisitSummaryVistALink();

        cy.axeCheckBestPractice();
      });

      it('and travelPayViewClaimDetails is disabled', () => {
        mockFeatureToggles({
          vaOnlineSchedulingAddOhAvs: false,
          travelPayViewClaimDetails: false,
        });

        const response = new MockAppointmentResponse(responseObj);

        mockAppointmentsGetApi({ response: [response] });

        PastAppointmentListPageObject.visit().selectListItem();
        AppointmentDetailPageObject.assertUrl()
          .assertHeading({
            name: /past in.person appointment/i,
            level: 1,
          })
          .assertAfterVisitSummaryVistALink();

        cy.axeCheckBestPractice();
      });
    });
  });

  describe('When appointment has valid AVS PDFs', () => {
    it('should display PDF download links', () => {
      mockFeatureToggles({
        vaOnlineSchedulingAddOhAvs: true,
        travelPayViewClaimDetails: true,
      });

      const yesterday = subDays(new Date(), 1);
      const response = new MockAppointmentResponse({
        id: '1',
        cancellable: false,
        localStartTime: yesterday,
        status: APPOINTMENT_STATUS.booked,
        past: true,
        isCerner: true,
        avsPdf: [
          {
            id: '208750417891',
            noteType: 'ambulatory_patient_summary',
            binary: 'JVBERi0xLjQK', // Valid PDF binary
          },
        ],
        travelPayClaim: {
          metadata: {
            status: 200,
            success: true,
            message: 'No claims found.',
          },
        },
      });

      mockAppointmentsGetApi({ response: [response] });

      PastAppointmentListPageObject.visit().selectListItem();
      AppointmentDetailPageObject.assertUrl()
        .assertHeading({
          name: /past in.person appointment/i,
          level: 1,
        })
        .assertAfterVisitSummaryError({
          exist: false,
        })
        .assertAfterVisitSummaryPdf({ exist: true, count: 1 });

      cy.axeCheckBestPractice();
    });
  });

  describe('When appointment has retrieval errors', () => {
    it('should display error Alert when all PDFs have retrieval errors', () => {
      mockFeatureToggles({
        vaOnlineSchedulingAddOhAvs: true,
        travelPayViewClaimDetails: true,
      });

      const yesterday = subDays(new Date(), 1);
      const response = new MockAppointmentResponse({
        id: '2',
        cancellable: false,
        localStartTime: yesterday,
        status: APPOINTMENT_STATUS.booked,
        past: true,
        isCerner: true,
        avsPdf: [
          {
            id: '208750417898',
            noteType: 'ambulatory_patient_summary',
            error: 'Error retrieving AVS binary',
          },
        ],
        travelPayClaim: {
          metadata: {
            status: 200,
            success: true,
            message: 'No claims found.',
          },
        },
      });

      mockAppointmentsGetApi({ response: [response] });

      PastAppointmentListPageObject.visit().selectListItem();

      AppointmentDetailPageObject.assertUrl()
        .assertHeading({
          name: /past in.person appointment/i,
          level: 1,
        })
        .assertAfterVisitSummaryError({
          exist: true,
        })
        .assertAfterVisitSummaryPdf({ exist: false });

      cy.axeCheckBestPractice();
    });

    it('should display error Alert AND valid PDFs when mixed errors', () => {
      mockFeatureToggles({
        vaOnlineSchedulingAddOhAvs: true,
        travelPayViewClaimDetails: true,
      });

      const yesterday = subDays(new Date(), 1);
      const response = new MockAppointmentResponse({
        id: '3',
        cancellable: false,
        localStartTime: yesterday,
        status: APPOINTMENT_STATUS.booked,
        past: true,
        isCerner: true,
        avsPdf: [
          {
            id: '208750417899',
            noteType: 'ambulatory_patient_summary',
            error: 'Error retrieving AVS binary',
          },
          {
            id: '208750417900',
            noteType: 'ambulatory_patient_summary',
            binary: 'JVBERi0xLjQK',
          },
        ],
        travelPayClaim: {
          metadata: {
            status: 200,
            success: true,
            message: 'No claims found.',
          },
        },
      });

      mockAppointmentsGetApi({ response: [response] });

      PastAppointmentListPageObject.visit().selectListItem();

      AppointmentDetailPageObject.assertUrl()
        .assertHeading({
          name: /past in.person appointment/i,
          level: 1,
        })
        .assertAfterVisitSummaryError({
          exist: true,
        })
        .assertAfterVisitSummaryPdf({ exist: true, count: 1 });

      cy.axeCheckBestPractice();
    });

    it('should NOT display error when only empty binary errors', () => {
      mockFeatureToggles({
        vaOnlineSchedulingAddOhAvs: true,
        travelPayViewClaimDetails: true,
      });

      const yesterday = subDays(new Date(), 1);
      const response = new MockAppointmentResponse({
        id: '4',
        cancellable: false,
        localStartTime: yesterday,
        status: APPOINTMENT_STATUS.booked,
        past: true,
        isCerner: true,
        avsPdf: [
          {
            id: '208750417893',
            noteType: 'ambulatory_patient_summary',
            error: 'Retrieved empty AVS binary',
          },
        ],
      });

      mockAppointmentsGetApi({ response: [response] });

      PastAppointmentListPageObject.visit().selectListItem();

      AppointmentDetailPageObject.assertUrl()
        .assertAfterVisitSummaryError({
          exist: false,
        })
        .assertAfterVisitSummaryNotAvailable();

      cy.axeCheckBestPractice();
    });
  });

  describe('When appointment has top-level avsError', () => {
    it('should display error Alert AND PDFs when valid PDFs exist', () => {
      mockFeatureToggles({
        vaOnlineSchedulingAddOhAvs: true,
        travelPayViewClaimDetails: true,
      });

      const yesterday = subDays(new Date(), 1);
      const response = new MockAppointmentResponse({
        id: '5',
        cancellable: false,
        localStartTime: yesterday,
        status: APPOINTMENT_STATUS.booked,
        past: true,
        isCerner: true,
        avsError: 'Error retrieving AVS info',
        avsPdf: [
          {
            id: '208750417891',
            noteType: 'ambulatory_patient_summary',
            binary: 'JVBERi0xLjQK',
          },
        ],
        travelPayClaim: {
          metadata: {
            status: 200,
            success: true,
            message: 'No claims found.',
          },
        },
      });

      mockAppointmentsGetApi({ response: [response] });

      PastAppointmentListPageObject.visit().selectListItem();

      AppointmentDetailPageObject.assertUrl()
        .assertHeading({ name: /past in.person appointment/i, level: 1 })
        .assertAfterVisitSummaryError({ exist: true })
        .assertAfterVisitSummaryPdf({ exist: false });

      cy.axeCheckBestPractice();
    });
  });
});
