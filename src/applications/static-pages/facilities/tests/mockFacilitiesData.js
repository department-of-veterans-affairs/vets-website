const mockWidgetFacilitiesList = {
  /* eslint-disable camelcase */
  vha_646: {
    alt: 'The entrance to the Pittsburgh VA Medical Center--University Drive',
    title: '',
    derivative: {
      url:
        'http://stg.va.agile6.com/sites/default/files/styles/3_2_medium_thumbnail/public/2019-02/university-drive-consolidation-building2.jpg?itok=qK823DFr',
      width: 480,
      height: 330,
    },
    entityUrl: {
      path: '/pittsburgh-health-care/locations/university-drive-campus',
    },
  },
};

const mockFacilityLocatorApiResponse = {
  data: [
    {
      id: 'vha_646',
      type: 'va_facilities',
      attributes: {
        access: {
          health: [
            {
              service: 'MentalHealthCare',
              new: 5.75,
              established: 6.625,
            },
            {
              service: 'PrimaryCare',
              new: 4.076923,
              established: 2.773869,
            },
            {
              service: 'SpecialtyCare',
              new: 5,
              established: 0.5,
            },
          ],
          effectiveDate: '2020-07-27',
        },
        uniqueId: '646',
        name: 'Pittsburgh VA Medical Center-University Drive',
        facilityType: 'va_health_facility',
        classification: 'VA Medical Center (VAMC)',
        website: 'http://www.pittsburgh.va.gov',
        lat: 40.4447346700001,
        long: -79.95960314,
        address: {
          mailing: {},
          physical: {
            zip: '15240-1003',
            city: 'Pittsburgh',
            state: 'PA',
            address1: 'University Drive C',
            address2: null,
            address3: null,
          },
        },
        phone: {
          fax: '412-360-6789 x',
          main: '866-482-7488 x',
          pharmacy: '412-360-6119 x',
          afterHours: '412-360-6000 x',
          patientAdvocate: '412-360-3614 x',
          mentalHealthClinic: '412-360-6600',
          enrollmentCoordinator: '412-360-6993 x',
        },
        feedback: {
          health: {
            primaryCareRoutine: 0.88,
            specialtyCareRoutine: 0.91,
            specialtyCareUrgent: 0.76,
          },
          effectiveDate: '2018-05-22',
        },
      },
    },
  ],
};

const mockFeedbackZeroValues = {
  data: [
    {
      id: 'vha_561GE',
      type: 'facility',
      attributes: {
        access: {
          health: [
            {
              service: 'MentalHealthCare',
              new: 4.333333,
              established: 22.802325,
            },
            {
              service: 'PrimaryCare',
              new: 5.545454,
              established: 0.551282,
            },
          ],
          effectiveDate: '2021-06-21',
        },
        activeStatus: 'A',
        address: {
          mailing: {},
          physical: {
            zip: '07302-3551',
            city: 'Jersey City',
            state: 'NJ',
            address1: '115 Christopher Columbus Drive',
            address2: null,
            address3: 'Suite 201',
          },
        },
        classification: 'Primary Care CBOC',
        detailedServices: null,
        facilityType: 'va_health_facility',
        feedback: {
          health: {
            primaryCareUrgent: 1,
            primaryCareRoutine: 0,
          },
          effectiveDate: '2021-03-05',
        },
        hours: {
          monday: '800AM-430PM',
          tuesday: '800AM-430PM',
          wednesday: '800AM-430PM',
          thursday: '800AM-430PM',
          friday: '800AM-430PM',
          saturday: 'Closed',
          sunday: 'Closed',
        },
        id: 'vha_561GE',
        lat: 40.71982227,
        long: -74.04397858,
        mobile: false,
        name: 'Jersey City VA Clinic',
        operatingStatus: {
          code: 'NORMAL',
        },
        operationalHoursSpecialInstructions: null,
        phone: {
          fax: '201-435-3198',
          main: '201-435-3055',
          pharmacy: '800-480-5590',
          afterHours: '973-676-1000',
          patientAdvocate: '908-720-8227',
          mentalHealthClinic: '973-676-1000 x 1421',
          enrollmentCoordinator: '973-676-1000 x203044',
        },
        services: {
          other: [],
          health: ['MentalHealthCare', 'PrimaryCare'],
          lastUpdated: '2021-06-21',
        },
        uniqueId: '561GE',
        visn: '2',
        website: 'https://www.newjersey.va.gov/locations/JerseyCity.asp',
      },
    },
  ],
};

module.exports = {
  mockWidgetFacilitiesList,
  mockFacilityLocatorApiResponse,
  mockFeedbackZeroValues,
};
