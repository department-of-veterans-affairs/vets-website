import { expect } from 'chai';

import {
  selectPendingAppointment,
  selectConfirmedAppointment,
  getFormPageInfo,
  getChosenClinicInfo,
  getTypeOfCare,
  getClinicsForChosenFacility,
  getClinicPageInfo,
  getDateTimeSelect,
  getReasonForAppointment,
  getPreferredDate,
} from '../../utils/selectors';

describe('VAOS selectors', () => {
  describe('selectPendingAppointment', () => {
    it('should return appt matching id', () => {
      const state = {
        appointments: {
          pending: [
            {
              uniqueId: 'testing',
            },
          ],
        },
      };
      const appt = selectPendingAppointment(state, 'testing');
      expect(appt).to.equal(state.appointments.pending[0]);
    });
    it('should return null if no matching id', () => {
      const state = {
        appointments: {
          pending: null,
        },
      };
      const appt = selectPendingAppointment(state, 'testing');
      expect(appt).to.be.null;
    });
  });
  describe('selectConfirmedAppointment', () => {
    it('should return appt matching id', () => {
      const state = {
        appointments: {
          confirmed: [
            {
              appointmentRequestId: 'testing',
            },
          ],
        },
      };
      const appt = selectConfirmedAppointment(state, 'testing');
      expect(appt).to.equal(state.appointments.confirmed[0]);
    });
    it('should return null if no matching id', () => {
      const state = {
        appointments: {
          confirmed: null,
        },
      };
      const appt = selectConfirmedAppointment(state, 'testing');
      expect(appt).to.be.null;
    });
  });
  describe('getFormPageInfo', () => {
    it('should return info needed for form pages', () => {
      const state = {
        newAppointment: {
          pages: {
            testPage: {},
          },
          data: {},
          pageChangeInProgress: false,
        },
      };
      const pageInfo = getFormPageInfo(state, 'testPage');

      expect(pageInfo.pageChangeInProgress).to.equal(
        state.newAppointment.pageChangeInProgress,
      );
      expect(pageInfo.data).to.equal(state.newAppointment.data);
      expect(pageInfo.schema).to.equal(state.newAppointment.pages.testPage);
    });
  });

  describe('getChosenClinicInfo', () => {
    it('should return a stored clinic object', () => {
      const state = {
        newAppointment: {
          data: {
            typeOfCareId: '323',
            vaFacility: '688GB',
            clinicId: '124',
          },
          clinics: {
            '688GB_323': [
              {
                clinicId: '123',
              },
              {
                clinicId: '124',
              },
            ],
          },
        },
      };
      const clinic = getChosenClinicInfo(state);
      expect(clinic.clinicId).to.equal(state.newAppointment.data.clinicId);
    });
  });

  describe('getTypeOfCare', () => {
    it('get audiology type of care', () => {
      const data = {
        typeOfCareId: '203',
        audiologyType: 'CCAUDHEAR',
        facilityType: 'communityCare',
      };

      const typeOfCare = getTypeOfCare(data);
      expect(typeOfCare.id).to.equal('CCAUDHEAR');
    });
  });

  describe('getClinicsForChosenFacility', () => {
    it('should return relevant clinics list', () => {
      const state = {
        newAppointment: {
          data: {
            typeOfCareId: '323',
            vaFacility: '688GB',
          },
          clinics: {
            '688GB_323': [
              {
                clinicId: '123',
              },
              {
                clinicId: '124',
              },
            ],
          },
        },
      };
      const clinics = getClinicsForChosenFacility(state);
      expect(clinics).to.equal(state.newAppointment.clinics['688GB_323']);
    });
  });

  describe('getPreferredDate', () => {
    it('should return info needed for form pages', () => {
      const state = {
        newAppointment: {
          pages: {},
          data: {
            typeOfCareId: '323',
          },
          pageChangeInProgress: false,
        },
      };
      const preferredDate = getPreferredDate(state, 'testPage');

      expect(preferredDate.pageChangeInProgress).to.equal(
        state.newAppointment.pageChangeInProgress,
      );
      expect(preferredDate.data).to.equal(state.newAppointment.data);
      expect(preferredDate.schema).to.equal(
        state.newAppointment.pages.preferredDate,
      );
      expect(preferredDate.typeOfCare).to.equal('Primary care');
    });
  });

  describe('getDateTimeSelect', () => {
    it('should return available dates data and timezone', () => {
      const availableSlots = [
        {
          date: '2019-10-24',
          datetime: '2019-10-24T09:00:00-07:00',
        },
        {
          date: '2019-10-24',
          datetime: '2019-10-24T09:30:00-07:00',
        },
      ];

      const state = {
        newAppointment: {
          pages: {
            selectDateTime: {},
          },
          data: {
            typeOfCareId: '323',
            vaFacility: '983',
          },
          facilities: {
            '323_983': [
              {
                institution: {
                  institutionCode: '983',
                },
                institutionTimezone: 'America/Denver',
              },
            ],
          },
          availableSlots,
        },
      };

      const data = getDateTimeSelect(state, 'selectDateTime');
      expect(data.timezone).to.be.oneOf(['MST', 'MDT']);
      expect(data.availableDates).to.eql(['2019-10-24']);
      expect(data.availableSlots).to.eql(availableSlots);
    });
  });

  describe('getReasonForAppointment', () => {
    it('should return reason data and remaining characters for textarea', () => {
      const data = {
        reasonForAppointment: 'new-issue',
        reasonAdditionalInfo: 'test',
      };

      const state = {
        newAppointment: {
          pages: {
            reasonForAppointment: {},
          },
          data,
          reasonRemainingChar: 130,
        },
      };

      const pageInfo = getReasonForAppointment(state, 'reasonForAppointment');
      expect(pageInfo.data).to.eql(data);
      expect(pageInfo.reasonRemainingChar).to.equal(130);
    });
  });

  describe('getClinicPageInfo', () => {
    it('should return info needed for then clinic page', () => {
      const state = {
        newAppointment: {
          pages: {},
          data: {
            typeOfCareId: '323',
          },
          pageChangeInProgress: false,
          clinics: {},
        },
      };
      const pageInfo = getClinicPageInfo(state, 'clinicChoice');

      expect(pageInfo.pageChangeInProgress).to.equal(
        state.newAppointment.pageChangeInProgress,
      );
      expect(pageInfo.data).to.equal(state.newAppointment.data);
      expect(pageInfo.schema).to.equal(state.newAppointment.pages.clinicChoice);
      expect(pageInfo.typeOfCare).to.deep.equal({
        id: '323',
        ccId: 'CCPRMYRTNE',
        group: 'primary',
        name: 'Primary care',
      });
    });
  });
});
