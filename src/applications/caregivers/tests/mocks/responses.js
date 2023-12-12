export const mockLightHouseFacilitiesResponse = {
  data: [
    {
      id: 'vha_111AA',
      type: 'va_facilities',
      attributes: {
        name: 'Test VA Clinic',
        facilityType: 'va_health_facility',
        classification: 'Multi-Specialty CBOC',
        lat: 28.11111111,
        long: -82.22222222,
        timeZone: 'America/New_York',
        address: {
          physical: {
            zip: '11111-2222',
            city: 'Testville',
            state: 'FL',
            address1: '1 Test Ave',
            address2: 'Suite 202',
            address3: null,
          },
        },
        phone: {
          fax: '111-111-1111',
          main: '111-111-2222',
        },
        hours: {
          monday: '700AM-430PM',
          tuesday: '700AM-430PM',
          wednesday: '700AM-430PM',
          thursday: '700AM-430PM',
          friday: '700AM-430PM',
          saturday: 'Closed',
          sunday: 'Closed',
        },
        services: {
          health: [
            {
              name: 'Audiology and speech',
              serviceId: 'audiology',
              link: 'test.va.gov/vha_111AA/services/audiology',
            },
            {
              name: 'Dermatology',
              serviceId: 'dermatology',
              link: 'test.va.gov/vha_111AA/services/dermatology',
            },
          ],
          link: 'test.va.gov/vha_111AA/services',
          lastUpdated: '2023-09-10',
        },
        satisfaction: {
          health: {
            primaryCareUrgent: 0.8799999952316284,
            primaryCareRoutine: 0.9100000262260437,
          },
          effectiveDate: '2022-06-28',
        },
        mobile: false,
        operatingStatus: {
          code: 'NORMAL',
          supplementalStatus: [
            {
              id: 'COVID_MEDIUM',
              label: 'COVID-19 health protection: Levels medium',
            },
          ],
        },
        visn: '8',
      },
    },
    {
      id: 'vha_222AA',
      type: 'va_facilities',
      attributes: {
        name: 'Test VA Medical Center',
        facilityType: 'va_health_facility',
        classification: 'VAMC',
        lat: 29.22222222,
        long: -81.11111111,
        timeZone: 'America/New_York',
        address: {
          physical: {
            zip: '22222-1111',
            city: 'Testburgh',
            state: 'FL',
            address1: '1 Test Rd',
            address2: 'Suite 101',
            address3: 'Bldg 4',
          },
        },
        phone: {
          fax: '222-222-2222',
          main: '222-111-2222',
        },
        hours: {
          monday: '700AM-430PM',
          tuesday: '700AM-430PM',
          wednesday: '700AM-430PM',
          thursday: '700AM-430PM',
          friday: '700AM-430PM',
          saturday: 'Closed',
          sunday: 'Closed',
        },
        services: {
          health: [
            {
              name: 'Audiology and speech',
              serviceId: 'audiology',
              link: 'test.va.gov/vha_222AA/services/audiology',
            },
            {
              name: 'Dermatology',
              serviceId: 'dermatology',
              link: 'test.va.gov/vha_222AA/services/dermatology',
            },
          ],
          link: 'test.va.gov/vha_222AA/services',
          lastUpdated: '2023-02-10',
        },
        satisfaction: {
          health: {
            primaryCareUrgent: 0.9799999952316284,
            primaryCareRoutine: 0.8100000262260437,
          },
          effectiveDate: '2022-02-28',
        },
        mobile: false,
        operatingStatus: {
          code: 'NORMAL',
          supplementalStatus: [
            {
              id: 'COVID_MEDIUM',
              label: 'COVID-19 health protection: Levels medium',
            },
          ],
        },
        visn: '8',
      },
    },
    {
      id: 'vha_333AA',
      type: 'va_facilities',
      attributes: {
        name: 'Test VA Clinic',
        facilityType: 'va_health_facility',
        classification: 'Multi-Specialty CBOC',
        lat: 28.11111111,
        long: -82.22222222,
        timeZone: 'America/New_York',
        address: {
          physical: {
            zip: '11111-2222',
            city: 'Testville',
            state: 'FL',
            address1: '1 Test Ave',
            address2: 'Suite 202',
            address3: null,
          },
        },
        phone: {
          fax: '111-111-1111',
          main: '111-111-2222',
        },
        hours: {
          monday: '700AM-430PM',
          tuesday: '700AM-430PM',
          wednesday: '700AM-430PM',
          thursday: '700AM-430PM',
          friday: '700AM-430PM',
          saturday: 'Closed',
          sunday: 'Closed',
        },
        services: {
          health: [
            {
              name: 'Audiology and speech',
              serviceId: 'audiology',
              link: 'test.va.gov/vha_111AA/services/audiology',
            },
            {
              name: 'Dermatology',
              serviceId: 'dermatology',
              link: 'test.va.gov/vha_111AA/services/dermatology',
            },
          ],
          link: 'test.va.gov/vha_111AA/services',
          lastUpdated: '2023-09-10',
        },
        satisfaction: {
          health: {
            primaryCareUrgent: 0.8799999952316284,
            primaryCareRoutine: 0.9100000262260437,
          },
          effectiveDate: '2022-06-28',
        },
        mobile: false,
        operatingStatus: {
          code: 'NORMAL',
          supplementalStatus: [
            {
              id: 'COVID_MEDIUM',
              label: 'COVID-19 health protection: Levels medium',
            },
          ],
        },
        visn: '8',
      },
    },
    {
      id: 'vha_444AA',
      type: 'va_facilities',
      attributes: {
        name: 'Test VA Medical Center',
        facilityType: 'va_health_facility',
        classification: 'VAMC',
        lat: 29.22222222,
        long: -81.11111111,
        timeZone: 'America/New_York',
        address: {
          physical: {
            zip: '22222-1111',
            city: 'Testburgh',
            state: 'FL',
            address1: '1 Test Rd',
            address2: 'Suite 101',
            address3: 'Bldg 4',
          },
        },
        phone: {
          fax: '222-222-2222',
          main: '222-111-2222',
        },
        hours: {
          monday: '700AM-430PM',
          tuesday: '700AM-430PM',
          wednesday: '700AM-430PM',
          thursday: '700AM-430PM',
          friday: '700AM-430PM',
          saturday: 'Closed',
          sunday: 'Closed',
        },
        services: {
          health: [
            {
              name: 'Audiology and speech',
              serviceId: 'audiology',
              link: 'test.va.gov/vha_222AA/services/audiology',
            },
            {
              name: 'Dermatology',
              serviceId: 'dermatology',
              link: 'test.va.gov/vha_222AA/services/dermatology',
            },
          ],
          link: 'test.va.gov/vha_222AA/services',
          lastUpdated: '2023-02-10',
        },
        satisfaction: {
          health: {
            primaryCareUrgent: 0.9799999952316284,
            primaryCareRoutine: 0.8100000262260437,
          },
          effectiveDate: '2022-02-28',
        },
        mobile: false,
        operatingStatus: {
          code: 'NORMAL',
          supplementalStatus: [
            {
              id: 'COVID_MEDIUM',
              label: 'COVID-19 health protection: Levels medium',
            },
          ],
        },
        visn: '8',
      },
    },
    {
      id: 'vha_555AA',
      type: 'va_facilities',
      attributes: {
        name: 'Test VA Clinic',
        facilityType: 'va_health_facility',
        classification: 'Multi-Specialty CBOC',
        lat: 28.11111111,
        long: -82.22222222,
        timeZone: 'America/New_York',
        address: {
          physical: {
            zip: '11111-2222',
            city: 'Testville',
            state: 'FL',
            address1: '1 Test Ave',
            address2: 'Suite 202',
            address3: null,
          },
        },
        phone: {
          fax: '111-111-1111',
          main: '111-111-2222',
        },
        hours: {
          monday: '700AM-430PM',
          tuesday: '700AM-430PM',
          wednesday: '700AM-430PM',
          thursday: '700AM-430PM',
          friday: '700AM-430PM',
          saturday: 'Closed',
          sunday: 'Closed',
        },
        services: {
          health: [
            {
              name: 'Audiology and speech',
              serviceId: 'audiology',
              link: 'test.va.gov/vha_111AA/services/audiology',
            },
            {
              name: 'Dermatology',
              serviceId: 'dermatology',
              link: 'test.va.gov/vha_111AA/services/dermatology',
            },
          ],
          link: 'test.va.gov/vha_111AA/services',
          lastUpdated: '2023-09-10',
        },
        satisfaction: {
          health: {
            primaryCareUrgent: 0.8799999952316284,
            primaryCareRoutine: 0.9100000262260437,
          },
          effectiveDate: '2022-06-28',
        },
        mobile: false,
        operatingStatus: {
          code: 'NORMAL',
          supplementalStatus: [
            {
              id: 'COVID_MEDIUM',
              label: 'COVID-19 health protection: Levels medium',
            },
          ],
        },
        visn: '8',
      },
    },
    {
      id: 'vha_666AA',
      type: 'va_facilities',
      attributes: {
        name: 'Test VA Medical Center',
        facilityType: 'va_health_facility',
        classification: 'VAMC',
        lat: 29.22222222,
        long: -81.11111111,
        timeZone: 'America/New_York',
        address: {
          physical: {
            zip: '22222-1111',
            city: 'Testburgh',
            state: 'FL',
            address1: '1 Test Rd',
            address2: 'Suite 101',
            address3: 'Bldg 4',
          },
        },
        phone: {
          fax: '222-222-2222',
          main: '222-111-2222',
        },
        hours: {
          monday: '700AM-430PM',
          tuesday: '700AM-430PM',
          wednesday: '700AM-430PM',
          thursday: '700AM-430PM',
          friday: '700AM-430PM',
          saturday: 'Closed',
          sunday: 'Closed',
        },
        services: {
          health: [
            {
              name: 'Audiology and speech',
              serviceId: 'audiology',
              link: 'test.va.gov/vha_222AA/services/audiology',
            },
            {
              name: 'Dermatology',
              serviceId: 'dermatology',
              link: 'test.va.gov/vha_222AA/services/dermatology',
            },
          ],
          link: 'test.va.gov/vha_222AA/services',
          lastUpdated: '2023-02-10',
        },
        satisfaction: {
          health: {
            primaryCareUrgent: 0.9799999952316284,
            primaryCareRoutine: 0.8100000262260437,
          },
          effectiveDate: '2022-02-28',
        },
        mobile: false,
        operatingStatus: {
          code: 'NORMAL',
          supplementalStatus: [
            {
              id: 'COVID_MEDIUM',
              label: 'COVID-19 health protection: Levels medium',
            },
          ],
        },
        visn: '8',
      },
    },
  ],
};

export const mockLightHouseFacilitiesResponseWithTransformedAddresses = {
  data: [
    {
      id: 'vha_111AA',
      type: 'va_facilities',
      attributes: {
        name: 'Test VA Clinic',
        facilityType: 'va_health_facility',
        classification: 'Multi-Specialty CBOC',
        lat: 28.11111111,
        long: -82.22222222,
        timeZone: 'America/New_York',
        address: {
          physical: {
            address1: '1 Test Ave',
            address2: 'Suite 202',
            address3: 'Testville, FL, 11111-2222',
          },
        },
        phone: {
          fax: '111-111-1111',
          main: '111-111-2222',
        },
        hours: {
          monday: '700AM-430PM',
          tuesday: '700AM-430PM',
          wednesday: '700AM-430PM',
          thursday: '700AM-430PM',
          friday: '700AM-430PM',
          saturday: 'Closed',
          sunday: 'Closed',
        },
        services: {
          health: [
            {
              name: 'Audiology and speech',
              serviceId: 'audiology',
              link: 'test.va.gov/vha_111AA/services/audiology',
            },
            {
              name: 'Dermatology',
              serviceId: 'dermatology',
              link: 'test.va.gov/vha_111AA/services/dermatology',
            },
          ],
          link: 'test.va.gov/vha_111AA/services',
          lastUpdated: '2023-09-10',
        },
        satisfaction: {
          health: {
            primaryCareUrgent: 0.8799999952316284,
            primaryCareRoutine: 0.9100000262260437,
          },
          effectiveDate: '2022-06-28',
        },
        mobile: false,
        operatingStatus: {
          code: 'NORMAL',
          supplementalStatus: [
            {
              id: 'COVID_MEDIUM',
              label: 'COVID-19 health protection: Levels medium',
            },
          ],
        },
        visn: '8',
      },
    },
    {
      id: 'vha_222AA',
      type: 'va_facilities',
      attributes: {
        name: 'Test VA Medical Center',
        facilityType: 'va_health_facility',
        classification: 'VAMC',
        lat: 29.22222222,
        long: -81.11111111,
        timeZone: 'America/New_York',
        address: {
          physical: {
            address1: '1 Test Rd',
            address2: 'Suite 101, Bldg 4',
            address3: 'Testburgh, FL, 22222-1111',
          },
        },
        phone: {
          fax: '222-222-2222',
          main: '222-111-2222',
        },
        hours: {
          monday: '700AM-430PM',
          tuesday: '700AM-430PM',
          wednesday: '700AM-430PM',
          thursday: '700AM-430PM',
          friday: '700AM-430PM',
          saturday: 'Closed',
          sunday: 'Closed',
        },
        services: {
          health: [
            {
              name: 'Audiology and speech',
              serviceId: 'audiology',
              link: 'test.va.gov/vha_222AA/services/audiology',
            },
            {
              name: 'Dermatology',
              serviceId: 'dermatology',
              link: 'test.va.gov/vha_222AA/services/dermatology',
            },
          ],
          link: 'test.va.gov/vha_222AA/services',
          lastUpdated: '2023-02-10',
        },
        satisfaction: {
          health: {
            primaryCareUrgent: 0.9799999952316284,
            primaryCareRoutine: 0.8100000262260437,
          },
          effectiveDate: '2022-02-28',
        },
        mobile: false,
        operatingStatus: {
          code: 'NORMAL',
          supplementalStatus: [
            {
              id: 'COVID_MEDIUM',
              label: 'COVID-19 health protection: Levels medium',
            },
          ],
        },
        visn: '8',
      },
    },
  ],
};

export const mockLightHouseFacilitiesResponseV1 = {
  data: [
    {
      id: 'vha_688',
      type: 'va_facilities',
      attributes: {
        name: 'Washington VA Medical Center',
        facilityType: 'va_health_facility',
        classification: 'VA Medical Center (VAMC)',
        parent: {
          id: 'vha_402',
          link:
            'https://api.va.gov/services/va_facilities/v0/facilities/vha_402',
        },
        website: 'http://www.washingtondc.va.gov',
        lat: 38.9311137,
        long: -77.0109110499999,
        timeZone: 'America/New_York',
        address: {
          mailing: {
            address1: '50 Irving Street, Northwest',
            address2: 'Bldg 2',
            address3: 'Suite 7',
            zip: '20422-0001',
            city: 'Washington',
            state: 'DC',
          },
          physical: {
            address1: '50 Irving Street, Northwest',
            address2: 'Bldg 2',
            address3: 'Suite 7',
            zip: '20422-0001',
            city: 'Washington',
            state: 'DC',
          },
        },
        phone: '1-800-827-1000',
        hours: '"monday: "9:30AM-4:00PM",',
        operationalHoursSpecialInstructions: [
          'More hours are available for some services.',
          'If you need to talk to someone, call the Vet Center at 1-877-927-8387.',
          'Vet Center hours are dependent upon outreach assignments.',
        ],
        services: {
          health: [
            {
              name: 'Example Service Name',
              serviceId: 'exampleServiceId',
              link:
                'http://api.va.gov/services/va_facilities/v1/facilities/vha_558GA/services/covid19Vaccine',
            },
          ],
          benefits: [
            {
              name: 'Example Service Name',
              serviceId: 'exampleServiceId',
              link:
                'http://api.va.gov/services/va_facilities/v1/facilities/vha_558GA/services/covid19Vaccine',
            },
          ],
          other: [
            {
              name: 'Example Service Name',
              serviceId: 'exampleServiceId',
              link:
                'http://api.va.gov/services/va_facilities/v1/facilities/vha_558GA/services/covid19Vaccine',
            },
          ],
          link:
            'http://api.va.gov/services/va_facilities/v1/facilities/vha_558GA/services/',
          lastUpdated: '2018-01-01',
        },
        satisfaction: {
          health: {
            primaryCareUrgent: 0.85,
            primaryCareRoutine: 0.85,
            specialtyCareUrgent: 0.85,
            specialtyCareRoutine: 0.85,
          },
          effectiveDate: '2018-01-01',
        },
        mobile: false,
        operatingStatus: 'NORMAL',
        visn: '20',
      },
    },
  ],
  links: {
    related:
      'https://api.va.gov/services/va_facilities/v1/facilities?id=vha_688',
    self:
      'https://api.va.gov/services/va_facilities/v1/facilities?type=health&page=1&per_page=1000',
    first:
      'https://api.va.gov/services/va_facilities/v1/facilities?type=health&page=1&per_page=1000',
    prev:
      'https://api.va.gov/services/va_facilities/v1/facilities?type=health&page=1&per_page=1000',
    next:
      'https://api.va.gov/services/va_facilities/v1/facilities?type=health&page=2&per_page=1000',
    last:
      'https://api.va.gov/services/va_facilities/v1/facilities?type=health&page=4&per_page=1000',
  },
  meta: {
    pagination: {
      currentPage: 1,
      perPage: 20,
      totalPages: 250,
      totalEntries: 2162,
    },
    distances: [54.13],
  },
};
