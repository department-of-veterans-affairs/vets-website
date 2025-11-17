import React from 'react';
import PropTypes from 'prop-types';

const ButtonPair = ({ onBack, onContinue }) => {
  return (
    <div className="vads-u-display--flex vads-u-margin-top--4 vass-form__button-container">
      <va-button secondary onClick={onBack} text="Back" uswds />
      <va-button onClick={onContinue} text="Continue" uswds />
    </div>
  );
};

ButtonPair.propTypes = {
  onBack: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
};

export default ButtonPair;
