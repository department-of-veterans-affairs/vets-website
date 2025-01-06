import React from 'react';
import PropTypes from 'prop-types';

export default function CardIcon({ icon }) {
  if (!icon) {
    return null;
  }

  return (
    <div className="vaos-appts__appointment-details--icon">
      <va-icon
        icon={icon}
        aria-hidden="true"
        data-testid={`card-icon-${icon}`}
        size={3}
      />
    </div>
  );
}

CardIcon.propTypes = {
  icon: PropTypes.string.isRequired,
};
