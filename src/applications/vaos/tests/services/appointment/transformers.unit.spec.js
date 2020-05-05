import { expect } from 'chai';
import { transformConfirmedAppointments } from '../../../services/appointment/transformers';

const appt = {
  id: '22cdc6741c00ac67b6cbf6b972d084c0',
  startDate: '2020-12-07T16:00:00Z',
  clinicId: '308',
  clinicFriendlyName: null,
  facilityId: '983',
  communityCare: false,
  vdsAppointments: [
    {
      bookingNote: 'RP test',
      appointmentLength: '60',
      appointmentTime: '2020-12-07T16:00:00Z',
      clinic: {
        name: 'CHY OPT VAR1',
        askForCheckIn: false,
        facilityCode: '983',
      },
      type: 'REGULAR',
      currentStatus: 'NO ACTION TAKEN/TODAY',
    },
  ],
  vvsAppointments: [],
};

const videoAppt = {
  id: '05760f00c80ae60ce49879cf37a05fc8',
  startDate: '2020-11-25T15:17:00Z',
  clinicId: null,
  clinicFriendlyName: null,
  facilityId: '983',
  communityCare: false,
  vdsAppointments: [],
  vvsAppointments: [
    {
      id: '8a74bdfa-0e66-4848-87f5-0d9bb413ae6d',
      appointmentKind: 'ADHOC',
      sourceSystem: 'SM',
      dateTime: '2020-11-25T15:17:00Z',
      duration: 20,
      status: { description: 'F', code: 'FUTURE' },
      schedulingRequestType: 'NEXT_AVAILABLE_APPT',
      type: 'REGULAR',
      bookingNotes: 'T+90 Testing',
      instructionsOther: false,
      patients: [
        {
          name: { firstName: 'JUDY', lastName: 'MORRISON' },
          contactInformation: {
            mobile: '7036520000',
            preferredEmail: 'marcy.nadeau@va.gov',
          },
          location: {
            type: 'NonVA',
            facility: {
              name: 'CHEYENNE VAMC',
              siteCode: '983',
              timeZone: '10',
            },
          },
          patientAppointment: true,
          virtualMeetingRoom: {
            conference: 'VVC8275247',
            pin: '3242949390#',
            url:
              'https://care2.evn.va.gov/vvc-app/?join=1&media=1&escalate=1&conference=VVC8275247@care2.evn.va.gov&pin=3242949390#',
          },
        },
      ],
      providers: [
        {
          name: { firstName: 'Test T+90', lastName: 'Test' },
          contactInformation: {
            mobile: '8888888888',
            preferredEmail: 'marcy.nadeau@va.gov',
            timeZone: '10',
          },
          location: {
            type: 'VA',
            facility: {
              name: 'CHEYENNE VAMC',
              siteCode: '983',
              timeZone: '10',
            },
          },
          virtualMeetingRoom: {
            conference: 'VVC8275247',
            pin: '7172705#',
            url:
              'https://care2.evn.va.gov/vvc-app/?name=Test%2CTest+T%2B90&join=1&media=1&escalate=1&conference=VVC8275247@care2.evn.va.gov&pin=7172705#',
          },
        },
      ],
    },
  ],
};

describe('VAOS Appointment transformer', () => {
  describe('transformConfirmedAppointments', () => {
    describe('confirmed in-person', () => {
      const data = transformConfirmedAppointments([appt])[0];

      it('should set resourceType', () => {
        expect(data.resourceType).to.equal('Appointment');
      });

      it('should map id', () => {
        expect(data.id).to.equal('var22cdc6741c00ac67b6cbf6b972d084c0');
      });

      it('should set status to "booked"', () => {
        expect(data.status).to.equal('booked');
      });

      it('should set start and end dates', () => {
        expect(data.start).to.equal('2020-12-07T09:00:00-07:00');
        expect(data.end).to.equal('2020-12-07T10:00:00-07:00');
      });

      it('should set minutesDuration', () => {
        expect(data.minutesDuration).to.equal(60);
      });

      it('should set facility as Location', () => {
        expect(data.participant[0].actor.reference).to.contain('Location/var');
      });

      it('should set clinic as HealthcareService', () => {
        expect(data.participant[1].actor.reference).to.contain(
          'HealthcareService/var',
        );
        expect(data.participant[1].actor.display).to.equal('CHY OPT VAR1');
      });
    });

    describe('video appointment', () => {
      const data = transformConfirmedAppointments([videoAppt])[0];

      it('should set resourceType', () => {
        expect(data.resourceType).to.equal('Appointment');
      });

      it('should map id', () => {
        expect(data.id).to.equal('var05760f00c80ae60ce49879cf37a05fc8');
      });

      it('should set status to "booked"', () => {
        expect(data.status).to.equal('booked');
      });

      it('should set start and end dates', () => {
        expect(data.start).to.equal('2020-11-25T08:17:00-07:00');
        expect(data.end).to.equal('2020-11-25T08:37:00-07:00');
      });

      it('should set minutesDuration', () => {
        expect(data.minutesDuration).to.equal(20);
      });

      it('should set facility as Location', () => {
        expect(data.participant[0].actor.reference).to.contain('Location/var');
      });

      it('should set clinic as HealthcareService', () => {
        expect(data.participant[1].actor.reference).to.contain(
          'HealthcareService/var',
        );
      });

      it('should set video url in HealthcareService.telecom', () => {
        expect(data.participant[1].actor.telecom[0].value).to.equal(
          'https://care2.evn.va.gov/vvc-app/?join=1&media=1&escalate=1&conference=VVC8275247@care2.evn.va.gov&pin=3242949390#',
        );
      });
    });
  });
});
