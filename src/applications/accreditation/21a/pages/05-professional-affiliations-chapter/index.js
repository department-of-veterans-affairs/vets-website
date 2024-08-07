import agenciesOrCourtsIntro from './agenciesOrCourtsIntro';
import jurisdictionsPages from './jurisdictionsPages';
import agenciesOrCourtsPages from './agenciesOrCourtsPages';

/** @type {PageSchema} */
export default {
  title: 'Professional affiliations',
  pages: {
    intro: agenciesOrCourtsIntro,
    ...jurisdictionsPages,
    ...agenciesOrCourtsPages,
  },
};
