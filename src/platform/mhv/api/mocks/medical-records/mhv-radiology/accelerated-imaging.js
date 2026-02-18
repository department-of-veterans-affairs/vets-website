/**
 * Mock data for the accelerated imaging studies endpoint
 * (GET /my_health/v2/medical_records/imaging)
 *
 * The CHEST 2 VIEWS study below has a date that is within 10 minutes of
 * RAD-002-CHEST-XRAY in the accelerated labs mock (2025-01-10T09:15:00Z),
 * so it should merge when the MERGE_IMAGING_STUDIES action fires.
 */

const studies = [
  {
    id: 'urn-vastudy-200CRNR-CM-4-chest-xray-match',
    type: 'imaging_study',
    attributes: {
      id: 'urn-vastudy-200CRNR-CM-4-chest-xray-match',
      identifier:
        'urn:vastudy:200CRNR-CM_4_chest-xray-match~-1012740414V122180',
      status: 'available',
      modality: 'CR',
      date: '2025-01-10T09:17:00Z',
      description: 'CHEST 2 VIEWS PA&LAT',
      notes: ['CHEST 2 VIEWS PA&LAT'],
      patientId: '1012740414V122180',
      seriesCount: 1,
      imageCount: 2,
      series: [
        {
          uid: '1.2.840.113619.2.55.3.604688119.968.1234567890.1',
          number: 1,
          modality: 'CR',
          instances: [
            {
              uid: '1.2.840.113619.2.55.3.604688119.968.1234567890.1.1',
              number: 1,
              title: 'PA View',
              sopClass: '1.2.840.10008.5.1.4.1.1.1',
              imageId:
                'urn:vaimage:200CRNR-CM_7_chest-pa~-CM_4_chest-xray-match~-1012740414V122180',
              thumbnailUrl: null,
            },
            {
              uid: '1.2.840.113619.2.55.3.604688119.968.1234567890.1.2',
              number: 2,
              title: 'LAT View',
              sopClass: '1.2.840.10008.5.1.4.1.1.1',
              imageId:
                'urn:vaimage:200CRNR-CM_7_chest-lat~-CM_4_chest-xray-match~-1012740414V122180',
              thumbnailUrl: null,
            },
          ],
        },
      ],
      dicomZipUrl: null,
    },
  },
];

module.exports = {
  studies,
};
