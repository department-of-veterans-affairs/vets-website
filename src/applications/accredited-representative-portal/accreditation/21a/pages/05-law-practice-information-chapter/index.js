import jurisdictionsPages from './jurisdictionsPages';
import agenciesOrCourtsPages from './agenciesOrCourtsPages';

/** @type {PageSchema} */
export default {
  title: 'Law practice information',
  pages: {
    ...jurisdictionsPages,
    ...agenciesOrCourtsPages,
  },
};
