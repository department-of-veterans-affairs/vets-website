import PropTypes from 'prop-types';

export const SearchResultPropTypes = PropTypes.shape({
  appURL: PropTypes.string.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  description: PropTypes.string.isRequired,
  iconURL: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  permissions: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  platforms: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  privacyPolicyURL: PropTypes.string.isRequired,
  termsOfServiceURL: PropTypes.string.isRequired,
}).isRequired;
