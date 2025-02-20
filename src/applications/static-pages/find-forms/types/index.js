import PropTypes from 'prop-types';

export const FormTypes = PropTypes.shape({
  id: PropTypes.string,
  type: PropTypes.string,
  attributes: PropTypes.shape({
    benefitCategories: PropTypes.arrayOf(PropTypes.string),
    deletedAt: PropTypes.string,
    firstIssuedOn: PropTypes.string,
    formDetailsUrl: PropTypes.string,
    formName: PropTypes.string,
    formToolIntro: PropTypes.string,
    formToolUrl: PropTypes.string,
    formType: PropTypes.string,
    formUsage: PropTypes.string,
    language: PropTypes.string,
    lastRevisionOn: PropTypes.string,
    lastSha256Change: PropTypes.string,
    pages: PropTypes.number,
    relatedForms: PropTypes.arrayOf(PropTypes.string),
    sha256: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
    vaFormAdministration: PropTypes.string,
    validPdf: PropTypes.bool,
  }),
});

export const FormMetaInfoTypes = PropTypes.shape({
  currentPage: PropTypes.number,
  currentPositionOnPage: PropTypes.number,
  query: PropTypes.string,
  totalResultsCount: PropTypes.number,
  totalResultsPages: PropTypes.number,
});
