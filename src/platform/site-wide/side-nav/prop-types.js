// Dependencies
import PropTypes from 'prop-types';

export const NavItemPropTypes = PropTypes.shape({
  depth: PropTypes.number.isRequired,
  description: PropTypes.string,
  expanded: PropTypes.bool.isRequired,
  hasChildren: PropTypes.bool.isRequired,
  href: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  parentID: PropTypes.string,
  isSelected: PropTypes.bool.isRequired,
}).isRequired;
