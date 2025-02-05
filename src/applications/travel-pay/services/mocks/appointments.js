export const appointment1 = {
  resourceType: 'Appointment',
  id: 'aa6bb54b5f8ba22a82720a30abdfa3efe0805cc0dc1b6b248815e942ad61847e',
  status: 'booked',
  cancelationReason: null,
  avsPath: null,
  start: '2024-12-30T08:00:00-06:00',
  patientComments: null,
  timezone: 'America/Denver',
  description: 'VAOS_UNKNOWN',
  minutesDuration: 15,
  location: {
    vistaId: '983',
    clinicId: '1038',
    stationId: '983',
    clinicName: 'COVID VACCINE CLIN1',
    clinicPhysicalLocation: 'MHC',
    clinicPhone: null,
    clinicPhoneExtension: null,
  },
  videoData: {
    isVideo: false,
  },
  communityCareProvider: null,
  preferredProviderName: null,
  practitioners: [
    {
      identifier: [
        {
          system: 'https://veteran.apps.va.gov/terminology/fhir/sid/secid',
          value: null,
        },
      ],
      name: {
        family: 'BERNARDO',
        given: ['KENNETH J'],
      },
    },
  ],
  vaos: {
    isPendingAppointment: false,
    isUpcomingAppointment: true,
    isVideo: false,
    isPastAppointment: false,
    isCompAndPenAppointment: false,
    isCancellable: false,
    appointmentType: 'vaAppointment',
    isCommunityCare: false,
    isExpressCare: false,
    isPhoneAppointment: false,
    isCOVIDVaccine: true,
    apiData: {
      id: 'aa6bb54b5f8ba22a82720a30abdfa3efe0805cc0dc1b6b248815e942ad61847e',
      identifier: [
        {
          system: 'Appointment/',
          value: '413938333133353533',
        },
        {
          system: 'http://www.va.gov/Terminology/VistADefinedTerms/409_84',
          value: '983:13553',
        },
      ],
      kind: 'clinic',
      status: 'booked',
      serviceType: 'covid',
      serviceTypes: [
        {
          coding: [
            {
              system:
                'http://veteran.apps.va.gov/terminologies/fhir/CodeSystem/vats-service-type',
              code: 'covid',
            },
          ],
        },
      ],
      serviceCategory: [
        {
          coding: [
            {
              system: 'http://www.va.gov/Terminology/VistADefinedTerms/409_1',
              code: 'REGULAR',
              display: 'REGULAR',
            },
          ],
          text: 'REGULAR',
        },
      ],
      patientIcn: '1012846043V576341',
      locationId: '983',
      clinic: '1038',
      practitioners: [
        {
          identifier: [
            {
              system: 'https://veteran.apps.va.gov/terminology/fhir/sid/secid',
              value: null,
            },
          ],
          name: {
            family: 'BERNARDO',
            given: ['KENNETH J'],
          },
        },
      ],
      start: '2024-12-30T14:00:00Z',
      end: '2024-08-01T14:15:00Z',
      minutesDuration: 15,
      slot: {
        id: '3230323430383031313430303A323032343038303131343135',
        start: '2024-12-01T14:00:00Z',
        end: '2024-12-01T14:15:00Z',
      },
      created: '2024-12-09T00:00:00Z',
      cancellable: false,
      extension: {
        ccLocation: {
          address: {},
        },
        vistaStatus: ['FUTURE'],
        preCheckinAllowed: true,
        eCheckinAllowed: true,
        clinic: {
          physicalLocation: 'MHC',
        },
      },
      localStartTime: '2024-12-01T08:00:00.000-06:00',
      serviceName: 'COVID VACCINE CLIN1',
      friendlyName: 'COVID VACCINE CLIN1',
      physicalLocation: 'MHC',
      location: {
        id: '983',
        type: 'appointments',
        attributes: {
          id: '983',
          vistaSite: '983',
          vastParent: '983',
          type: 'va_facilities',
          name: 'Cheyenne VA Medical Center',
          classification: 'VA Medical Center (VAMC)',
          timezone: {
            timeZoneId: 'America/Denver',
          },
          lat: 39.744507,
          long: -104.830956,
          website: 'https://www.denver.va.gov/locations/directions.asp',
          phone: {
            main: '307-778-7550',
            fax: '307-778-7381',
            pharmacy: '866-420-6337',
            afterHours: '307-778-7550',
            patientAdvocate: '307-778-7550 x7517',
            mentalHealthClinic: '307-778-7349',
            enrollmentCoordinator: '307-778-7550 x7579',
          },
          physicalAddress: {
            type: 'physical',
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
          mobile: false,
          healthService: [
            'Audiology',
            'Cardiology',
            'DentalServices',
            'EmergencyCare',
            'Gastroenterology',
            'Gynecology',
            'MentalHealthCare',
            'Nutrition',
            'Ophthalmology',
            'Optometry',
            'Orthopedics',
            'Podiatry',
            'PrimaryCare',
            'SpecialtyCare',
            'UrgentCare',
            'Urology',
            'WomensHealth',
          ],
          operatingStatus: {
            code: 'NORMAL',
          },
        },
      },
      travelPayClaim: {
        metadata: {
          status: 200,
          success: true,
          message: 'Data retrieved successfully',
        },
      },
    },
    timeZone: 'America/Denver',
    facilityData: {
      resourceType: 'Location',
      id: '983',
      vistaId: '983',
      name: 'Cheyenne VA Medical Center',
      identifier: [
        {
          system: 'http://med.va.gov/fhir/urn',
          value: 'urn:va:division:983:983',
        },
        {
          system: 'urn:oid:2.16.840.1.113883.6.233',
          value: '983',
        },
      ],
      telecom: [
        {
          system: 'phone',
          value: '307-778-7550',
        },
      ],
      position: {
        longitude: -104.830956,
        latitude: 39.744507,
      },
      address: {
        line: ['2360 East Pershing Boulevard'],
        city: 'Cheyenne',
        state: 'WY',
        postalCode: '82001-5356',
      },
    },
  },
  version: 2,
};

export const appointment = {
  resourceType: 'Appointment',
  id: 'aa6bb54b5f8ba22a82720a30abdfa3efe0805cc0dc1b6b248815e942ad61847e',
  status: 'booked',
  cancelationReason: null,
  start: '2024-11-20T10:30:00-05:00',
  patientComments: null,
  reasonForAppointment: 'Medication concern',
  timezone: 'Asia/Manila',
  description: 'VAOS_UNKNOWN',
  minutesDuration: 60,
  practitioners: [
    {
      identifier: [
        {
          system: 'https://veteran.apps.va.gov/terminology/fhir/sid/secid',
          value: null,
        },
      ],
      name: {
        family: 'BERNARDO',
        given: ['KENNETH J'],
      },
    },
  ],
  location: {
    vistaId: '983',
    clinicId: '945',
    stationId: '983GC',
    clinicName: 'C&P BEV AUDIO FTC',
    clinicPhysicalLocation: 'FORT COLLINS AUDIO',
    clinicPhone: null,
    clinicPhoneExtension: null,
  },
  videoData: {
    isVideo: false,
  },
  communityCareProvider: null,
  preferredProviderName: null,
  vaos: {
    isPendingAppointment: false,
    isUpcomingAppointment: false,
    isVideo: false,
    isPastAppointment: true,
    isCompAndPenAppointment: true,
    isCancellable: false,
    appointmentType: 'vaAppointment',
    isCommunityCare: false,
    isExpressCare: false,
    isPhoneAppointment: false,
    isCOVIDVaccine: false,
    apiData: {
      id: '167322',
      identifier: [
        {
          system: 'Appointment/',
          value: '4139383339353233',
        },
      ],
      kind: 'clinic',
      status: 'booked',
      serviceType: 'audiology',
      serviceTypes: [
        {
          coding: [
            {
              system:
                'http://veteran.apps.va.gov/terminologies/fhir/CodeSystem/vats-service-type',
              code: 'audiology',
            },
          ],
        },
      ],
      serviceCategory: [
        {
          coding: [
            {
              system: 'http://www.va.gov/Terminology/VistADefinedTerms/409_1',
              code: 'COMPENSATION & PENSION',
              display: 'COMPENSATION & PENSION',
            },
          ],
          text: 'COMPENSATION & PENSION',
        },
      ],
      patientIcn: '1013120826V646496',
      locationId: '983GC',
      localStartTime: '2024-11-20T10:30:00.000+08:00',
      clinic: '945',
      start: '2024-11-20T09:30:00Z',
      end: '2024-11-20T10:00:00Z',
      created: '2024-03-17T00:00:00Z',
      cancellable: false,
      extension: {
        ccLocation: {
          address: {},
        },
        vistaStatus: ['NO ACTION TAKEN'],
      },
      serviceName: 'FTC C&P AUDIO BEV',
      physicalLocation: 'FORT COLLINS AUDIO',
      friendlyName: 'C&P BEV AUDIO FTC',
      practitioners: [
        {
          identifier: [
            {
              system: 'https://veteran.apps.va.gov/terminology/fhir/sid/secid',
              value: null,
            },
          ],
          name: {
            family: 'BERNARDO',
            given: ['KENNETH J'],
          },
        },
      ],
      location: {
        id: '983GC',
        type: 'appointments',
        attributes: {
          id: '983GC',
          vistaSite: '983',
          vastParent: '983',
          type: 'va_facilities',
          name: 'Fort Collins VA Clinic',
          classification: 'Multi-Specialty CBOC',
          timezone: {
            timeZoneId: 'Asia/Manila',
          },
          lat: 40.553875,
          long: -105.08795,
          website:
            'https://www.cheyenne.va.gov/locations/Fort_Collins_VA_CBOC.asp',
          phone: {
            main: '970-224-1550',
          },
          physicalAddress: {
            line: ['2509 Research Boulevard'],
            city: 'Fort Collins',
            state: 'CO',
            postalCode: '80526-8108',
          },
          healthService: [
            'Audiology',
            'EmergencyCare',
            'MentalHealthCare',
            'PrimaryCare',
            'SpecialtyCare',
          ],
        },
      },
      travelPayClaim: {
        metadata: {
          status: 200,
          success: true,
          message: 'Data retrieved successfully',
        },
        claim: {
          id: '16cbc3d0-56de-4d86-abf3-ed0f6908ee53',
          claimNumber: '5b550fe7-6985-4a69-953a-472d5cf85921',
          claimStatus: 'In Process',
          appointmentDateTime: '2023-02-23T22:22:52.549Z',
          facilityName: 'Tomah VA Medical Center',
          createdOn: '2023-02-24T22:22:52.549Z',
          modifiedOn: '2023-02-26T22:22:52.549Z',
        },
      },
    },
    timeZone: 'Asia/Manila',
    facilityData: {
      resourceType: 'Location',
      id: '983GC',
      vistaId: '983',
      name: 'Fort Collins VA Clinic',
      identifier: [
        {
          system: 'http://med.va.gov/fhir/urn',
          value: 'urn:va:division:983:983GC',
        },
        {
          system: 'urn:oid:2.16.840.1.113883.6.233',
          value: '983GC',
        },
      ],
      telecom: [
        {
          system: 'phone',
          value: '970-224-1550',
        },
      ],
      position: {
        longitude: -105.08795,
        latitude: 40.553875,
      },
      address: {
        line: ['2509 Research Boulevard'],
        city: 'Fort Collins',
        state: 'CO',
        postalCode: '80526-8108',
      },
    },
  },
  version: 2,
};
