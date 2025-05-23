import React from 'react';
import PropTypes from 'prop-types';

export default function IconWithInfo({ icon, children, present }) {
  if (!present) return null;

  return (
    <p className="icon-with-info">
      <va-icon icon={icon} size={3} aria-hidden="true" />
      &nbsp;
      {children}
    </p>
  );
}
IconWithInfo.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.string.isRequired,
  present: PropTypes.any,
};
