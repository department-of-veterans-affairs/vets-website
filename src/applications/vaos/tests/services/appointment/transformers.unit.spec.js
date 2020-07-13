import moment from 'moment';
import { expect } from 'chai';
import {
  APPOINTMENT_TYPES,
  VIDEO_TYPES,
  APPOINTMENT_STATUS,
  CANCELLED_APPOINTMENT_SET,
  PAST_APPOINTMENTS_HIDE_STATUS_SET,
  FUTURE_APPOINTMENTS_HIDE_STATUS_SET,
} from '../../../utils/constants';
import {
  transformConfirmedAppointments,
  transformPendingAppointments,
} from '../../../services/appointment/transformers';

const now = moment();
const tomorrow = moment().add(1, 'days');

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

const ccPendingAppt = {
  id: '8a4886886e4c8e22016e6613216d001f',
  dataIdentifier: {
    uniqueId: '8a4886886e4c8e22016e6613216d001f',
    systemId: 'var',
  },
  patientIdentifier: {
    uniqueId: '1012845331V153043',
    assigningAuthority: 'ICN',
  },
  surrogateIdentifier: {},
  lastUpdatedDate: '11/13/2019 11:42:40',
  optionDate1: now,
  optionTime1: 'AM',
  optionDate2: tomorrow,
  optionTime2: 'AM',
  optionDate3: 'No Time Selected',
  optionTime3: 'No Time Selected',
  status: 'Submitted',
  appointmentType: 'Audiology (hearing aid support)',
  visitType: 'Office Visit',
  facility: {
    name: 'CHYSHR-CHEYENNE VAMC',
    type: 'M&ROC',
    facilityCode: '983',
    state: 'WY',
    city: 'CHEYENNE',
    address: '2360 EAST PERSHING BLVD',
    parentSiteCode: '983',
    objectType: 'Facility',
    link: [],
  },
  email: 'Vilasini.reddy@va.gov',
  textMessagingAllowed: false,
  phoneNumber: '(555) 555-5555',
  purposeOfVisit: 'routine-follow-up',
  providerId: '0',
  secondRequest: false,
  secondRequestSubmitted: false,
  patient: {
    displayName: 'MORRISON, JUDY',
    firstName: 'JUDY',
    lastName: 'MORRISON',
    dateOfBirth: 'Apr 01, 1953',
    patientIdentifier: {
      uniqueId: '1259897978',
    },
    ssn: '796061976',
    inpatient: false,
    textMessagingAllowed: false,
    id: '1259897978',
    objectType: 'Patient',
    link: [],
  },
  bestTimetoCall: ['Afternoon', 'Evening', 'Morning'],
  appointmentRequestDetailCode: [],
  hasVeteranNewMessage: false,
  hasProviderNewMessage: false,
  providerSeenAppointmentRequest: false,
  requestedPhoneCall: false,
  typeOfCareId: 'CCAUDHEAR',
  friendlyLocationName: 'CHYSHR-Cheyenne VA Medical Center- RR',
  ccAppointmentRequest: {
    dataIdentifier: {},
    patientIdentifier: {},
    surrogateIdentifier: {},
    hasVeteranNewMessage: false,
    preferredState: 'AK',
    preferredCity: 'sadfasdf',
    preferredLanguage: 'English',
    distanceWillingToTravel: 10,
    distanceEligible: false,
    officeHours: ['Weekdays'],
    preferredProviders: [
      {
        firstName: 'Test',
        lastName: 'User',
        practiceName: 'Some practiceSome practiceSome practiceSome practice',
        address: {
          street: 'street',
          city: 'city',
          state: 'state',
          zipCode: '01060',
        },
        preferredOrder: 0,
        providerZipCode: '01060',
        objectType: 'Provider',
        link: [],
      },
    ],
    objectType: 'CCAppointmentRequest',
    link: [],
  },
  patientId: '1259897978',
  date: '2019-11-13T11:42:40.033+0000',
  assigningAuthority: 'ICN',
  systemId: 'var',
  createdDate: '11/13/2019 11:42:40',
  // NOTE: Not sure about this!!!
  // appointmentTime: '02/05/2020 19:30:00',
  // timeZone: '-09:00 AKST',
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

const vaRequest = {
  id: '8a4829dc7281184e017285000ab700cf',
  type: 'appointment_requests',
  facility: {
    type: null,
    address: null,
    name: 'CHYSHR-Cheyenne VA Medical Center',
    facilityCode: '983',
    state: 'WY',
    city: 'Cheyenne',
    parentSiteCode: '983',
  },
  patient: {
    displayName: 'MORRISON, JUDY',
    inpatient: false,
    textMessagingAllowed: false,
  },
  lastUpdatedAt: null,
  createdDate: '06/05/2020 09:01:11',
  appointmentDate: '06/17/2020',
  appointmentTime: 'AM',
  optionDate1: tomorrow,
  optionTime1: 'PM',
  optionDate2: tomorrow,
  optionTime2: 'AM',
  optionDate3: now,
  optionTime3: 'AM',
  status: 'Submitted',
  appointmentType: 'Primary Care',
  visitType: 'Video Conference',
  reasonForVisit: null,
  email: 'aarathi.poldass@va.gov',
  textMessagingAllowed: false,
  phoneNumber: '(999) 999-9999',
  purposeOfVisit: 'New Issue',
  providerId: '0',
  secondRequest: false,
  secondRequestSubmitted: false,
  bestTimetoCall: ['Morning'],
  hasVeteranNewMessage: true,
  hasProviderNewMessage: false,
  providerSeenAppointmentRequest: true,
  requestedPhoneCall: false,
  bookedApptDateTime: '06/17/2020 14:00:00',
  typeOfCareId: '323',
  friendlyLocationName: 'CHYSHR-Cheyenne VA Medical Center',
  ccAppointmentRequest: null,
  date: '2020-06-05T09:01:11.000+0000',
  assigningAuthority: 'ICN',
};

describe('VAOS Appointment transformer', () => {
  describe('transformConfirmedAppointments', () => {
    describe('confirmed in-person', () => {
      const data = transformConfirmedAppointments([appt])[0];

      it('should set resourceType', () => {
        expect(data.resourceType).to.equal('Appointment');
      });

      it('should set id', () => {
        expect(data.id).to.equal('var22cdc6741c00ac67b6cbf6b972d084c0');
      });

      it('should set status to "booked"', () => {
        expect(data.status).to.equal(APPOINTMENT_STATUS.booked);
      });

      it('should have original status in description', () => {
        expect(data.description).to.equal('NO ACTION TAKEN/TODAY');
      });

      it('should set start date', () => {
        expect(data.start).to.equal('2020-12-07T09:00:00-07:00');
      });

      it('should set minutesDuration', () => {
        expect(data.minutesDuration).to.equal(60);
      });

      it('should set comment', () => {
        expect(data.comment).to.equal('RP test');
      });

      it('should set clinic as HealthcareService', () => {
        expect(data.participant[0].actor.reference).to.contain(
          'HealthcareService/var',
        );
        expect(data.participant[0].actor.display).to.equal('CHY OPT VAR1');
      });

      it('should return vaos.videoType', () => {
        expect(data.vaos.videoType).to.equal(null);
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
        expect(data.id).to.equal('var8a4888116a45cbe3016a45f482fb0002');
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

      it('should set provider contact info', () => {
        expect(data.contained[0].actor.name).to.equal('Audiologists of Dayton');
        expect(data.contained[0].actor.address.line[0]).to.equal('123 Main St');
        expect(data.contained[0].actor.address.city).to.equal('dayton');
        expect(data.contained[0].actor.address.state).to.equal('OH');
        expect(data.contained[0].actor.address.postalCode).to.equal('45405');
        expect(data.contained[0].actor.telecom[0].system).to.equal('phone');
        expect(data.contained[0].actor.telecom[0].value).to.equal(
          '(703) 345-2400',
        );
        expect(data.participant[0].actor.display).to.equal('Bob Belcher');
      });

      it('should return vaos.videoType', () => {
        expect(data.vaos.videoType).to.equal(null);
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
        expect(data.id).to.equal('var05760f00c80ae60ce49879cf37a05fc8');
      });

      it('should set status to "booked"', () => {
        expect(data.status).to.equal(APPOINTMENT_STATUS.booked);
      });

      it('should have original status in description', () => {
        expect(data.description).to.equal('FUTURE');
      });

      it('should set start date', () => {
        expect(data.start).to.equal('2020-11-25T08:17:00-07:00');
      });

      it('should set minutesDuration', () => {
        expect(data.minutesDuration).to.equal(20);
      });

      it('should set comment', () => {
        expect(data.comment).to.equal('Medication Review');
      });

      it('should not set clinic as HealthcareService', () => {
        expect(data.participant).to.equal(null);
      });

      it('should set video url in HealthcareService.telecom', () => {
        expect('contained' in data).to.equal(true);
        expect(data.contained[0].resourceType).to.equal('HealthcareService');
        expect(data.contained[0].id).to.contain(
          `var${videoAppt.vvsAppointments[0].id}`,
        );
        expect(data.contained[0].telecom[0].value).to.equal(
          'https://care2.evn.va.gov/vvc-app/?join=1&media=1&escalate=1&conference=VVC8275247@care2.evn.va.gov&pin=3242949390#',
        );
        expect(data.contained[0].telecom[0].period.start).to.equal(data.start);
      });

      it('should return vaos.videoType', () => {
        expect(data.vaos.videoType).to.equal(VIDEO_TYPES.videoConnect);
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

      it('should return vaos.videoType', () => {
        expect(data.vaos.videoType).to.equal(VIDEO_TYPES.videoConnect);
      });

      it('should return gfe videoType', () => {
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
        expect(gfeData.vaos.videoType).to.equal(VIDEO_TYPES.gfe);
      });
    });

    describe('VA Request', () => {
      const data = transformPendingAppointments([vaRequest])[0];

      it('should set resourceType', () => {
        expect(data.resourceType).to.equal('Appointment');
      });

      it('should set id', () => {
        expect(data.id).to.equal('var8a4829dc7281184e017285000ab700cf');
      });

      it('should set status to "pending"', () => {
        expect(data.status).to.equal(APPOINTMENT_STATUS.pending);
      });

      it('should set minutesDuration', () => {
        expect(data.minutesDuration).to.equal(60);
      });

      it('should set reason', () => {
        expect(data.reason).to.equal('New issue');
      });

      it('should set facility as Location in participants', () => {
        const locationActor = data.participant.filter(p =>
          p.actor.reference.includes('Location'),
        )[0];
        expect(locationActor.actor.reference).to.equal('Location/var983');
        expect(locationActor.actor.display).to.equal(
          'CHYSHR-Cheyenne VA Medical Center',
        );
      });

      it('should set patient info in participants', () => {
        const patientActor = data.participant.filter(p =>
          p.actor.reference.includes('Patient'),
        )[0];
        expect(patientActor.actor.display).to.equal('MORRISON, JUDY');
        const telecomPhone = patientActor.actor.telecom.filter(
          t => t.system === 'phone',
        )[0];
        expect(telecomPhone.value).to.equal('(999) 999-9999');
        const telecomEmail = patientActor.actor.telecom.filter(
          t => t.system === 'email',
        )[0];
        expect(telecomEmail.value).to.equal('aarathi.poldass@va.gov');
      });

      it('should return vaos.isCommunityCare', () => {
        expect(data.vaos.isCommunityCare).to.equal(false);
      });

      it('should return vaos.appointmentType', () => {
        expect(data.vaos.appointmentType).to.equal(APPOINTMENT_TYPES.request);
      });

      it('should return vaos.videoType', () => {
        expect(data.vaos.videoType).to.equal('videoConnect');
      });

      it('should set requestedPeriods', () => {
        expect(data.requestedPeriod.length).to.equal(3);
        expect(data.requestedPeriod[0].start).to.equal(
          `${now.format('YYYY-MM-DD')}T00:00:00.000`,
        );
        expect(data.requestedPeriod[0].end).to.equal(
          `${now.format('YYYY-MM-DD')}T11:59:59.999`,
        );
        expect(data.requestedPeriod[1].start).to.equal(
          `${tomorrow.format('YYYY-MM-DD')}T00:00:00.000`,
        );
        expect(data.requestedPeriod[1].end).to.equal(
          `${tomorrow.format('YYYY-MM-DD')}T11:59:59.999`,
        );
        expect(data.requestedPeriod[2].start).to.equal(
          `${tomorrow.format('YYYY-MM-DD')}T12:00:00.000`,
        );
        expect(data.requestedPeriod[2].end).to.equal(
          `${tomorrow.format('YYYY-MM-DD')}T23:59:59.999`,
        );
      });

      it('should set bestTimeToCall', () => {
        expect(data.legacyVAR.bestTimeToCall).to.deep.equal(['Morning']);
      });

      it('should set isExpressCare to false', () => {
        expect(data.vaos.isExpressCare).to.equal(false);
      });

      it('should set express care reasonForVisit and isExpressCare', () => {
        const expressData = transformPendingAppointments([
          { ...vaRequest, typeOfCareId: 'CR1', reasonForVisit: 'some reason' },
        ])[0];

        expect(expressData.reason).to.equal('some reason');
        expect(expressData.vaos.isExpressCare).to.equal(true);
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
          describe('should return false after if video and less than 240 min ago', () => {
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

          describe('should return true after if video and greater than 240 min ago', () => {
            const pastAppt = {
              ...videoAppt,
              vvsAppointments: [
                {
                  ...videoAppt.vvsAppointments[0],
                  dateTime: moment()
                    .subtract(245, 'minutes')
                    .format(),
                },
              ],
            };

            const transformed = transformConfirmedAppointments([pastAppt])[0];
            expect(transformed.vaos.isPastAppointment).to.equal(true);
          });
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

  describe('transformPendingAppointments', () => {
    const data = transformPendingAppointments([ccPendingAppt])[0];

    it('should set resourceType', () => {
      expect(data.resourceType).to.equal('Appointment');
    });

    it('should set id', () => {
      expect(data.id).to.equal('var8a4886886e4c8e22016e6613216d001f');
    });

    it('should set status to "pending"', () => {
      expect(data.status).to.equal(APPOINTMENT_STATUS.pending);
    });

    it('should set appointment type', () => {
      expect(data.type.coding[0].code).to.equal('CCAUDHEAR');
      expect(data.type.coding[0].display).to.equal(
        'Audiology (hearing aid support)',
      );
    });

    it('should set requestedPeriods (FHIR 4.0.1)', () => {
      expect(data.requestedPeriod.length).to.equal(2);

      // NOTE: The array is sorted.
      expect(data.requestedPeriod[0].start).to.equal(
        `${now.format('YYYY-MM-DD')}T00:00:00.000`,
      );
      expect(data.requestedPeriod[0].end).to.equal(
        `${now.format('YYYY-MM-DD')}T11:59:59.999`,
      );
      expect(data.requestedPeriod[1].start).to.equal(
        `${tomorrow.format('YYYY-MM-DD')}T00:00:00.000`,
      );
      expect(data.requestedPeriod[1].end).to.equal(
        `${tomorrow.format('YYYY-MM-DD')}T11:59:59.999`,
      );
    });

    // TODO: Verify no start date for appointment request
    xit('should set start date', () => {
      expect(data.start).to.equal('2020-02-05T10:30:00-09:00');
    });

    it('should set minutesDuration', () => {
      expect(data.minutesDuration).to.equal(60);
    });

    it('should set reasonCode (FHIR 4.0.1)', () => {
      expect(data.reason).to.equal('Follow-up/Routine');
    });

    describe('Appointment participants', () => {
      const locationActor = data.participant.filter(p =>
        p.actor.reference.includes('Location'),
      )[0];
      const patientActor = data.participant.filter(p =>
        p.actor.reference.includes('Patient'),
      )[0];

      describe('should set facility as Location in participants', () => {
        it('should set location reference', () => {
          expect(locationActor.actor.reference).to.equal('Location/var983');
        });

        it('should set the display', () => {
          expect(locationActor.actor.display).to.equal(
            'CHYSHR-Cheyenne VA Medical Center- RR',
          );
        });
      });

      describe('should set patient info in participants', () => {
        it('should set name', () => {
          expect(patientActor.actor.display).to.equal('MORRISON, JUDY');
        });

        it('should set phone', () => {
          const telecomPhone = patientActor.actor.telecom.filter(
            t => t.system === 'phone',
          )[0];
          expect(telecomPhone.value).to.equal('(555) 555-5555');
        });

        it('should set email', () => {
          const telecomEmail = patientActor.actor.telecom.filter(
            t => t.system === 'email',
          )[0];
          expect(telecomEmail.value).to.equal('Vilasini.reddy@va.gov');
        });
      });
    });

    describe('VA custom attributes', () => {
      describe('Contained attributes', () => {
        it('should set provider contact info', () => {
          expect(data.contained[0].actor.name).to.equal(
            'Some practiceSome practiceSome practiceSome practice',
          );
          expect(data.contained[0].actor.firstName).to.equal('Test');
          expect(data.contained[0].actor.lastName).to.equal('User');
        });

        it('should set provider address', () => {
          expect(data.contained[0].actor.address.line[0]).to.equal('street');
          expect(data.contained[0].actor.address.city).to.equal('city');
          expect(data.contained[0].actor.address.state).to.equal('state');
          expect(data.contained[0].actor.address.postalCode).to.equal('01060');
        });
      });
    });

    describe('Legacy VAR attributes', () => {
      it('should set bestTimeToCall', () => {
        expect(data.legacyVAR.apiData.bestTimetoCall).to.deep.equal([
          'Afternoon',
          'Evening',
          'Morning',
        ]);
      });
    });

    describe('VAOS attributes', () => {
      it('should set appointmentType', () => {
        expect(data.vaos.appointmentType).to.equal('ccRequest');
      });

      it('should set isCommunityCare to true', () => {
        expect(data.vaos.isCommunityCare).to.be.true;
      });

      it('should set isExpressCare to false', () => {
        expect(data.vaos.isExpressCare).to.be.false;
      });
    });
  });
});
