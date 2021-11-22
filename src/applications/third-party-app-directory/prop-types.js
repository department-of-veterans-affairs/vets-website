import PropTypes from 'prop-types';

export const SearchResultPropTypes = PropTypes.shape({
  appUrl: PropTypes.string.isRequired,
  serviceCategories: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  description: PropTypes.string.isRequired,
  logoUrl: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  platforms: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  privacyUrl: PropTypes.string.isRequired,
  tosUrl: PropTypes.string.isRequired,
}).isRequired;
