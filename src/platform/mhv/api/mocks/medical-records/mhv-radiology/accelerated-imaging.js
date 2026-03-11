/**
 * Mock data for the accelerated imaging studies endpoints
 *
 * Endpoints served:
 *   GET /my_health/v2/medical_records/imaging             → studies list
 *   GET /my_health/v2/medical_records/imaging/:id/thumbnails → study w/ presigned thumbnail URLs
 *   GET /my_health/v2/medical_records/imaging/:id/dicom      → study w/ presigned DICOM zip URL
 *   GET /my_health/v2/medical_records/imaging/thumbnail_proxy → serves a JPEG placeholder
 *
 * Each study date is set to match its corresponding radiology lab record
 * in the accelerated labs mock (within the 10-minute merge tolerance), so
 * they will pair correctly when the MERGE_IMAGING_STUDIES action fires:
 *   Study 1 (CHEST)   → 2024-12-05T12:50  matches FACIAL BONE lab
 *   Study 2 (ABDOMEN) → 2024-12-05T14:30  matches ABDOMEN lab
 */

const path = require('path');

// ---------------------------------------------------------------------------
// Study data
// ---------------------------------------------------------------------------

const STUDY_1_ID = 'urn-vastudy-200CRNR-CM-4-chest-xray-match';
const STUDY_2_ID = 'urn-vastudy-200CRNR-CM-5-abdomen-match';

const makeStudy = ({
  id,
  identifier,
  description,
  notes,
  imageCount,
  series,
  date,
  thumbnailsReady = false,
  dicomReady = false,
}) => ({
  id,
  type: 'imaging_study',
  attributes: {
    id,
    identifier,
    status: 'available',
    modality: 'CR',
    date,
    description,
    notes,
    patientId: '1012740414V122180',
    seriesCount: series.length,
    imageCount,
    series: series.map(s => ({
      ...s,
      instances: s.instances.map(inst => ({
        ...inst,
        thumbnailUrl: thumbnailsReady
          ? `https://s3.amazonaws.com/mock-va-imaging/thumbnails/${
              inst.imageId
            }.jpg`
          : null,
      })),
    })),
    dicomZipUrl: dicomReady
      ? `https://s3.amazonaws.com/mock-va-imaging/dicom/${id}.zip`
      : null,
  },
});

const study1Series = [
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
      },
      {
        uid: '1.2.840.113619.2.55.3.604688119.968.1234567890.1.2',
        number: 2,
        title: 'LAT View',
        sopClass: '1.2.840.10008.5.1.4.1.1.1',
        imageId:
          'urn:vaimage:200CRNR-CM_7_chest-lat~-CM_4_chest-xray-match~-1012740414V122180',
      },
    ],
  },
];

const study2Series = [
  {
    uid: '1.2.840.113619.2.55.3.604688119.968.9876543210.1',
    number: 1,
    modality: 'CR',
    instances: [
      {
        uid: '1.2.840.113619.2.55.3.604688119.968.9876543210.1.1',
        number: 1,
        title: 'AP View',
        sopClass: '1.2.840.10008.5.1.4.1.1.1',
        imageId:
          'urn:vaimage:200CRNR-CM_8_abd-ap~-CM_5_abdomen-match~-1012740414V122180',
      },
      {
        uid: '1.2.840.113619.2.55.3.604688119.968.9876543210.1.2',
        number: 2,
        title: 'LAT View',
        sopClass: '1.2.840.10008.5.1.4.1.1.1',
        imageId:
          'urn:vaimage:200CRNR-CM_8_abd-lat~-CM_5_abdomen-match~-1012740414V122180',
      },
      {
        uid: '1.2.840.113619.2.55.3.604688119.968.9876543210.1.3',
        number: 3,
        title: 'PA Chest View',
        sopClass: '1.2.840.10008.5.1.4.1.1.1',
        imageId:
          'urn:vaimage:200CRNR-CM_8_chest-pa~-CM_5_abdomen-match~-1012740414V122180',
      },
    ],
  },
];

// Build study variants
const study1Args = {
  id: STUDY_1_ID,
  identifier: 'urn:vastudy:200CRNR-CM_4_chest-xray-match~-1012740414V122180',
  description: 'CHEST 2 VIEWS PA&LAT',
  notes: ['CHEST 2 VIEWS PA&LAT'],
  imageCount: 2,
  date: '2024-12-05T12:50:00+00:00',
  series: study1Series,
};

const study2Args = {
  id: STUDY_2_ID,
  identifier: 'urn:vastudy:200CRNR-CM_5_abdomen-match~-1012740414V122180',
  description: 'ABDOMEN 2 + PA & LAT CHEST',
  notes: ['ABDOMEN 2 + PA & LAT CHEST'],
  imageCount: 3,
  date: '2024-12-05T14:30:00+00:00',
  series: study2Series,
};

// ---------------------------------------------------------------------------
// List endpoint – thumbnails & DICOM URLs are null at this stage
// ---------------------------------------------------------------------------

const studies = [makeStudy({ ...study1Args }), makeStudy({ ...study2Args })];

// ---------------------------------------------------------------------------
// Route handlers
// ---------------------------------------------------------------------------

const studyMap = {
  [STUDY_1_ID]: study1Args,
  [STUDY_2_ID]: study2Args,
};

/** GET /my_health/v2/medical_records/imaging/:id/thumbnails */
const thumbnails = (req, res) => {
  const args = studyMap[req.params.id];
  if (!args) {
    return res
      .status(404)
      .json({ errors: [{ title: 'Not found', status: '404' }] });
  }
  return res.json([makeStudy({ ...args, thumbnailsReady: true })]);
};

/** GET /my_health/v2/medical_records/imaging/:id/dicom */
const dicom = (req, res) => {
  const args = studyMap[req.params.id];
  if (!args) {
    return res
      .status(404)
      .json({ errors: [{ title: 'Not found', status: '404' }] });
  }
  return res.json([makeStudy({ ...args, dicomReady: true })]);
};

/** GET /my_health/v2/medical_records/imaging/thumbnail_proxy?url=... */
const thumbnailProxy = (_req, res) => {
  const filePath = path.resolve(__dirname, '01.jpeg');
  res.type('image/jpeg').sendFile(filePath);
};

module.exports = {
  studies,
  thumbnails,
  dicom,
  thumbnailProxy,
};
