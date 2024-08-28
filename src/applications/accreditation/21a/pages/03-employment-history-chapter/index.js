import employmentStatus from './employmentStatus';
import employersPages from './employersPages';
import employmentActivities from './employmentActivities';

/** @type {PageSchema} */
export default {
  title: 'Employment history',
  pages: {
    ...employersPages,
    employmentStatus,
    employmentActivities,
  },
};
