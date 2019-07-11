const mockWidgetFacilitiesList = {
  /* eslint-disable camelcase */
  vha_646: {
    alt: 'The entrance to the Pittsburgh VA Medical Center--University Drive',
    title: '',
    derivative: {
      url:
        'http://stg.va.agile6.com/sites/default/files/styles/crop_3_2/public/2019-02/university-drive-consolidation-building2.jpg?itok=qK823DFr',
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
          health: {
            audiology: { new: 11, established: 3 },
            cardiology: { new: 19, established: 15 },
            dermatology: { new: 14, established: 9 },
            effectiveDate: '2019-04-22',
            gastroenterology: { new: 33, established: 18 },
            gynecology: { new: 21, established: 5 },
            mentalHealth: { new: 7, established: 2 },
            ophthalmology: { new: 17, established: 7 },
            optometry: { new: 15, established: 6 },
            orthopedics: { new: 30, established: 9 },
            primaryCare: { new: 25, established: 8 },
            urology: { new: 18, established: 10 },
          },
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
            effectiveDate: '2018-05-22',
            primaryCareRoutine: 0.88,
            specialtyCareRoutine: 0.91,
            specialtyCareUrgent: 0.76,
          },
        },
      },
    },
  ],
};

module.exports = { mockWidgetFacilitiesList, mockFacilityLocatorApiResponse };
