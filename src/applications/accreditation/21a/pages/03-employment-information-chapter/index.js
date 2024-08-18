import employersPages from './employersPages';
import employmentStatus from './employmentStatus';
import employmentStatusDescription from './employmentStatusDescription';
import employmentActivities from './employmentActivities';

/** @type {PageSchema} */
export default {
  title: 'Employment information',
  pages: {
    ...employersPages,
    employmentStatus,
    employmentStatusDescription,
    employmentActivities,
  },
};
