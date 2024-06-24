import {
  generateMedicalCentersSchemas,
  hasFederalTreatmentHistory,
} from './helpers';

export default {
  title: 'Federal medical facilities',
  path: 'medical/history/federal-treatment/medical-centers',
  depends: hasFederalTreatmentHistory,
  ...generateMedicalCentersSchemas(
    'federalMedicalCenters',
    'Federal medical facilities',
    'Enter all federal medical facilities where you have received treatment within the last year',
    'Federal medical center',
    'Federal medical centers',
  ),
};
