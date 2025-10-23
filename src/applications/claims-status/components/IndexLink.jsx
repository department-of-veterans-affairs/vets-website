import * as React from 'react';
import { NavLink } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';

const IndexLink = React.forwardRef(
  ({ activeClassName, activeStyle, ...props }, ref) => {
    return (
      <NavLink
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

IndexLink.propTypes = {
  activeClassName: PropTypes.string,
  activeStyle: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default IndexLink;
