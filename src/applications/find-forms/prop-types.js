import PropTypes from 'prop-types';

const Form = PropTypes.shape({
  id: PropTypes.string.isRequired,
  attributes: PropTypes.shape({
    formName: PropTypes.string.isRequired, // same as id
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    lastRevisionOn: PropTypes.string,
    firstIssuedOn: PropTypes.string, // always null; meaningless property
    sha: PropTypes.string,
    pages: PropTypes.number,
  }).isRequired,
});

export { Form };
