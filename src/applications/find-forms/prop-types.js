import PropTypes from 'prop-types';

const Form = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  attributes: PropTypes.shape({
    formName: PropTypes.string.isRequired, // same as id
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    lastRevisionOn: PropTypes.string,
    firstIssuedOn: PropTypes.string, // always null; meaningless property
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
  }).isRequired,
});

export { Form };
