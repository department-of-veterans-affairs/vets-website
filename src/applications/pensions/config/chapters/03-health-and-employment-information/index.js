import age from './age';
import socialSecurityDisability from './socialSecurityDisability';
import medicalCondition from './medicalCondition';
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

export default {
  title: 'Health and employment information',
  pages: {
    age,
    socialSecurityDisability,
    medicalCondition,
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
