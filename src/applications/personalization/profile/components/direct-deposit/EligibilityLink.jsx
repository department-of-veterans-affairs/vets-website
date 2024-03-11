import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';

export const EligibilityLink = ({ typeIsCNP, recordEventImpl }) => {
  const benefitTypeShort = typeIsCNP ? 'disability' : 'education';
  const linkText = typeIsCNP
    ? 'Learn more about disability eligibility'
    : 'Learn more about GI Bill and other education benefit eligibility';

  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`/${benefitTypeShort}/eligibility/`}
      onClick={() => {
        recordEventImpl({
          event: 'profile-navigation',
          'profile-action': 'view-link',
          'profile-section': `${benefitTypeShort}-benefits`,
        });
      }}
    >
      {linkText}
    </a>
  );
};

EligibilityLink.defaultProps = {
  recordEventImpl: recordEvent,
};

EligibilityLink.propTypes = {
  typeIsCNP: PropTypes.bool.isRequired,
  recordEventImpl: PropTypes.func,
};
