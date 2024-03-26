import React from 'react';
import PropTypes from 'prop-types';

const ButtonsGroup = ({
  onPrimaryClick,
  onSecondaryClick,
  primaryLabel,
  secondaryLabel,
}) => {
  return (
    <div>
      <va-button onClick={onPrimaryClick} text={primaryLabel} />
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
