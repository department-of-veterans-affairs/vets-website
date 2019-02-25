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
      },
    },
  ],
};

module.exports = { mockWidgetFacilitiesList, mockFacilityLocatorApiResponse };
