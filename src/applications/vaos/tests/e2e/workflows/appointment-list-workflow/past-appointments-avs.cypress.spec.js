/* eslint-disable no-plusplus */
// @ts-check
import debug from 'debug';
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

const d = debug('vaos:avs-spec');

describe('VAOS past appointment AVS flow', () => {
  beforeEach(() => {
    vaosSetup();
    mockVamcEhrApi();
    cy.login(new MockUser());
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
      AppointmentDetailPageObject.assertAfterVisitSummaryError({
        exist: false,
      }).assertAfterVisitSummaryPdf({ exist: true, count: 1 });

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
      d('Mocking appointment response with AVS retrieval error', {
        response,
      });
      mockAppointmentsGetApi({ response: [response] });

      PastAppointmentListPageObject.visit().selectListItem();

      AppointmentDetailPageObject.assertAfterVisitSummaryError({
        exist: true,
      }).assertAfterVisitSummaryPdf({ exist: false });

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

      AppointmentDetailPageObject.assertAfterVisitSummaryError({
        exist: true,
      }).assertAfterVisitSummaryPdf({ exist: true, count: 1 });

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

      AppointmentDetailPageObject.assertAfterVisitSummaryError({
        exist: false,
      }).assertAfterVisitSummaryNotAvailable();

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

      AppointmentDetailPageObject.assertAfterVisitSummaryError({
        exist: true,
      }).assertAfterVisitSummaryPdf({ exist: false });

      cy.axeCheckBestPractice();
    });
  });
});
