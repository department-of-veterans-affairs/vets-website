import React from 'react';
import PropTypes from 'prop-types';

export default function ProfileSection({ children, id, label }) {
  return (
    <div className="profile-section" id={id}>
      <h2 className="small-screen-header" tabIndex="-1">
        {label}
      </h2>
      <div className="section-body">{children}</div>
    </div>
  );
}
ProfileSection.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
