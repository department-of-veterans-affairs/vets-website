import React from 'react';
import PropTypes from 'prop-types';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';
import recordEvent from '~/platform/monitoring/record-event';

const NotEligible = props => {
  const { benefitType, typeIsCNP } = props;
  const headerText = typeIsCNP
    ? 'Our records show that you don’t receive VA disability compensation or pension payments.'
    : 'Our records show that you don’t receive VA education benefit payments or haven’t set up direct deposit payments.';
  const primaryLinkText = typeIsCNP
    ? 'Learn more about disability eligibility'
    : 'Learn more about GI Bill and other education benefit eligibility';
  return (
    <>
      <p className="vads-u-margin-top--0" data-testid={`${benefitType}-header`}>
        {headerText}
      </p>
      <p className="vads-u-margin-top--0">
        If you think this is an error, call us at{' '}
        <Telephone contact={CONTACTS.VA_BENEFITS} /> (
        <a href="tel:711" aria-label="TTY: 7 1 1.">
          TTY: 711
        </a>
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
      <p>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://www.va.gov/${benefitType}/eligibility/`}
          onClick={() => {
            recordEvent({
              event: 'profile-navigation',
              'profile-action': 'view-link',
              'profile-section': `${benefitType}-benefits`,
            });
          }}
        >
          {primaryLinkText}
        </a>
      </p>
      {typeIsCNP && (
        <p className="vads-u-margin-bottom--0">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.va.gov/pension/eligibility/"
          >
            Learn more about VA pension eligibility
          </a>
        </p>
      )}
    </>
  );
};

NotEligible.propTypes = {
  benefitType: PropTypes.string.isRequired,
  typeIsCNP: PropTypes.bool,
};

export default NotEligible;
