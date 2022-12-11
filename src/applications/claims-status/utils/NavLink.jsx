import * as React from 'react';
import { NavLink as BaseNavLink } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';

const NavLink = React.forwardRef(
  ({ activeClassName, activeStyle, ...props }, ref) => {
    return (
      <BaseNavLink
        ref={ref}
        {...props}
        className={({ isActive }) =>
          [props.className, isActive ? activeClassName : null]
            .filter(Boolean)
            .join(' ')
        }
        style={({ isActive }) => ({
          ...props.style,
          ...(isActive ? activeStyle : null),
        })}
      />
    );
  },
);

NavLink.propTypes = {
  activeClassName: PropTypes.string,
  activeStyle: PropTypes.object,
};

export default NavLink;
