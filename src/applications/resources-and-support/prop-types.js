import PropTypes from 'prop-types';

export const Article = PropTypes.shape({
  entityBundle: PropTypes.string.isRequired,
  entityUrl: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
});
