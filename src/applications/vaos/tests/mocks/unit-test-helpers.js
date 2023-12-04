/**
 * Mocks Atlas Appoinment.
 *
 * @export
 * @returns {AtlasAppoinment} VAOS Atlas Appoinment object
 */
export function AtlasAppoinment() {
  return {
    videoData: {
      providers: [
        {
          name: {
            firstName: ['TEST'],
            lastName: 'PROV',
          },
          display: 'TEST PROV',
        },
      ],
      isVideo: true,
      isAtlas: true,
      atlasConfirmationCode: '7VBBCA',
      atlasLocation: {
        id: '9931',
        resourceType: 'Location',
        address: {
          line: ['114 Dewey Ave'],
          city: 'Eureka',
          state: 'MT',
          postalCode: '59917',
        },
        position: {
          longitude: -115.1,
          latitude: 48.8,
        },
      },
      extension: { patientHasMobileGfe: true },
      kind: 'ADHOC',
    },
  };
}
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
