import React from 'react';
import PropTypes from 'prop-types';

const ButtonsGroup = ({
  onPrimaryClick,
  onSecondaryClick,
  primaryLabel,
  secondaryLabel,
}) => {
  return (
    <div className="button-container">
      <va-button
        onClick={onPrimaryClick}
        text={primaryLabel}
        class="vads-u-margin-bottom--1p5"
      />
      <va-button onClick={onSecondaryClick} secondary text={secondaryLabel} />
    </div>
  );
};

ButtonsGroup.propTypes = {
  onPrimaryClick: PropTypes.func.isRequired,
  onSecondaryClick: PropTypes.func.isRequired,
  primaryLabel: PropTypes.string,
  secondaryLabel: PropTypes.string,
};
export default ButtonsGroup;
