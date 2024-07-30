import employersPages from './employersPages';
import employmentActivitiesPage from './employmentActivities';

/** @type {PageSchema} */
export default {
  title: 'Employment history',
  pages: {
    ...employersPages,
    employmentActivitiesPage,
  },
};
