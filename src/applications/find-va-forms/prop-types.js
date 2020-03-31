import PropTypes from 'prop-types';

const Form = PropTypes.shape({
  id: PropTypes.string.isRequired,
  attributes: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    lastRevisionOn: PropTypes.string,
  }).isRequired,
});

export { Form };
