import {
  generateMedicalCentersSchemas,
  hasVaTreatmentHistory,
} from './helpers';
import { showMultiplePageResponse } from '../../../helpers';

export default {
  title: 'VA medical centers',
  path: 'medical/history/va-treatment/medical-centers',
  depends: formData =>
    !showMultiplePageResponse() && hasVaTreatmentHistory(formData),
  ...generateMedicalCentersSchemas(
    'vaMedicalCenters',
    'VA medical centers',
    'Enter all VA medical centers where you have received treatment',
    'VA medical center',
    'VA medical centers',
  ),
};
