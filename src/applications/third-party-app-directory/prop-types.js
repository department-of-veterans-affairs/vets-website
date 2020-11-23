/* eslint-disable camelcase */

import PropTypes from 'prop-types';

export const SearchResultPropTypes = PropTypes.shape({
  app_url: PropTypes.string.isRequired,
  service_categories: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  description: PropTypes.string.isRequired,
  logo_url: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  platforms: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  privacy_url: PropTypes.string.isRequired,
  tos_url: PropTypes.string.isRequired,
}).isRequired;
