/**
 * Mocks Facility object.
 *
 * @export
 * @returns {Facility} VAOS Facility object
 */
export function Facility(facilityId) {
  const id = facilityId || '983';
  return {
    resourceType: 'Location',
    id,
    vistaId: id,
    name: 'Cheyenne VA Medical Center',
    telecom: [
      {
        system: 'phone',
        value: '509-434-7000',
      },
    ],
    address: {
      postalCode: '82001-5356',
      city: 'Cheyenne',
      state: 'WY',
      line: ['2360 East Pershing Boulevard'],
    },
  };
}
