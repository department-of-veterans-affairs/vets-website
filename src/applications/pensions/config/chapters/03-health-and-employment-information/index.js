import age from './age';
import over65 from './over65';
import socialSecurityDisability from './socialSecurityDisability';
import socialSupplementalSecurity from './socialSupplementalSecurity';
import medicalCondition from './medicalCondition';
import medicalConditions from './medicalConditions';
import nursingHome from './nursingHome';
import medicaidCoverage from './medicaidCoverage';
import medicaidStatus from './medicaidStatus';
import specialMonthlyPension from './specialMonthlyPension';
import vaTreatmentHistory from './vaTreatmentHistory';
import federalTreatmentHistory from './federalTreatmentHistory';
import currentEmployment from './currentEmployment';
import vaMedicalCenters from './vaMedicalCenters';
import federalMedicalCenters from './federalMedicalCenters';
import currentEmploymentHistory from './currentEmploymentHistory';
import previousEmploymentHistory from './previousEmploymentHistory';
import additionalEvidence from './additionalEvidence';

export default {
  title: 'Health and employment information',
  pages: {
    age,
    over65,
    socialSecurityDisability,
    socialSupplementalSecurity,
    medicalCondition,
    medicalConditions,
    additionalEvidence,
    nursingHome,
    medicaidCoverage,
    medicaidStatus,
    specialMonthlyPension,
    vaTreatmentHistory,
    vaMedicalCenters,
    federalTreatmentHistory,
    federalMedicalCenters,
    currentEmployment,
    currentEmploymentHistory,
    previousEmploymentHistory,
  },
};
