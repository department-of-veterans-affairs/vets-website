import React from 'react';
import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const TravelPayButtonPair = ({
  onBack,
  onContinue,
  backText,
  continueText,
  loading = false,
  disabled = false,
  className = '',
  hideContinueButtonArrows = false,
}) => {
  return (
    <ul className={`travel-pay-button-group ${className}`}>
      <li className="travel-pay-button-group__item">
        <VaButton
          back={backText === 'Back'}
          text={backText}
          secondary={!!backText}
          onClick={onBack}
          disabled={disabled}
        />
      </li>
      <li className="travel-pay-button-group__item">
        <VaButton
          continue={!hideContinueButtonArrows}
          text={continueText}
          onClick={onContinue}
          loading={loading}
          disabled={disabled}
        />
      </li>
    </ul>
  );
};

TravelPayButtonPair.propTypes = {
  onBack: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
  backText: PropTypes.string,
  className: PropTypes.string,
  continueText: PropTypes.string,
  disabled: PropTypes.bool,
  hideContinueButtonArrows: PropTypes.bool,
  loading: PropTypes.bool,
};

export default TravelPayButtonPair;
