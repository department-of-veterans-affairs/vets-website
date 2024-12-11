import React from 'react';
import PropTypes from 'prop-types';

export default function CallToActionAlert({
  heading,
  headerLevel = 3,
  alertText,
  primaryButtonText,
  primaryButtonHandler,
  secondaryButtonText,
  secondaryButtonHandler,
  status,
  primaryButtonAriaLabel = null,
  primaryButtonAriaDescribedby = null,
}) {
  const CustomHeaderLevel = `h${headerLevel}`;
  return (
    <va-alert visible status={status} uswds>
      <CustomHeaderLevel slot="headline">{heading}</CustomHeaderLevel>
      <div>
        {alertText}
        {primaryButtonText && (
          <va-button
            onClick={primaryButtonHandler}
            text={primaryButtonText}
            label={primaryButtonAriaLabel}
            aria-describedby={primaryButtonAriaDescribedby}
            uswds
          />
        )}
        {secondaryButtonText && (
          <va-button
            text={secondaryButtonText}
            onClick={secondaryButtonHandler}
            secondary
          />
        )}
      </div>
    </va-alert>
  );
}

CallToActionAlert.propTypes = {
  alertText: PropTypes.node,
  headerLevel: PropTypes.number,
  heading: PropTypes.string,
  primaryButtonAriaDescribedby: PropTypes.string,
  primaryButtonAriaLabel: PropTypes.string,
  primaryButtonHandler: PropTypes.func,
  primaryButtonText: PropTypes.string,
  secondaryButtonHandler: PropTypes.func,
  secondaryButtonText: PropTypes.string,
  status: PropTypes.string,
};

CallToActionAlert.defaultProps = {
  headerLevel: 3,
  primaryButtonAriaDescribedby: null,
  primaryButtonAriaLabel: null,
};
