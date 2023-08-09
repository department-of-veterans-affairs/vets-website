/* eslint-disable camelcase */
const vamcEhrData = {
  data: {
    node_query: {
      count: 2,
      entities: [
        {
          title: 'Seattle VA Medical Center',
          field_facility_locator_api_id: 'vha_663',
          field_region_page: {
            entity: {
              title: 'VA Puget Sound health care',
              field_vamc_ehr_system: 'vista',
            },
          },
        },
        {
          title:
            'Mann-Grandstaff Department of Veterans Affairs Medical Center',
          field_facility_locator_api_id: 'vha_668',
          field_region_page: {
            entity: {
              title: 'VA Spokane health care',
              field_vamc_ehr_system: 'cerner',
            },
          },
        },
      ],
    },
  },
};

export { vamcEhrData };
