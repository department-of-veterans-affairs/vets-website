const resultsData = {
  data: [
    {
      id: 'vha_691GE',
      type: 'va_facilities',
      attributes: {
        uniqueId: '691GE',
        name: 'Los Angeles VA Clinic',
        facilityType: 'va_health_facility',
        classification: 'Multi-Specialty CBOC',
        website: null,
        lat: 34.05171284,
        long: -77.52753613,
        address: {
          physical: {
            address1: '351 East Temple Street',
            address2: null,
            address3: null,
            city: 'Los Angeles',
            state: 'CA',
            zip: '90012-3328',
          },
          mailing: {},
        },
        phone: {
          main: '213-253-5000 x',
          fax: '213-253-5510 x',
          afterHours: '877-252-4866 x',
          patientAdvocate: '213-253-2677 x24111',
          enrollmentCoordinator: '213-253-2677 x24033',
          pharmacy: '800-952-4852 x',
          mentalHealthClinic: '310-268-4449',
        },
        hours: {
          monday: '700AM-530PM',
          tuesday: '700AM-530PM',
          wednesday: '700AM-530PM',
          thursday: '700AM-530PM',
          friday: '700AM-530PM',
          saturday: '-',
          sunday: '-',
        },
        services: {
          lastUpdated: '2017-07-24',
          health: [
            {
              sl1: ['DentalServices'],
              sl2: [],
            },
            {
              sl1: ['MentalHealthCare'],
              sl2: [],
            },
            {
              sl1: ['PrimaryCare'],
              sl2: [],
            },
          ],
        },
        feedback: {
          health: {
            primaryCareUrgent: '0.78',
            primaryCareRoutine: '0.77',
            effectiveDate: '2017-03-24',
          },
        },
        access: {
          health: {
            primaryCare: {
              new: 15,
              established: 3,
            },
            mentalHealth: {
              new: 12,
              established: 2,
            },
            womensHealth: {
              new: null,
              established: 9,
            },
            audiology: {
              new: 48,
              established: 0,
            },
            gastroenterology: {
              new: 7,
              established: null,
            },
            opthalmology: {
              new: 9,
              established: 6,
            },
            optometry: {
              new: 14,
              established: 5,
            },
            urologyClinic: {
              new: 23,
              established: 3,
            },
            effectiveDate: '2017-08-14',
          },
        },
      },
    },
    {
      id: 'vba_343o',
      type: 'va_facilities',
      attributes: {
        uniqueId: '343o',
        name: 'Los Angeles Ambulatory Care Center',
        facilityType: 'va_benefits_facility',
        classification: 'OUTBASED',
        website: null,
        lat: 34.05171315,
        long: -118.2387403,
        address: {
          physical: {
            address1: '351 East Temple Street',
            address2: 'Room A-444',
            address3: null,
            city: 'Los Angeles',
            state: 'CA',
            zip: '90012',
          },
          mailing: {},
        },
        phone: {
          main: '213-253-2677 Ext 24759',
          fax: '',
        },
        hours: {
          monday: '8:00AM-2:30PM',
          tuesday: '8:00AM-2:30PM',
          wednesday: '8:00AM-2:30PM',
          thursday: '8:00AM-2:30PM',
          friday: 'By Appointment Only',
          saturday: 'Closed',
          sunday: 'Closed',
        },
        services: {
          benefits: {
            other: '',
            standard: [],
          },
        },
        feedback: {},
        access: {},
      },
    },
    {
      id: 'vha_688',
      type: 'facility',
      attributes: {
        classification: 'VA Medical Center (VAMC)',
        distance: null,
        facilityType: 'va_health_facility',
        id: 'vha_688',
        lat: 38.929401,
        long: -77.0111955,
        mobile: false,
        name: 'Washington VA Medical Center',
        operationalHoursSpecialInstructions: [
          'Normal business hours are Monday through Friday, 8:00 a.m. to 4:30 p.m.',
        ],
        uniqueId: '688',
        visn: '5',
        website:
          'https://www.va.gov/washington-dc-health-care/locations/washington-va-medical-center/',
        tmpCovidOnlineScheduling: null,
        access: {
          health: [],
          effectiveDate: '',
        },
        address: {
          physical: {
            zip: '20422-0001',
            city: 'Washington',
            state: 'DC',
            address1: '50 Irving Street, Northwest',
          },
        },
        feedback: {
          health: {
            primaryCareUrgent: 0.6800000071525574,
            primaryCareRoutine: 0.8199999928474426,
            specialtyCareUrgent: 0.7400000095367432,
            specialtyCareRoutine: 0.7900000214576721,
          },
          effectiveDate: '2025-02-04',
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
          code: 'NORMAL',
        },
        phone: {
          fax: '202-745-8530',
          main: '202-745-8000',
          pharmacy: '202-745-8235',
          afterHours: '202-745-8000',
          patientAdvocate: '202-745-8588',
          mentalHealthClinic: '202-745-8000, ext. 58127',
          enrollmentCoordinator: '202-745-8000 x56333',
          healthConnect: '855-679-0250',
        },
        services: {
          health: [
            {
              name: 'Advice nurse',
              serviceId: 'adviceNurse',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/adviceNurse',
            },
            {
              name: 'Anesthesia',
              serviceId: 'anesthesia',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/anesthesia',
            },
            {
              name: 'Audiology',
              serviceId: 'audiology',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/audiology',
            },
            {
              name: 'Cardiology',
              serviceId: 'cardiology',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/cardiology',
            },
            {
              name: 'CaregiverSupport',
              serviceId: 'caregiverSupport',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/caregiverSupport',
            },

            {
              name: 'Dental/oral surgery',
              serviceId: 'dental',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/dental',
            },
            {
              name: 'Dermatology',
              serviceId: 'dermatology',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/dermatology',
            },
            {
              name: 'Emergency care',
              serviceId: 'emergencyCare',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/emergencyCare',
            },
            {
              name: 'Gastroenterology',
              serviceId: 'gastroenterology',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/gastroenterology',
            },
            {
              name: 'Geriatrics',
              serviceId: 'geriatrics',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/geriatrics',
            },
            {
              name: 'Gynecology',
              serviceId: 'gynecology',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/gynecology',
            },
            {
              name: 'Hematology/oncology',
              serviceId: 'hematology',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/hematology',
            },
            {
              name: 'Homeless Veteran care',
              serviceId: 'homeless',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/homeless',
            },
            {
              name: 'Palliative and hospice care',
              serviceId: 'hospice',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/hospice',
            },
            {
              name: 'HospitalMedicine',
              serviceId: 'hospitalMedicine',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/hospitalMedicine',
            },
            {
              name: 'Laboratory and pathology',
              serviceId: 'laboratory',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/laboratory',
            },
            {
              name: 'Mental health care',
              serviceId: 'mentalHealth',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/mentalHealth',
            },
            {
              name: 'Nutrition, food, and dietary care',
              serviceId: 'nutrition',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/nutrition',
            },
            {
              name: 'Ophthalmology',
              serviceId: 'ophthalmology',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/ophthalmology',
            },
            {
              name: 'Optometry',
              serviceId: 'optometry',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/optometry',
            },
            {
              name: 'Orthopedics',
              serviceId: 'orthopedics',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/orthopedics',
            },
            {
              name: 'Patient advocates',
              serviceId: 'patientAdvocates',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/patientAdvocates',
            },
            {
              name: 'Pharmacy',
              serviceId: 'pharmacy',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/pharmacy',
            },
            {
              name: 'Physical medicine and rehabilitation',
              serviceId: 'physicalMedicine',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/physicalMedicine',
            },
            {
              name: 'Podiatry',
              serviceId: 'podiatry',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/podiatry',
            },
            {
              name: 'Primary care',
              serviceId: 'primaryCare',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/primaryCare',
            },
            {
              name: 'Psychology',
              serviceId: 'psychology',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/psychology',
            },
            {
              name: 'Rehabilitation and extended care',
              serviceId: 'rehabilitation',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/rehabilitation',
            },
            {
              name: 'Suicide prevention',
              serviceId: 'suicidePrevention',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/suicidePrevention',
            },
            {
              name: 'Surgery',
              serviceId: 'surgery',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/surgery',
            },
            {
              name: 'Returning service member care',
              serviceId: 'transitionCounseling',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/transitionCounseling',
            },
            {
              name: 'Transplant surgery',
              serviceId: 'transplantSurgery',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/transplantSurgery',
            },
            {
              name: 'Urology',
              serviceId: 'urology',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/urology',
            },
            {
              name: 'Women Veteran care',
              serviceId: 'womensHealth',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/womensHealth',
            },
          ],
          link: 'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services',
          lastUpdated: '2025-02-19',
        },
      },
    },
    {
      id: 'vba_344l',
      type: 'facility',
      attributes: {
        classification: 'VetSuccess On Campus',
        distance: null,
        facilityType: 'va_benefits_facility',
        id: 'vba_344l',
        lat: 34.0865467,
        long: -118.2930592,
        mobile: null,
        name: 'VetSuccess on Campus at Los Angeles City College',
        operationalHoursSpecialInstructions: null,
        uniqueId: '344l',
        visn: null,
        website: null,
        tmpCovidOnlineScheduling: null,
        access: {
          health: [],
          effectiveDate: '',
        },
        address: {
          physical: {
            zip: '90029',
            city: 'Los Angeles',
            state: 'CA',
            address1: '855 North Vermont',
          },
        },
        feedback: [],
        hours: {
          monday: '9:00 a.m. - 5:30 p.m.',
          tuesday: 'Closed',
          wednesday: 'Closed',
          thursday: 'Closed',
          friday: 'Closed',
          saturday: 'Closed',
          sunday: 'Closed',
        },
        operatingStatus: {
          code: 'VIRTUAL_CARE',
          additionalInfo:
            "We're not open for in-person service at this time. Our staff are still available by phone and by our online customer service tool.",
        },
        phone: {
          main: '323-953-4000, ext. 1253',
        },
        services: {
          benefits: [
            {
              name: 'ApplyingForBenefits',
              serviceId: 'applyingForBenefits',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vba_344l/services/applyingForBenefits',
            },
            {
              name: 'EducationAndCareerCounseling',
              serviceId: 'educationAndCareerCounseling',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vba_344l/services/educationAndCareerCounseling',
            },
            {
              name: 'EducationClaimAssistance',
              serviceId: 'educationClaimAssistance',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vba_344l/services/educationClaimAssistance',
            },
            {
              name: 'VocationalRehabilitationAndEmploymentAssistance',
              serviceId: 'vocationalRehabilitationAndEmploymentAssistance',
              link: 'https://api.va.gov/services/va_facilities/v1/facilities/vba_344l/services/vocationalRehabilitationAndEmploymentAssistance',
            },
          ],
          link: 'https://api.va.gov/services/va_facilities/v1/facilities/vba_344l/services',
        },
      },
    },
  ],
  links: {
    self: 'http://www.example.com/v0/facilities/va?bbox%5B%5D=-118.53149414062501&bbox%5B%5D=33.91487347147951&bbox%5B%5D=-118.07762145996095&bbox%5B%5D=34.199308935560154&page=1',
    first:
      'http://www.example.com/v0/facilities/va?bbox%5B%5D=-118.53149414062501&bbox%5B%5D=33.91487347147951&bbox%5B%5D=-118.07762145996095&bbox%5B%5D=34.199308935560154&page=1&per_page=20',
    prev: null,
    next: null,
    last: 'http://www.example.com/v0/facilities/va?bbox%5B%5D=-118.53149414062501&bbox%5B%5D=33.91487347147951&bbox%5B%5D=-118.07762145996095&bbox%5B%5D=34.199308935560154&page=1&per_page=20',
  },
  meta: {
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalPages: 1,
      totalEntries: 3,
    },
  },
};

// Create API routes
function initApplicationMock(name = 'searchFacilities') {
  cy.intercept('POST', '/facilities_api/v2/va', resultsData).as(name);

  return resultsData.data.map((cur, i) =>
    cy
      .intercept('GET', `/facilities_api/v2/va/${resultsData.data[i].id}`, {
        data: resultsData.data[i],
      })
      .as(`${name}${i}`),
  );
}

module.exports = {
  initApplicationMock,
};
