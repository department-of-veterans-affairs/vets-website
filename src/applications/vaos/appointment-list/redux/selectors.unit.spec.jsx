import { expect } from 'chai';
import { cloneDeep } from 'lodash';
import { selectTypeOfCareName, selectCanUseVaccineFlow } from './selectors';
import { TYPE_OF_CARE_IDS } from '../../utils/constants';

describe('appointment-list / redux / selectors', () => {
  const OhAppointment = {
    resourceType: 'Appointment',
    id: 'CERN129445973',
    type: 'VA',
    modality: 'vaVideoCareAtHome',
    status: 'booked',
    cancelationReason: null,
    avsPath: null,
    start: '2025-12-25T19:00:00.000Z',
    startUtc: '2025-12-25T19:00:00Z',
    timezone: 'America/Los_Angeles',
    description: 'VAOS_UNKNOWN',
    communityCareProvider: null,
    preferredProviderName: null,
    practitioners: [
      {
        identifier: [{ system: null, value: 'Practitioner/10975557' }],
        name: { family: 'Adams', given: ['Brian J', 'PhD'] },
        firstName: 'Brian J',
        lastName: 'Adams',
      },
    ],
    vaos: {
      isPendingAppointment: false,
      isUpcomingAppointment: true,
      isVideo: true,
      isAtlas: false,
      isPastAppointment: false,
      isCompAndPenAppointment: false,
      isCancellable: false,
      appointmentType: 'vaAppointment',
      isCommunityCare: false,
      isExpressCare: false,
      isPhoneAppointment: false,
      isCOVIDVaccine: false,
      isInPersonVisit: false,
      isVideoAtHome: true,
      isVideoAtVA: false,
      isCerner: true,
      apiData: {
        id: 'CERN129445973',
        identifier: [
          {
            system: 'urn:va.gov:cfa:cerner:appointment',
            value: 'Appointment/129445973',
          },
        ],
        kind: 'telehealth',
        status: 'booked',
        serviceTypes: [
          {
            coding: [
              {
                system:
                  'https://fhir.cerner.com/d45741b3-8335-463d-ab16-8c5f0bcf78ed/codeSet/14249',
                code: '381426381',
                display: 'Clinical Pharmacist TH Video Home',
              },
            ],
            text: 'Clinical Pharmacist TH Video Home',
          },
          {
            coding: [
              {
                system:
                  'http://veteran.apps.va.gov/terminologies/fhir/CodeSystem/appt-modality',
                code: 'VIDEO',
                display: 'VIDEO',
              },
            ],
          },
        ],
        reasonCode: { text: 'MCN test for OCTO #3' },
        description: 'Clinical Pharmacist TH Video Home',
        patientIcn: '1012845331V153043',
        locationId: '668QD',
        practitioners: [
          {
            identifier: [{ system: null, value: 'Practitioner/10975557' }],
            name: { family: 'Adams', given: ['Brian J', 'PhD'] },
            firstName: 'Brian J',
            lastName: 'Adams',
          },
        ],
        start: '2025-12-25T19:00:00Z',
        end: '2025-12-25T19:30:00Z',
        minutesDuration: 30,
        slot: { id: '381426381-415968545-2322006979-240' },
        requestedPeriods: null,
        cancellable: false,
        isCerner: true,
        type: 'VA',
        modality: 'vaVideoCareAtHome',
        pending: false,
        past: false,
        future: true,
      },
      timeZone: 'America/Los_Angeles',
    },
    version: 2,
  };

  it('should return COMPENSATION & PENSION as type of care', () => {
    const appointment = {
      vaos: {
        apiData: {
          serviceType: 'audiology',
          serviceCategory: [
            {
              coding: [
                {
                  system:
                    'http://www.va.gov/Terminology/VistADefinedTerms/409_1',
                  code: 'COMPENSATION & PENSION',
                  display: 'COMPENSATION & PENSION',
                },
              ],
              text: 'COMPENSATION & PENSION',
            },
          ],
        },
      },
    };
    const typeOfCareName = selectTypeOfCareName(appointment);
    expect(typeOfCareName).to.equal('Claim exam');
  });
  it('should return Audiology and speech as type of care', () => {
    const appointment = {
      vaos: {
        apiData: {
          serviceType: 'audiology',
          serviceCategory: [
            {
              coding: [
                {
                  system:
                    'http://www.va.gov/Terminology/VistADefinedTerms/409_1',
                  code: 'REGULAR',
                  display: 'REGULAR',
                },
              ],
              text: 'REGULAR',
            },
          ],
        },
      },
    };
    const typeOfCareName = selectTypeOfCareName(appointment);
    expect(typeOfCareName).to.equal('Audiology and speech');
  });
  it('should return Clinical Pharmacist TH Video Home when name is undefined', () => {
    const typeOfCareName = selectTypeOfCareName(OhAppointment);
    expect(typeOfCareName).to.equal('Clinical Pharmacist TH Video Home');
  });
  it('should return undefined when cerner is false and no serviceType is not defined -- later replaced by VA Appointment', () => {
    const appointment = cloneDeep(OhAppointment);
    appointment.vaos.isCerner = false;
    const typeOfCareName = selectTypeOfCareName(appointment);
    expect(typeOfCareName).to.equal(undefined);
  });

  it('should return undefined when no description -- later replaced by VA Appointment', () => {
    const appointment = cloneDeep(OhAppointment);
    appointment.vaos.apiData.description = undefined;
    const typeOfCareName = selectTypeOfCareName(appointment);
    expect(typeOfCareName).to.equal(undefined);
  });

  describe('selectCanUseVaccineFlow', () => {
    const createState = (facilitySettings, useVpg = false) => ({
      appointments: {
        facilitySettings,
      },
      featureToggles: {
        vaOnlineSchedulingUseVpg: useVpg,
      },
    });

    it('should return true when useVpg is false and direct.enabled is true for COVID vaccine', () => {
      const state = createState(
        [
          {
            services: [
              {
                id: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
                direct: { enabled: true },
              },
            ],
          },
        ],
        false,
      );

      expect(selectCanUseVaccineFlow(state)).to.be.true;
    });

    it('should return false when useVpg is false and direct.enabled is false for COVID vaccine', () => {
      const state = createState(
        [
          {
            services: [
              {
                id: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
                direct: { enabled: false },
              },
            ],
          },
        ],
        false,
      );

      expect(selectCanUseVaccineFlow(state)).to.be.false;
    });

    it('should return true when useVpg is true and bookedAppointments is true for COVID vaccine', () => {
      const state = createState(
        [
          {
            services: [
              {
                id: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
                bookedAppointments: true,
              },
            ],
          },
        ],
        true,
      );

      expect(selectCanUseVaccineFlow(state)).to.be.true;
    });

    it('should return false when useVpg is true and bookedAppointments is false for COVID vaccine', () => {
      const state = createState(
        [
          {
            services: [
              {
                id: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
                bookedAppointments: false,
              },
            ],
          },
        ],
        true,
      );

      expect(selectCanUseVaccineFlow(state)).to.be.false;
    });

    it('should return undefined when facilitySettings is null', () => {
      const state = createState(null, false);

      expect(selectCanUseVaccineFlow(state)).to.be.undefined;
    });

    it('should return false when COVID vaccine service is not found', () => {
      const state = createState(
        [
          {
            services: [
              {
                id: 'primaryCare',
                direct: { enabled: true },
              },
            ],
          },
        ],
        false,
      );

      expect(selectCanUseVaccineFlow(state)).to.be.false;
    });
  });
});
