export function fetchVAFacilities(id) {
  return {
    type: 'FETCH_VA_FACILITY',
    payload: {
      id,
      name: 'National Capital Region Benefits Office, Specially Adapted Housing Office',
      address: {
        street1: '1722 I Street, NW',
        street2: '',
        city: 'Washington',
        state: 'DC',
        zip: '20005'
      },
      phone: {
        main: ['202-530-9010', '202-530-9372', '202-530-9405'],
        fax: ['202-530-9046']
      }
    }
  };
}
