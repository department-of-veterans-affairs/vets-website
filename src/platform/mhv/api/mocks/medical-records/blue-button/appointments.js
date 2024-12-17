const appointments = {
  data: [
    {
      id: 'a1fab2235680b2b7432af8d6c45ffea112168c76a35668be72f595d7b89aa950',
      type: 'appointments',
      attributes: {
        id: 'a1fab2235680b2b7432af8d6c45ffea112168c76a35668be72f595d7b89aa950',
        identifier: [
          {
            system: 'Appointment/',
            value: '413938333134323137',
          },
          {
            system: 'http://www.va.gov/Terminology/VistADefinedTerms/409_84',
            value: '983:14217',
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
                code: 'primaryCare',
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
        patientIcn: '1013617799V330501',
        locationId: '983',
        clinic: '621',
        practitioners: [
          {
            identifier: [
              {
                system:
                  'https://veteran.apps.va.gov/terminology/fhir/sid/secid',
                value: '1013073461',
              },
            ],
            name: {
              family: 'NADEAU',
              given: ['MARCY M'],
            },
          },
        ],
        start: '2024-10-03T14:00:00Z',
        end: '2024-10-03T14:10:00Z',
        minutesDuration: 10,
        slot: {
          id: '3230323431303033313430303A323032343130303331343130',
          start: '2024-10-03T14:00:00Z',
          end: '2024-10-03T14:10:00Z',
        },
        created: '2024-09-13T00:00:00Z',
        cancellable: false,
        extension: {
          ccLocation: {
            address: {},
          },
          vistaStatus: ['NO ACTION TAKEN'],
          preCheckinAllowed: false,
          eCheckinAllowed: false,
          clinic: {
            physicalLocation: 'AMB CARE',
            phoneNumber: '7561',
            phoneNumberExtension: '',
          },
        },
        localStartTime: '2024-10-03T08:00:00.000-06:00',
        station: '983',
        ien: '14217',
        serviceName: 'COVID VACCINE CLIN2',
        friendlyName: 'COVID VACCINE CLIN2',
        physicalLocation: 'AMB CARE',
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
            ehrSystem: 'VistA',
          },
        },
        type: 'VA',
      },
    },
    {
      id: 'b48134f5b6732d1f604a74d755e6cebf8126c7cb97c1d55eec363a73415bb720',
      type: 'appointments',
      attributes: {
        id: 'b48134f5b6732d1f604a74d755e6cebf8126c7cb97c1d55eec363a73415bb720',
        identifier: [
          {
            system: 'Appointment/',
            value: '413938333134313536',
          },
          {
            system: 'http://www.va.gov/Terminology/VistADefinedTerms/409_84',
            value: '983:14156',
          },
        ],
        kind: 'clinic',
        status: 'booked',
        serviceType: 'primaryCare',
        serviceTypes: [
          {
            coding: [
              {
                system:
                  'http://veteran.apps.va.gov/terminologies/fhir/CodeSystem/vats-service-type',
                code: 'primaryCare',
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
        patientIcn: '1013617799V330501',
        locationId: '983',
        clinic: '985',
        start: '2024-10-29T17:00:00Z',
        end: '2024-10-29T17:15:00Z',
        minutesDuration: 15,
        slot: {
          id: '3230323431303239313730303A323032343130323931373135',
          start: '2024-10-29T17:00:00Z',
          end: '2024-10-29T17:15:00Z',
        },
        created: '2024-09-09T00:00:00Z',
        cancellable: true,
        extension: {
          ccLocation: {
            address: {},
          },
          vistaStatus: ['NO ACTION TAKEN/TODAY'],
          preCheckinAllowed: false,
          eCheckinAllowed: false,
          clinic: {
            physicalLocation: 'AM',
            phoneNumber: '7580',
            phoneNumberExtension: '',
          },
        },
        localStartTime: '2024-10-29T11:00:00.000-06:00',
        station: '983',
        ien: '14156',
        serviceName: 'COVID VACCINE CLIN5',
        friendlyName: 'COVID VACCINE CLIN5',
        physicalLocation: 'EMERGENCY ROOM',
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
            ehrSystem: 'VistA',
          },
        },
        type: 'VA',
      },
    },
  ],
  meta: {
    pagination: {
      currentPage: 0,
      perPage: 0,
      totalPages: 0,
      totalEntries: 0,
    },
    failures: [
      {
        system: 'OH',
        id: '2f64c0b3-9291-4513-bacc-41e7f3987381',
        code: 500,
        message: 'HTTP 500 Internal Server Error',
        detail:
          'icn=1013617799V330501, statuses=booked,arrived,fulfilled,cancelled, start=2024-09-29T00:00Z, end=2025-11-28T00:00Z',
      },
    ],
  },
};

module.exports = { appointments };
