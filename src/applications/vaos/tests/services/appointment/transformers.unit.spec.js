import moment from 'moment';
import { expect } from 'chai';
import {
  APPOINTMENT_TYPES,
  VIDEO_TYPES,
  APPOINTMENT_STATUS,
} from '../../../utils/constants';
import { transformConfirmedAppointments } from '../../../services/appointment/transformers';
import {
  CANCELLED_APPOINTMENT_SET,
  PAST_APPOINTMENTS_HIDE_STATUS_SET,
  FUTURE_APPOINTMENTS_HIDE_STATUS_SET,
} from '../../../utils/appointment';
import { transformATLASLocation } from '../../../services/location/transformers';

const tomorrow = moment().add(1, 'days');

const appt = {
  id: '22cdc6741c00ac67b6cbf6b972d084c0',
  startDate: tomorrow.toISOString(),
  clinicId: '308',
  clinicFriendlyName: null,
  facilityId: '983',
  communityCare: false,
  vdsAppointments: [
    {
      bookingNote: 'RP test',
      appointmentLength: '60',
      appointmentTime: tomorrow.toISOString(),
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

const ccAppt = {
  id: '8a4888116a45cbe3016a45f482fb0002',
  appointmentRequestId: '8a4888116a45cbe3016a45f482fb0002',
  distanceEligibleConfirmed: true,
  name: { firstName: 'Bob', lastName: 'Belcher' },
  providerPractice: 'Audiologists of Dayton',
  providerPhone: '(703) 345-2400',
  address: {
    street: '123 Main St',
    city: 'dayton',
    state: 'OH',
    zipCode: '45405',
  },
  instructionsToVeteran:
    'Please arrive 20 minutes before the start of your appointment',
  appointmentTime: '02/05/2020 19:30:00',
  timeZone: '-09:00 AKST',
};

const videoAppt = {
  id: '05760f00c80ae60ce49879cf37a05fc8',
  startDate: tomorrow.toISOString(),
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
      dateTime: tomorrow.toISOString(),
      duration: 20,
      status: { description: 'F', code: 'FUTURE' },
      schedulingRequestType: 'NEXT_AVAILABLE_APPT',
      type: 'REGULAR',
      bookingNotes: 'T+90 Testing',
      instructionsOther: false,
      instructionsTitle: 'Medication Review',
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
      tasInfo: {
        confirmationCode: '7VBBCA',
        address: {
          streetAddress: '114 Dewey Ave',
          city: 'Eureka',
          state: 'MT',
          zipCode: '59917',
          country: 'USA',
          longitude: -115.1,
          latitude: 48.8,
          additionalDetails: '',
        },
        siteCode: 9931,
      },
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

      it('should set id', () => {
        expect(data.id).to.equal('22cdc6741c00ac67b6cbf6b972d084c0');
      });

      it('should set status to "booked"', () => {
        expect(data.status).to.equal(APPOINTMENT_STATUS.booked);
      });

      it('should have original status in description', () => {
        expect(data.description).to.equal('NO ACTION TAKEN/TODAY');
      });

      it('should set start date', () => {
        expect(data.start).to.equal(
          tomorrow
            .clone()
            .tz('America/Denver')
            .format(),
        );
      });

      it('should set minutesDuration', () => {
        expect(data.minutesDuration).to.equal(60);
      });

      it('should set comment', () => {
        expect(data.comment).to.equal('RP test');
      });

      it('should set clinic as clinic name', () => {
        expect(data.location.clinicName).to.equal('CHY OPT VAR1');
      });

      it('should return vaos.isCommunityCare', () => {
        expect(data.vaos.isCommunityCare).to.equal(false);
      });

      it('should return vaos.appointmentType', () => {
        expect(data.vaos.appointmentType).to.equal(
          APPOINTMENT_TYPES.vaAppointment,
        );
      });
    });

    describe('community care appointment', () => {
      const data = transformConfirmedAppointments([ccAppt])[0];

      it('should set resourceType', () => {
        expect(data.resourceType).to.equal('Appointment');
      });

      it('should set id', () => {
        expect(data.id).to.equal('8a4888116a45cbe3016a45f482fb0002');
      });

      it('should set status to "booked"', () => {
        expect(data.status).to.equal(APPOINTMENT_STATUS.booked);
      });

      it('should have original status in description', () => {
        expect(data.description).to.equal(null);
      });

      it('should set start date', () => {
        expect(data.start).to.equal('2020-02-05T10:30:00-09:00');
      });

      it('should set minutesDuration', () => {
        expect(data.minutesDuration).to.equal(60);
      });

      it('should set comment', () => {
        expect(data.comment).to.equal(
          'Please arrive 20 minutes before the start of your appointment',
        );
      });

      it('should return vaos.isPastAppointment', () => {
        expect(data.vaos.isPastAppointment).to.equal(
          moment(data.start).isBefore(moment()),
        );
      });

      it('should return vaos.isCommunityCare', () => {
        expect(data.vaos.isCommunityCare).to.equal(true);
      });

      it('should return vaos.appointmentType', () => {
        expect(data.vaos.appointmentType).to.equal(
          APPOINTMENT_TYPES.ccAppointment,
        );
      });
    });

    describe('video appointment', () => {
      const data = transformConfirmedAppointments([videoAppt])[0];

      it('should set resourceType', () => {
        expect(data.resourceType).to.equal('Appointment');
      });

      it('should set id', () => {
        expect(data.id).to.equal('05760f00c80ae60ce49879cf37a05fc8');
      });

      it('should set status to "booked"', () => {
        expect(data.status).to.equal(APPOINTMENT_STATUS.booked);
      });

      it('should have original status in description', () => {
        expect(data.description).to.equal('FUTURE');
      });

      it('should set start date', () => {
        expect(data.start).to.equal(
          tomorrow
            .clone()
            .tz('America/Denver')
            .format(),
        );
      });

      it('should set minutesDuration', () => {
        expect(data.minutesDuration).to.equal(20);
      });

      it('should set comment', () => {
        expect(data.comment).to.equal('Medication Review');
      });

      it('should set video url', () => {
        expect(data.videoData.url).to.equal(
          'https://care2.evn.va.gov/vvc-app/?join=1&media=1&escalate=1&conference=VVC8275247@care2.evn.va.gov&pin=3242949390#',
        );
      });

      it('should return vaos.isPastAppointment', () => {
        expect(data.vaos.isPastAppointment).to.equal(
          moment(data.start).isBefore(moment()),
        );
      });

      it('should return vaos.isCommunityCare', () => {
        expect(data.vaos.isCommunityCare).to.equal(false);
      });

      it('should return vaos.appointmentType', () => {
        expect(data.vaos.appointmentType).to.equal(
          APPOINTMENT_TYPES.vaAppointment,
        );
      });

      it('should return gfe video characteristics', () => {
        const gfeData = transformConfirmedAppointments([
          {
            ...videoAppt,
            vvsAppointments: [
              {
                ...videoAppt.vvsAppointments[0],
                appointmentKind: 'MOBILE_GFE',
              },
            ],
          },
        ])[0];

        expect(gfeData.videoData.kind).to.equal(VIDEO_TYPES.gfe);
      });
      it('should return ATLAS location', () => {
        const { address } = transformATLASLocation(
          videoAppt.vvsAppointments[0].tasInfo,
        );

        expect(data.videoData.atlasLocation.address).to.eql(address);
      });
      it('should return confirmation code', () => {
        expect(data.videoData.atlasConfirmationCode).to.equal('7VBBCA');
      });
    });

    describe('isPastAppointment', () => {
      describe('va appointment', () => {
        describe('should return false if after now', () => {
          const futureAppt = {
            ...appt,
            startDate: moment()
              .add(60, 'minutes')
              .format(),
          };

          const transformed = transformConfirmedAppointments([futureAppt])[0];
          expect(transformed.vaos.isPastAppointment).to.equal(false);
        });

        describe('should return false if less than 60 min ago', () => {
          const futureAppt = {
            ...appt,
            startDate: moment()
              .subtract(55, 'minutes')
              .format(),
          };

          const transformed = transformConfirmedAppointments([futureAppt])[0];
          expect(transformed.vaos.isPastAppointment).to.equal(false);
        });

        describe('should return true if greater than 60 min ago', () => {
          const pastAppt = {
            ...appt,
            startDate: moment()
              .subtract(65, 'minutes')
              .format(),
          };

          const transformed = transformConfirmedAppointments([pastAppt])[0];
          expect(transformed.vaos.isPastAppointment).to.equal(true);
        });

        describe('va video appointment', () => {
          it('should return false after if video and less than 240 min ago', () => {
            const futureAppt = {
              ...videoAppt,
              vvsAppointments: [
                {
                  ...videoAppt.vvsAppointments[0],
                  dateTime: moment()
                    .subtract(235, 'minutes')
                    .format(),
                },
              ],
            };

            const transformed = transformConfirmedAppointments([futureAppt])[0];
            expect(transformed.vaos.isPastAppointment).to.equal(false);
          });

          it('should return true after if video and greater than 240 min ago', () => {
            const pastAppt = {
              ...videoAppt,
              startDate: moment()
                .subtract(245, 'minutes')
                .format(),
            };

            const transformed = transformConfirmedAppointments([pastAppt])[0];
            expect(transformed.vaos.isPastAppointment).to.equal(true);
          });
        });

        it('should use the vvsAppointment id if the appointment id is null', () => {
          const pastAppt = {
            ...videoAppt,
            id: null,
            vvsAppointments: [
              {
                ...videoAppt.vvsAppointments[0],
                dateTime: moment()
                  .subtract(235, 'minutes')
                  .format(),
              },
            ],
          };

          const transformed = transformConfirmedAppointments([pastAppt])[0];
          expect(transformed.id).to.equal(pastAppt.vvsAppointments[0].id);
        });
      });
    });

    describe('appointment status filtering', () => {
      describe('future appointment', () => {
        it('should return cancelled status for cancelled va appointment', () => {
          const cancelledAppts = [...CANCELLED_APPOINTMENT_SET].map(code => ({
            ...appt,
            startDate: moment().add(1, 'day'),
            vvsAppointments: [
              {
                status: { code },
              },
            ],
          }));
          const transformed = transformConfirmedAppointments(cancelledAppts);
          expect(transformed.length).to.equal(4);
          expect(
            transformed.filter(a => a.status === APPOINTMENT_STATUS.cancelled)
              .length,
          ).to.equal(cancelledAppts.length);
        });

        it('should return null for future va appointment if in HIDE_STATUS_SET', () => {
          const nullAppts = [...FUTURE_APPOINTMENTS_HIDE_STATUS_SET].map(
            currentStatus => ({
              ...appt,
              startDate: moment().add(1, 'day'),
              vdsAppointments: [
                {
                  currentStatus,
                },
              ],
            }),
          );
          const transformed = transformConfirmedAppointments(nullAppts);
          expect(transformed.length).to.equal(2);
          expect(transformed.filter(a => a.status === null).length).to.equal(
            nullAppts.length,
          );
        });

        it('should return null for future video appointment if in HIDE_STATUS_SET', () => {
          const nullAppts = [...FUTURE_APPOINTMENTS_HIDE_STATUS_SET].map(
            code => ({
              ...appt,
              startDate: moment().add(1, 'day'),
              vvsAppointments: [
                {
                  status: {
                    code,
                  },
                },
              ],
            }),
          );
          const transformed = transformConfirmedAppointments(nullAppts);
          expect(transformed.length).to.equal(2);
          expect(transformed.filter(a => a.status === null).length).to.equal(
            nullAppts.length,
          );
        });
      });

      describe('past appointment', () => {
        it('should return null for past va appointment if in HIDE_STATUS_SET', () => {
          const startDate = moment().subtract(1, 'day');
          const nullAppts = [...PAST_APPOINTMENTS_HIDE_STATUS_SET].map(
            currentStatus => ({
              ...appt,
              startDate,
              vdsAppointments: [
                {
                  currentStatus,
                },
              ],
            }),
          );
          const transformed = transformConfirmedAppointments(nullAppts);
          expect(transformed.length).to.equal(11);
          expect(transformed.filter(a => a.status === null).length).to.equal(
            nullAppts.length,
          );
        });

        it('should return null for past video appointment if in HIDE_STATUS_SET', () => {
          const dateTime = moment().subtract(30, 'day');
          const nullAppts = [...PAST_APPOINTMENTS_HIDE_STATUS_SET].map(
            code => ({
              ...videoAppt,
              startDate: dateTime,
              vvsAppointments: [
                {
                  dateTime,

                  status: {
                    code,
                  },
                },
              ],
            }),
          );

          const transformed = transformConfirmedAppointments(nullAppts);
          expect(transformed.length).to.equal(11);
          expect(transformed.filter(a => a.status === null).length).to.equal(
            nullAppts.length,
          );
        });
      });
    });
  });
});
