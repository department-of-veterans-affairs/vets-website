import { expect } from 'chai';
import moment from 'moment';
import React from 'react';
// import ReactDOMServer from 'react-dom/server';
import {
  filterFutureConfirmedAppointments,
  filterRequests,
  generateICS,
  getAppointmentAddress,
  getAppointmentDate,
  getAppointmentDateTime,
  getAppointmentDuration,
  getAppointmentInstructions,
  getAppointmentInstructionsHeader,
  getAppointmentLocation,
  getAppointmentTimezoneAbbreviation,
  getAppointmentTitle,
  getAppointmentType,
  getAppointmentTypeHeader,
  getLocationHeader,
  getMomentConfirmedDate,
  getMomentRequestOptionDate,
  getPurposeOfVisit,
  getRealFacilityId,
  getRequestDateOptions,
  getRequestTimeToCall,
  getStagingId,
  getVideoVisitLink,
  hasInstructions,
  isCommunityCare,
  isGFEVideoVisit,
  isVideoVisit,
  lowerCase,
  sentenceCase,
  sortFutureConfirmedAppointments,
  sortFutureRequests,
  titleCase,
} from '../../utils/appointment';
import { APPOINTMENT_TYPES } from '../../utils/constants';

describe('VAOS appointment helpers', () => {
  const now = moment();
  const communityCareAppointmentRequest = {
    typeOfCareId: 'CC',
    timeZone: '-06:00 MDT',
  };
  const vaAppointmentRequest = {
    optionDate1: ' ',
  };
  const vaAppointment = {
    clinicId: ' ',
    vvsAppointments: ' ',
  };
  const communityCareAppointment = {
    appointmentTime: ' ',
    timeZone: '-04:00 EDT',
  };

  describe('getAppointmentType', () => {
    it('should return community care appointment request type', () => {
      expect(getAppointmentType(communityCareAppointmentRequest)).to.equal(
        APPOINTMENT_TYPES.ccRequest,
      );
    });

    it('should return appointment request type', () => {
      expect(getAppointmentType(vaAppointmentRequest)).to.equal(
        APPOINTMENT_TYPES.request,
      );
    });

    it('should return VA appointment type', () => {
      expect(getAppointmentType(vaAppointment)).to.equal(
        APPOINTMENT_TYPES.vaAppointment,
      );
    });

    it('should return community care appointment type', () => {
      expect(getAppointmentType(communityCareAppointment)).to.equal(
        APPOINTMENT_TYPES.ccAppointment,
      );
    });
  });

  describe('isCommunityCare', () => {
    it('should return true for CC request', () => {
      const appt = {
        typeOfCareId: 'CC',
      };
      expect(isCommunityCare(appt)).to.be.true;
    });

    it('should return true CC appointments', () => {
      const appt = {
        appointmentTime: ' ',
      };
      expect(isCommunityCare(appt)).to.be.true;
    });
  });

  describe('isGFEVideoVisit', () => {
    const appt = {
      vvsAppointments: [
        {
          appointmentKind: 'MOBILE_GFE',
        },
      ],
    };
    it('should be true', () => {
      expect(isGFEVideoVisit(appt)).to.be.true;
    });
  });

  describe('isVideoVisit', () => {
    const appt = {
      vvsAppointments: [
        {
          appointmentKind: 'MOBILE_GFE',
        },
      ],
    };
    it('should be true', () => {
      expect(isVideoVisit(appt)).to.be.true;
    });
  });

  describe('getVideoVisitLink', () => {
    const appt = {
      vvsAppointments: [
        {
          patients: [
            {
              virtualMeetingRoom: {
                url: 'https://va.gov',
              },
            },
          ],
        },
      ],
    };
    it('should be true', () => {
      expect(getVideoVisitLink(appt)).to.equal('https://va.gov');
    });
  });

  describe('getStagingId', () => {
    it('should return the staging id for not production environemnts', () => {
      expect(getStagingId('983')).to.equal('442');
      expect(getStagingId('984')).to.equal('984');
    });
  });

  describe('titleCase', () => {
    it('should return capitalize the 1st letter of each word in a sentence', () => {
      expect(titleCase('THE cOw jumpeD over the moon')).to.equal(
        'The Cow Jumped Over The Moon',
      );
    });
  });

  describe('sentenceCase', () => {
    it('should return a string in sentence case', () => {
      expect(sentenceCase('Apples and Oranges')).to.equal('Apples and oranges');
    });

    it('should ignore capital words', () => {
      expect(sentenceCase('MOVE! Weight Management')).to.equal(
        'MOVE! weight management',
      );
    });
  });

  describe('lowerCase', () => {
    it('should lower the case of each word in a sentence', () => {
      expect(lowerCase('The cOW jumpeD Over tHe moon')).to.equal(
        'the cow jumped over the moon',
      );
    });
    it('should ignore capital words', () => {
      expect(lowerCase('The COW jumpeD Over tHe moon')).to.equal(
        'the COW jumped over the moon',
      );
    });
  });

  describe('getLocationHeader', () => {
    it('should return location header for community care request', () => {
      expect(getLocationHeader(communityCareAppointmentRequest)).to.equal(
        `Preferred provider`,
      );
    });

    it('should return location header for community care appointment', () => {
      const appt = {
        ...communityCareAppointment,
        providerPractice: 'Provider Practice',
      };
      expect(getLocationHeader(appt)).to.equal('Provider Practice');
    });

    it('should return location header for appointment request (Friendly Location Name)', () => {
      const appt = {
        ...vaAppointmentRequest,
        friendlyLocationName: 'Friendly Location Name',
      };
      expect(getLocationHeader(appt)).to.equal('Friendly Location Name');
    });

    it('should return location header for appointment request (Facility Name)', () => {
      const appt = {
        ...vaAppointmentRequest,
        facility: {
          name: 'Facility Name',
        },
      };
      expect(getLocationHeader(appt)).to.equal('Facility Name');
    });

    it('should return default location header (Clinic Friendly Name)', () => {
      const appt = {
        clinicFriendlyName: 'Clinic Friendly Name',
      };
      expect(getLocationHeader(appt)).to.equal('Clinic Friendly Name');
    });

    it('should return default location header (Clinic Name)', () => {
      const appt = {
        vdsAppointments: [
          {
            clinic: {
              name: 'Clinic Name',
            },
          },
        ],
      };
      expect(getLocationHeader(appt)).to.equal('Clinic Name');
    });
  });

  describe('getAppointmentTitle', () => {
    it('should return title for CC', () => {
      const id = getAppointmentTitle({
        appointmentTime: '1234',
        providerPractice: 'Test Practice',
      });
      expect(id).to.equal('Community Care appointment');
    });

    it('should return title for video appt', () => {
      const id = getAppointmentTitle({
        vvsAppointments: [
          {
            id: '1234',
            providers: {
              provider: [
                {
                  name: {
                    firstName: 'FIRST',
                    lastName: 'LAST',
                  },
                },
              ],
            },
          },
        ],
      });
      expect(id).to.equal('VA Video Connect');
    });

    it('should return title for VA facility appt', () => {
      const id = getAppointmentTitle({
        vdsAppointments: [
          {
            clinic: {
              name: 'UNREADABLE NAME',
            },
          },
        ],
      });
      expect(id).to.equal('VA visit');
    });
  });

  describe('getAppointmentLocation', () => {
    it('should return appointment location for video conference', () => {
      expect(
        getAppointmentLocation({
          vvsAppointments: [
            {
              appointmentKind: 'MOBILE_GFE',
            },
          ],
        }),
      ).to.equal('Video conference');
    });

    it('should return appointment location for community care appointment', () => {
      const component = getAppointmentLocation({
        ...communityCareAppointment,
        address: {
          street: 'street',
          city: 'city',
          state: 'state',
          zipCode: 'zipcode',
        },
      });

      expect(React.isValidElement(component)).to.be.true;
    });

    it('should return "Not specified" for community care appointment request', () => {
      expect(
        getAppointmentLocation({
          ...communityCareAppointmentRequest,
        }),
      ).to.equal('Not specified');
    });

    it('should return appointment location for community care appointment', () => {
      const component = getAppointmentLocation({
        ...communityCareAppointmentRequest,
        ccAppointmentRequest: {
          preferredProviders: [
            {
              firstName: 'first name',
              lastName: 'last name',
              practiceName: 'practice name',
            },
          ],
        },
      });

      expect(React.isValidElement(component)).to.be.true;
    });

    it('should return appointment location for VA appointment', () => {
      const component = getAppointmentLocation({
        ...vaAppointment,
        vvsAppointments: [],
      });
      expect(React.isValidElement(component)).to.be.true;
    });

    it('should return appointment location for a facility', () => {
      const component = getAppointmentLocation(vaAppointmentRequest, {
        address: {
          physical: ' ',
          phone: {
            main: ' ',
          },
        },
      });

      expect(React.isValidElement(component)).to.be.true;
    });

    it('should return appointment location for a VA appointment request', () => {
      const component = getAppointmentLocation({
        ...vaAppointmentRequest,
        facility: {
          facilityCode: '983',
        },
      });
      expect(React.isValidElement(component)).to.be.true;
    });

    it('should return appointment location for a community care appointment request', () => {
      const component = getAppointmentLocation({
        ...communityCareAppointmentRequest,
        facilityId: '983',
        ccAppointmentRequest: {
          preferredProviders: [{}],
        },
      });
      expect(React.isValidElement(component)).to.be.true;
    });
  });

  // NOTE: Can't do negative test since app assumes data is valid. This will result
  // in a nasty subtle bug when startDate or dateTime is undefined. moment(undefined)
  // is the same as moment() which returns the current date and time.
  describe('getMomentConfirmedDate', () => {
    it('should return a "moment.js" date object', () => {
      const confirmedDate = getMomentConfirmedDate(
        communityCareAppointmentRequest,
      );
      expect(moment.isMoment(confirmedDate)).to.be.true;
    });

    it('should return appointment date object for CC appointment', () => {
      const appt = {
        ...communityCareAppointmentRequest,
        appointmentTime: '12/13/2019 17:11:00',
      };
      expect(getMomentConfirmedDate(appt).format()).to.equal(
        '2019-12-13T11:11:00-06:00',
      );
    });

    describe('should return a "moment.js" date object for video visit appointment (timezone)', () => {
      it('vvsAppointments defined', () => {
        const appt = {
          // facilityId implies timezone
          facilityId: '983',
          vvsAppointments: [
            {
              dateTime: now,
              appointmentKind: 'MOBILE_GFE',
            },
          ],
        };
        expect(getMomentConfirmedDate(appt)).to.deep.equal(
          now.clone().tz('America/Denver'),
        );
      });

      it('startDate defined', () => {
        const appt = {
          // facilityId implies timezone
          facilityId: '578',
          startDate: now,
        };
        expect(getMomentConfirmedDate(appt)).to.deep.equal(
          now.clone().tz('America/Chicago'),
        );
      });
    });

    describe('should return a "moment.js" date object for video visit appointment (no timezone)', () => {
      it('vvsAppointments defined', () => {
        const appt = {
          vvsAppointments: [
            {
              dateTime: now,
              appointmentKind: 'MOBILE_GFE',
            },
          ],
        };
        expect(getMomentConfirmedDate(appt)).to.deep.equal(now);
      });

      it('startDate defined', () => {
        const appt = {
          startDate: now,
        };
        expect(getMomentConfirmedDate(appt)).to.deep.equal(now);
      });
    });
  });

  describe('getMomentRequestOptionDate', () => {
    it('should return a moment.js object', () => {
      const dt = getMomentRequestOptionDate(now);
      expect(moment.isMoment(dt)).to.be.true;
    });
  });

  describe('getAppointmentTimezoneAbbreviation', () => {
    it('should return the timezone for a community care appointment', () => {
      expect(
        getAppointmentTimezoneAbbreviation({
          ...communityCareAppointment,
          timeZone: '-04:00 EDT',
        }),
      ).to.equal('ET');
    });

    it('should return the timezone for a community care appointment request', () => {
      expect(
        getAppointmentTimezoneAbbreviation({
          ...communityCareAppointmentRequest,
          facility: {
            facilityCode: '578',
          },
        }),
      ).to.equal('CT');
    });

    it('should return the timezone for a VA appointment', () => {
      expect(
        getAppointmentTimezoneAbbreviation({
          ...vaAppointment,
          facilityId: '578',
        }),
      ).to.equal('CT');
    });

    it('should return the timezone for a VA appointment request', () => {
      expect(
        getAppointmentTimezoneAbbreviation({
          ...vaAppointmentRequest,
          facility: {
            facilityCode: '983',
          },
        }),
      ).to.equal('MT');
    });

    it('should return empty string for invalid appointment', () => {
      expect(getAppointmentTimezoneAbbreviation({})).to.equal('');
    });
  });

  describe('getAppointmentDate', () => {
    it('should return appointment date', () => {
      expect(
        getAppointmentDate({
          ...communityCareAppointment,
          appointmentTime: now,
        }),
      ).to.equal(now.format('MMMM D, YYYY'));
    });
  });

  describe('getAppointmentDateTime', () => {
    it('should return valid JSX markup', () => {
      const component = getAppointmentDateTime({
        ...communityCareAppointment,
        appointmentTime: now,
      });
      // console.log(ReactDOMServer.renderToString(component));
      expect(React.isValidElement(component)).to.be.true;
    });
  });

  describe('getRequestDateOptions', () => {
    it('should return valid JSX component', () => {
      const component = getRequestDateOptions({
        optionDate1: now,
        optionTime1: 'AM',
        optionDate2: now,
        optionTime2: 'PM',
        optionDate3: moment().add(1, 'days'),
        optionTime3: 'PM',
      });
      // console.log(ReactDOMServer.renderToString(component));
      expect(React.isValidElement(component[0])).to.be.true;
    });
  });

  describe('getRequestTimeToCall', () => {
    it('should return "Call in the morning"', () => {
      expect(
        getRequestTimeToCall({ bestTimetoCall: ['In the morning'] }),
      ).to.equal('Call in the morning');
    });

    it('should return "Call in the evening"', () => {
      expect(
        getRequestTimeToCall({ bestTimetoCall: ['In the evening'] }),
      ).to.equal('Call in the evening');
    });

    it('should return "Call in the morning or in the evening"', () => {
      expect(
        getRequestTimeToCall({
          bestTimetoCall: ['In the morning', 'In the evening'],
        }),
      ).to.equal('Call in the morning or in the evening');
    });

    it('should return "Call in the morning, in the afternoon, or in the evening"', () => {
      expect(
        getRequestTimeToCall({
          bestTimetoCall: [
            'In the morning',
            'In the afternoon',
            'In the evening',
          ],
        }),
      ).to.equal('Call in the morning, in the afternoon, or in the evening');
    });

    it('should return null', () => {
      expect(getRequestTimeToCall({ bestTimetoCall: [] })).to.be.null;
    });
  });

  describe('filterFutureConfirmedAppointments', () => {
    it('should filter future confirmed appointments', () => {
      const confirmed = [
        { startDate: '2099-04-30T05:35:00', facilityId: '984' },
        // appointment 30 min ago should show
        {
          startDate: now
            .clone()
            .subtract(30, 'minutes')
            .format(),
          facilityId: '984',
        },
        // appointment more than 1 hour ago should not show
        {
          startDate: now
            .clone()
            .subtract(65, 'minutes')
            .format(),
          facilityId: '984',
        },
        // video appointment less than 4 hours ago should show
        {
          vvsAppointments: [
            {
              dateTime: now
                .clone()
                .subtract(230, 'minutes')
                .format(),
            },
          ],
          facilityId: '984',
        },
        // video appointment more than 4 hours ago should not show
        {
          vvsAppointments: [
            {
              dateTime: now
                .clone()
                .subtract(245, 'minutes')
                .format(),
            },
          ],
          facilityId: '984',
        },
      ];

      const filteredConfirmed = confirmed.filter(a =>
        filterFutureConfirmedAppointments(a, now),
      );
      expect(filteredConfirmed.length).to.equal(3);
    });
  });

  describe('sortFutureConfirmedAppointments', () => {
    it('should sort future confirmed appointments', () => {
      const confirmed = [
        { startDate: '2099-04-30T05:35:00', facilityId: '984' },
        { startDate: '2099-04-27T05:35:00', facilityId: '984' },
      ];

      const sorted = confirmed.sort(sortFutureConfirmedAppointments);
      expect(sorted[0].startDate).to.equal('2099-04-27T05:35:00');
    });
  });

  describe('filterRequests', () => {
    it('should filter future requests', () => {
      const requests = [
        {
          status: 'Booked',
          appointmentType: 'Primary Care',
          optionDate1: now
            .clone()
            .add(2, 'days')
            .format('MM/DD/YYYY'),
        },
        {
          attributes: {
            status: 'Submitted',
            appointmentType: 'Primary Care',
            optionDate1: now
              .clone()
              .add(-2, 'days')
              .format('MM/DD/YYYY'),
          },
        },
        {
          status: 'Submitted',
          appointmentType: 'Primary Care',
          optionDate1: now
            .clone()
            .add(2, 'days')
            .format('MM/DD/YYYY'),
        },
        {
          status: 'Cancelled',
          appointmentType: 'Primary Care',
          optionDate1: now
            .clone()
            .add(3, 'days')
            .format('MM/DD/YYYY'),
        },
      ];

      const filteredRequests = requests.filter(r => filterRequests(r, now));
      expect(filteredRequests.length).to.equal(2);
    });
  });

  describe('sortFutureRequests', () => {
    it('should sort future requests', () => {
      const requests = [
        {
          appointmentType: 'Primary Care',
          optionDate1: '12/13/2019',
        },
        {
          appointmentType: 'Primary Care',
          optionDate1: '12/12/2019',
        },
        {
          appointmentType: 'Audiology (hearing aid support)',
          optionDate1: '12/12/2019',
        },
      ];

      const sortedRequests = requests.sort(sortFutureRequests);
      expect(sortedRequests[0].appointmentType).to.equal(
        'Audiology (hearing aid support)',
      );
      expect(sortedRequests[1].appointmentType).to.equal('Primary Care');
      expect(sortedRequests[1].optionDate1).to.equal('12/12/2019');
      expect(sortedRequests[2].appointmentType).to.equal('Primary Care');
      expect(sortedRequests[2].optionDate1).to.equal('12/13/2019');
    });
  });

  xdescribe('sortMessages', () => {});

  describe('getRealFacilityId', () => {
    it('should return the real facility id for not production environemnts', () => {
      expect(getRealFacilityId('983')).to.equal('442');
      expect(getRealFacilityId('984')).to.equal('552');
    });
  });

  describe('getAppointmentInstructions', () => {
    it('should return community care appointment instructions', () => {
      const appt = {
        ...communityCareAppointment,
        instructionsToVeteran: 'Instruction to veteran',
      };
      expect(getAppointmentInstructions(appt)).to.equal(
        'Instruction to veteran',
      );
    });

    it('should return 1st VA appointment booking note when vdsAppointment is defined', () => {
      const appt = {
        ...vaAppointment,
        vdsAppointments: [
          {
            bookingNote: 'Header: Note1: Note2',
          },
        ],
      };
      expect(getAppointmentInstructions(appt)).to.equal('Note1');
    });

    it('should return 1st VA appointment booking note when vvsAppointment is defined', () => {
      const appt = {
        ...vaAppointment,
        vvsAppointments: [
          {
            bookingNotes: 'Header: Note1: Note2',
          },
        ],
      };
      expect(getAppointmentInstructions(appt)).to.equal('Note1');
    });

    it('should return no appointment booking notes when vdsAppointment and vvsAppointment is not defined', () => {
      expect(getAppointmentInstructions(vaAppointment)).to.equal('');
    });

    it('should return no appointment booking notes for VA appointment request', () => {
      expect(getAppointmentInstructions(vaAppointmentRequest)).to.equal('');
    });

    it('should return no appointment booking notes for community care appointment request', () => {
      expect(
        getAppointmentInstructionsHeader(communityCareAppointmentRequest),
      ).to.equal('');
    });
  });

  describe('getAppointmentInstructionsHeader', () => {
    it('should return instruction header for VA appointment when vdsAppointment is defined', () => {
      const appt = {
        ...vaAppointment,
        vdsAppointments: [
          {
            bookingNote: 'Header:  Note1: Note2: Note3',
          },
        ],
      };

      expect(getAppointmentInstructionsHeader(appt)).to.equal('Header');
    });

    it('should return instruction header for VA appointment when vvsAppointment is defined', () => {
      const appt = {
        ...vaAppointment,
        vvsAppointments: [
          {
            bookingNotes: 'Header: Note1: Note2: Note3',
          },
        ],
      };
      expect(getAppointmentInstructionsHeader(appt)).to.equal('Header');
    });

    it('should return instruction header for community care appointment', () => {
      expect(
        getAppointmentInstructionsHeader(communityCareAppointment),
      ).to.equal('Special instructions');
    });

    it('should return no instruction header for VA appointment request', () => {
      expect(getAppointmentInstructionsHeader(vaAppointmentRequest)).to.equal(
        '',
      );
    });

    it('should return no instruction header for community care appointment request', () => {
      expect(
        getAppointmentInstructionsHeader(communityCareAppointmentRequest),
      ).to.equal('');
    });
  });

  describe('hasInstructions', () => {
    it('should return true when instructionToVeteran is defined', () => {
      expect(
        hasInstructions({ instructionsToVeteran: 'Instructions to veteran' }),
      ).to.be.true;
    });

    it('should return true when vdsAppointments is defined', () => {
      expect(
        hasInstructions({
          vdsAppointments: [{ bookingNote: 'Follow-up/Routine' }],
        }),
      ).to.be.true;
    });

    it('should return true when vvsAppointments is defined', () => {
      expect(
        hasInstructions({
          vvsAppointments: [{ bookingNotes: 'Follow-up/Routine' }],
        }),
      ).to.be.true;
    });
  });

  describe('getPurposeOfVisit', () => {
    it('should return purpose of visit for community care appointment request', () => {
      expect(
        getPurposeOfVisit({
          ...communityCareAppointmentRequest,
          purposeOfVisit: 'routine-follow-up',
        }),
      ).to.equal('Follow-up/Routine');
    });

    it('should return purpose of visit for VA appointment request', () => {
      const appt = {
        ...vaAppointmentRequest,
        purposeOfVisit: 'Routine Follow-up',
      };
      expect(getPurposeOfVisit(appt)).to.equal('Follow-up/Routine');
    });

    it('should return default purpose of visit', () => {
      expect(
        getPurposeOfVisit({ purposeOfVisit: 'Default purpose of visit' }),
      ).to.equal('Default purpose of visit');
    });
  });

  describe('getAppointmentTypeHeader', () => {
    it('should return "Community Care" header for community care appointments', () => {
      expect(
        getAppointmentTypeHeader({ ...communityCareAppointment }),
      ).to.equal('Community Care');
    });

    it('should return "Community Care" header for community care appointment requests', () => {
      expect(
        getAppointmentTypeHeader({ ...communityCareAppointmentRequest }),
      ).to.equal('Community Care');
    });

    it('should return "VA Appointment" header for VA appointment request', () => {
      expect(
        getAppointmentTypeHeader({
          ...vaAppointmentRequest,
        }),
      ).to.equal('VA Appointment');
    });

    it('should return "VA Video Connect" header for VA appointment request', () => {
      expect(
        getAppointmentTypeHeader({
          ...vaAppointmentRequest,
          visitType: 'Video Conference',
        }),
      ).to.equal('VA Video Connect');
    });

    it('should return "VA Appointment" header for VA appointments', () => {
      expect(
        getAppointmentTypeHeader({
          clinicId: ' ',
        }),
      ).to.equal('VA Appointment');
    });

    it('should return "VA Video Connect" header for VA appointments', () => {
      expect(
        getAppointmentTypeHeader({
          ...vaAppointment,
        }),
      ).to.equal('VA Video Connect');
    });

    it('should return default appointment type header', () => {
      expect(
        getAppointmentTypeHeader({ purposeOfVisit: 'Purpose of visit' }),
      ).to.equal('Purpose of visit');
    });
  });

  describe('getAppointmentDuration', () => {
    it('should return the default appointment duration', () => {
      expect(getAppointmentDuration({})).to.equal(60);
    });
    it('should return the appointment duration for VA appointment', () => {
      expect(
        getAppointmentDuration({
          ...vaAppointment,
          vdsAppointments: [{ appointmentLength: 30 }],
        }),
      ).to.equal(30);
    });
  });

  describe('getAppointmentAddress', () => {
    it('should return address for video appointment', () => {
      const appt = {
        vvsAppointments: [
          {
            dateTime: now,
            appointmentKind: 'MOBILE_GFE',
          },
        ],
      };
      expect(getAppointmentAddress(appt)).to.equal('Video conference');
    });

    it('should return address for community care appointment', () => {
      const appt = {
        ...communityCareAppointment,
        address: {
          street: 'Street',
          city: 'City',
          state: 'State',
          zipCode: 'Zipcode',
        },
      };
      expect(getAppointmentAddress(appt)).to.equal(
        'Street City, State Zipcode',
      );
    });

    it('should return address for facility if defined', () => {
      const facility = {
        address: {
          physical: {
            address1: 'Address 1',
            city: 'City',
            state: 'State',
            zip: 'Zip',
          },
        },
      };
      expect(getAppointmentAddress(vaAppointmentRequest, facility)).to.equal(
        'Address 1 City, State Zip',
      );
    });

    it('should return undefined for everything else', () => {
      expect(getAppointmentAddress(vaAppointmentRequest, null)).to.be.undefined;
    });
  });

  describe('generateICS', () => {
    it('should generate valid ICS calendar commands', () => {
      const appt = {
        typeOfCareId: 'CC',
        appointmentTime: now,
        timeZone: '-04:00 EDT',
      };

      const facility = {
        address: {
          physical: {
            address1: 'Address 1',
            city: 'City',
            state: 'State',
            zip: 'Zip',
          },
        },
      };

      const momentDate = moment(now);
      const dtStamp = momentDate.format('YYYYMMDDTHHmmss');
      const dtStart = momentDate.format('YYYYMMDDTHHmmss');
      const dtEnd = momentDate
        .clone()
        .add(60, 'minutes')
        .format('YYYYMMDDTHHmmss');
      const ics = generateICS(appt, facility);
      expect(ics).to.contain('BEGIN:VCALENDAR');
      expect(ics).to.contain('VERSION:2.0');
      expect(ics).to.contain('PRODID:VA');
      expect(ics).to.contain('BEGIN:VEVENT');
      expect(ics).to.contain('UID:');
      expect(ics).to.contain('SUMMARY:Community Care');
      expect(ics).to.contain('DESCRIPTION:. ');
      expect(ics).to.contain('LOCATION:Address 1 City, State Zip');
      expect(ics).to.contain(`DTSTAMP:${dtStamp}`);
      expect(ics).to.contain(`DTSTART:${dtStart}`);
      expect(ics).to.contain(`DTEND:${dtEnd}`);
      expect(ics).to.contain('END:VEVENT');
      expect(ics).to.contain('END:VCALENDAR');
    });
  });

  describe('getAppointmentDuration', () => {
    it('should return the default appointment duration', () => {
      expect(getAppointmentDuration({})).to.equal(60);
    });
    it('should return the appointment duration for VA appointment', () => {
      expect(
        getAppointmentDuration({
          ...vaAppointment,
          vdsAppointments: [{ appointmentLength: 30 }],
        }),
      ).to.equal(30);
    });
  });

  describe('getAppointmentAddress', () => {
    it('should return address for video appointment', () => {
      const appt = {
        vvsAppointments: [
          {
            dateTime: now,
            appointmentKind: 'MOBILE_GFE',
          },
        ],
      };
      expect(getAppointmentAddress(appt)).to.equal('Video conference');
    });

    it('should return address for community care appointment', () => {
      const appt = {
        ...communityCareAppointment,
        address: {
          street: 'Street',
          city: 'City',
          state: 'State',
          zipCode: 'Zipcode',
        },
      };
      expect(getAppointmentAddress(appt)).to.equal(
        'Street City, State Zipcode',
      );
    });

    it('should return address for facility if defined', () => {
      const facility = {
        address: {
          physical: {
            address1: 'Address 1',
            city: 'City',
            state: 'State',
            zip: 'Zip',
          },
        },
      };
      expect(getAppointmentAddress(vaAppointmentRequest, facility)).to.equal(
        'Address 1 City, State Zip',
      );
    });

    it('should return undefined for everything else', () => {
      expect(getAppointmentAddress(vaAppointmentRequest, null)).to.be.undefined;
    });
  });

  describe('generateICS', () => {
    it('should generate valid ICS calendar commands', () => {
      const appt = {
        typeOfCareId: 'CC',
        appointmentTime: now,
        timeZone: '-04:00 EDT',
      };

      const facility = {
        address: {
          physical: {
            address1: 'Address 1',
            city: 'City',
            state: 'State',
            zip: 'Zip',
          },
        },
      };

      const momentDate = moment(now);
      const dtStamp = momentDate.format('YYYYMMDDTHHmmss');
      const dtStart = momentDate.format('YYYYMMDDTHHmmss');
      const dtEnd = momentDate
        .clone()
        .add(60, 'minutes')
        .format('YYYYMMDDTHHmmss');
      const ics = generateICS(appt, facility);
      expect(ics).to.contain('BEGIN:VCALENDAR');
      expect(ics).to.contain('VERSION:2.0');
      expect(ics).to.contain('PRODID:VA');
      expect(ics).to.contain('BEGIN:VEVENT');
      expect(ics).to.contain('UID:');
      expect(ics).to.contain('SUMMARY:Community Care');
      expect(ics).to.contain('DESCRIPTION:. ');
      expect(ics).to.contain('LOCATION:Address 1 City, State Zip');
      expect(ics).to.contain(`DTSTAMP:${dtStamp}`);
      expect(ics).to.contain(`DTSTART:${dtStart}`);
      expect(ics).to.contain(`DTEND:${dtEnd}`);
      expect(ics).to.contain('END:VEVENT');
      expect(ics).to.contain('END:VCALENDAR');
    });
  });
});
