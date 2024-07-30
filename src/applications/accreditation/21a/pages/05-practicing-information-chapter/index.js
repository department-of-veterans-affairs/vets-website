import jurisdictionsPages from './jurisdictionsPages';
import agenciesOrCourtsPages from './agenciesOrCourtsPages';

/** @type {PageSchema} */
export default {
  title: 'Practicing information',
  pages: {
    ...jurisdictionsPages,
    ...agenciesOrCourtsPages,
  },
};
