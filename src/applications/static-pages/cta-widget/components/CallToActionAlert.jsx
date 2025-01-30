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
  ariaLabel = null,
  ariaDescribedby = null,
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
            label={ariaLabel}
            aria-describedby={ariaDescribedby}
            uswds
            {...(status === 'continue' ? { 'primary-alternate': true } : {})}
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
  ariaDescribedby: PropTypes.string,
  ariaLabel: PropTypes.string,
  headerLevel: PropTypes.number,
  heading: PropTypes.string,
  primaryButtonHandler: PropTypes.func,
  primaryButtonText: PropTypes.string,
  secondaryButtonHandler: PropTypes.func,
  secondaryButtonText: PropTypes.string,
  status: PropTypes.string,
};

CallToActionAlert.defaultProps = {
  headerLevel: 3,
  ariaDescribedby: null,
  ariaLabel: null,
};
