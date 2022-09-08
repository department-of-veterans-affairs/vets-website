import React from 'react';
import PropTypes from 'prop-types';

const SectionGuideButton = props => {
  const { sectionName } = props;

  return (
    <button type="button" className="usa-button-secondary section-guide-button">
      <span>In the {sectionName} section</span>
      <i className="fas fa-bars" aria-hidden="true" />
    </button>
  );
};

SectionGuideButton.propTypes = {
  sectionName: PropTypes.string,
};

export default SectionGuideButton;
