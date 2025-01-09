import {
  generateMedicalCentersSchemas,
  hasFederalTreatmentHistory,
} from './helpers';
import { showMultiplePageResponse } from '../../../helpers';

export default {
  title: 'Federal medical facilities',
  path: 'medical/history/federal-treatment/medical-centers',
  depends: formData =>
    !showMultiplePageResponse() && hasFederalTreatmentHistory(formData),
  ...generateMedicalCentersSchemas(
    'federalMedicalCenters',
    'Federal medical facilities',
    'Enter all federal medical facilities where you have received treatment within the last year',
    'Federal medical center',
    'Federal medical centers',
  ),
};
