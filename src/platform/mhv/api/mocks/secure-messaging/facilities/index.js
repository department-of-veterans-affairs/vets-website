const defaultFacilities = {
  data: [
    {
      id: 'vha_534',
      type: 'facility',
      attributes: {
        classification: 'VA Medical Center (VAMC)',
        distance: null,
        facilityType: 'va_health_facility',
        id: 'vha_534',
        lat: 32.784471,
        long: -79.954146,
        mobile: false,
        name: 'Ralph H. Johnson Department of Veterans Affairs Medical Center',
        operationalHoursSpecialInstructions: [
          'Normal business hours are Monday through Friday, 8:00 a.m. to 4:30 p.m.',
        ],
        uniqueId: '534',
        visn: '7',
        website:
          'https://www.va.gov/charleston-health-care/locations/ralph-h-johnson-department-of-veterans-affairs-medical-center/',
        tmpCovidOnlineScheduling: null,
        access: {
          health: [],
          effectiveDate: '',
        },
        address: {
          physical: {
            zip: '29401-5799',
            city: 'Charleston',
            state: 'SC',
            address1: '109 Bee Street',
          },
        },
        feedback: {
          health: {
            primaryCareUrgent: 0,
            primaryCareRoutine: 0.9800000190734863,
            specialtyCareUrgent: 0.7799999713897705,
            specialtyCareRoutine: 0.8999999761581421,
          },
          effectiveDate: '2024-02-08',
        },
        hours: {
          monday: '24/7',
          tuesday: '24/7',
          wednesday: '24/7',
          thursday: '24/7',
          friday: '24/7',
          saturday: '24/7',
          sunday: '24/7',
        },
        operatingStatus: {
          code: 'COMING_SOON',
        },
        phone: {
          fax: '843-937-6100',
          main: '843-577-5011',
          pharmacy: '843-577-5011',
          afterHours: '888-878-6884',
          patientAdvocate: '843-789-6066',
          mentalHealthClinic: '843-577-5011 ext 2,4',
          enrollmentCoordinator: '843-789-6898',
          healthConnect: '855-679-0214',
        },
        services: {
          health: [
            {
              name: 'Anesthesia',
              serviceId: 'anesthesia',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/anesthesia',
            },
            {
              name: 'Audiology and speech',
              serviceId: 'audiology',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/audiology',
            },
            {
              name: 'Bariatric surgery',
              serviceId: 'bariatricSurgery',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/bariatricSurgery',
            },
            {
              name: 'Cancer care',
              serviceId: 'cancer',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/cancer',
            },
            {
              name: 'Cardiology',
              serviceId: 'cardiology',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/cardiology',
            },
            {
              name: 'CaregiverSupport',
              serviceId: 'caregiverSupport',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/caregiverSupport',
            },
            {
              name: 'COVID-19 vaccines',
              serviceId: 'covid19Vaccine',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/covid19Vaccine',
            },
            {
              name: 'Dermatology',
              serviceId: 'dermatology',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/dermatology',
            },
            {
              name: 'Emergency care',
              serviceId: 'emergencyCare',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/emergencyCare',
            },
            {
              name: 'Gastroenterology',
              serviceId: 'gastroenterology',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/gastroenterology',
            },
            {
              name: 'Geriatrics',
              serviceId: 'geriatrics',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/geriatrics',
            },
            {
              name: 'Gynecology',
              serviceId: 'gynecology',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/gynecology',
            },
            {
              name: 'Hematology/oncology',
              serviceId: 'hematology',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/hematology',
            },
            {
              name: 'Homeless Veteran care',
              serviceId: 'homeless',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/homeless',
            },
            {
              name: 'Palliative and hospice care',
              serviceId: 'hospice',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/hospice',
            },
            {
              name: 'LGBTQ+ Veteran care',
              serviceId: 'lgbtq',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/lgbtq',
            },
            {
              name: 'Mental health care',
              serviceId: 'mentalHealth',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/mentalHealth',
            },
            {
              name: 'Minority Veteran care',
              serviceId: 'minorityCare',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/minorityCare',
            },
            {
              name: 'My HealtheVet coordinator',
              serviceId: 'myHealtheVetCoordinator',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/myHealtheVetCoordinator',
            },
            {
              name: 'Nutrition, food, and dietary care',
              serviceId: 'nutrition',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/nutrition',
            },
            {
              name: 'Ophthalmology',
              serviceId: 'ophthalmology',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/ophthalmology',
            },
            {
              name: 'Optometry',
              serviceId: 'optometry',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/optometry',
            },
            {
              name: 'Orthopedics',
              serviceId: 'orthopedics',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/orthopedics',
            },
            {
              name: 'Pain management',
              serviceId: 'painManagement',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/painManagement',
            },
            {
              name: 'Patient advocates',
              serviceId: 'patientAdvocates',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/patientAdvocates',
            },
            {
              name: 'Pharmacy',
              serviceId: 'pharmacy',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/pharmacy',
            },
            {
              name: 'Podiatry',
              serviceId: 'podiatry',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/podiatry',
            },
            {
              name: 'Primary care',
              serviceId: 'primaryCare',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/primaryCare',
            },
            {
              name: 'Rehabilitation and extended care',
              serviceId: 'rehabilitation',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/rehabilitation',
            },
            {
              name: 'Sleep medicine',
              serviceId: 'sleepMedicine',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/sleepMedicine',
            },
            {
              name: 'Smoking and tobacco cessation',
              serviceId: 'smoking',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/smoking',
            },
            {
              name: 'Social work',
              serviceId: 'socialWork',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/socialWork',
            },
            {
              name: 'Suicide prevention',
              serviceId: 'suicidePrevention',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/suicidePrevention',
            },
            {
              name: 'Returning service member care',
              serviceId: 'transitionCounseling',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/transitionCounseling',
            },
            {
              name: 'Urgent care',
              serviceId: 'urgentCare',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/urgentCare',
            },
            {
              name: 'Urology',
              serviceId: 'urology',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/urology',
            },
            {
              name: 'MOVE! weight management',
              serviceId: 'weightManagement',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/weightManagement',
            },
            {
              name: 'Women Veteran care',
              serviceId: 'womensHealth',
              link:
                'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services/womensHealth',
            },
          ],
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_534/services',
          lastUpdated: '2025-02-01',
        },
      },
    },
  ],
  //   attributes: {
  //     profile: {
  //       signIn: {
  //         serviceName: 'idme',
  //         authBroker: 'iam',
  //         ssoe: true,
  //       },
  //       email: 'fake@fake.com',
  //       loa: { current: 3 },
  //       firstName: 'Gina',
  //       middleName: '',
  //       lastName: 'Doe',
  //       gender: 'F',
  //       birthDate: '1985-01-01',
  //       verified: true,
  //     },
  //     session: {
  //       authBroker: 'iam',
  //       ssoe: true,
  //       transactionid: 'sf8mUOpuAoxkx8uWxI6yrBAS/t0yrsjDKqktFz255P0=',
  //     },
  //     veteranStatus: {
  //       status: 'OK',
  //       isVeteran: true,
  //       servedInMilitary: true,
  //     },
  //     inProgressForms: [],
  //     prefillsAvailable: ['21-526EZ'],
  //     services: [
  //       'facilities',
  //       'hca',
  //       'edu-benefits',
  //       'evss-claims',
  //       'form526',
  //       'user-profile',
  //       'health-records',
  //       'rx',
  //       'messaging',
  //     ],
  //     vaProfile: {
  //       status: 'OK',
  //       birthDate: '19511118',
  //       familyName: 'Hunter',
  //       gender: 'M',
  //       givenNames: ['Julio', 'E'],
  //       activeStatus: 'active',
  //       facilities: [
  //         {
  //           facilityId: '983',
  //           isCerner: false,
  //         },
  //         {
  //           facilityId: '984',
  //           isCerner: false,
  //         },
  //       ],
  //       mhvAccountState: 'OK',
  //     },
  //   },
  // },
  // meta: { errors: null },
};

module.exports = {
  defaultFacilities,
};
