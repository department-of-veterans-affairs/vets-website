import PropTypes from 'prop-types';

const Form = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  attributes: PropTypes.shape({
    formName: PropTypes.string.isRequired, // same as id
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    lastRevisionOn: PropTypes.string,
    firstIssuedOn: PropTypes.string,
    pages: PropTypes.number,
    sha256: PropTypes.string,
    validPdf: PropTypes.bool,
    formUsage: PropTypes.string,
    formToolIntro: PropTypes.string,
    formToolUrl: PropTypes.string,
    formDetailsUrl: PropTypes.string,
    formType: PropTypes.string,
    language: PropTypes.string,
    deletedAt: PropTypes.string,
    relatedForms: PropTypes.array,
    benefitCategories: PropTypes.array,
    vaFormAdministration: PropTypes.string,
  }).isRequired,
});

const FormMetaInfo = PropTypes.shape({
  query: PropTypes.string,
  currentPage: PropTypes.number,
  totalResultsCount: PropTypes.number,
  totalResultsPages: PropTypes.number,
  currentPositionOnPage: PropTypes.number,
}).isRequired;

export { Form, FormMetaInfo };
