import over65 from './over65';
import socialSupplementalSecurity from './socialSupplementalSecurity';
import medicalConditions from './medicalConditions';
import nursingHome from './nursingHome';
import medicaidCoverage from './medicaidCoverage';
import medicaidStatus from './medicaidStatus';
import specialMonthlyPension from './specialMonthlyPension';
import vaTreatmentHistory from './vaTreatmentHistory';
import federalTreatmentHistory from './federalTreatmentHistory';
import currentEmployment from './currentEmployment';
import { currentEmploymentHistoryPages } from './currentEmploymentHistoryPages';
import vaMedicalCenters from './vaMedicalCenters';
import { vaMedicalCentersPages } from './vaMedicalCentersPages';
import federalMedicalCenters from './federalMedicalCenters';
import { federalMedicalCentersPages } from './federalMedicalCentersPages';
import currentEmploymentHistory from './currentEmploymentHistory';
import previousEmploymentHistory from './previousEmploymentHistory';
import { previousEmploymentHistoryPages } from './previousEmploymentHistoryPages';
import additionalEvidence from './additionalEvidence';

export default {
  title: 'Health and employment information',
  pages: {
    over65,
    socialSupplementalSecurity,
    medicalConditions,
    additionalEvidence,
    nursingHome,
    medicaidCoverage,
    medicaidStatus,
    specialMonthlyPension,
    vaTreatmentHistory,
    vaMedicalCenters,
    ...vaMedicalCentersPages,
    federalTreatmentHistory,
    federalMedicalCenters,
    ...federalMedicalCentersPages,
    currentEmployment,
    currentEmploymentHistory,
    ...currentEmploymentHistoryPages,
    previousEmploymentHistory,
    ...previousEmploymentHistoryPages,
  },
};
