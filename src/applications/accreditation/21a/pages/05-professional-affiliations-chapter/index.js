import professionalAffiliationsIntro from './professionalAffiliationsIntro';
import jurisdictionsPages from './jurisdictionsPages';
import agenciesOrCourtsPages from './agenciesOrCourtsPages';

/** @type {PageSchema} */
export default {
  title: 'Professional affiliations',
  pages: {
    professionalAffiliationsIntro,
    ...jurisdictionsPages,
    ...agenciesOrCourtsPages,
  },
};
