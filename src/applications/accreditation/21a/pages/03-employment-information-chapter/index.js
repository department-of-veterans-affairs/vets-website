import employmentInformationIntro from './employmentInformationIntro';
import employmentStatus from './employmentStatus';
import employmentStatusDescription from './employmentStatusDescription';
import employersPages from './employersPages';
import employmentActivities from './employmentActivities';

/** @type {PageSchema} */
export default {
  title: 'Employment information',
  pages: {
    employmentInformationIntro,
    employmentStatus,
    employmentStatusDescription,
    ...employersPages,
    employmentActivities,
  },
};
