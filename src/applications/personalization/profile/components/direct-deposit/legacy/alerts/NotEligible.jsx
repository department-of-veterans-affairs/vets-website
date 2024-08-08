import React from 'react';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { EligibilityLink } from '../EligibilityLink';

const NotEligible = props => {
  const { benefitType, typeIsCNP } = props;
  const headerText = typeIsCNP
    ? 'Our records show that you don’t receive VA disability compensation or pension payments.'
    : 'Our records show that you don’t receive VA education benefit payments or haven’t set up direct deposit payments.';

  const contactMessage = typeIsCNP
    ? 'If you think this is an error'
    : 'If you want to set up direct deposit payments, or you think this is an error';

  return (
    <>
      <p className="vads-u-margin-top--0" data-testid={`${benefitType}-header`}>
        {headerText}
      </p>
      <p className="vads-u-margin-top--0">
        {contactMessage}, call us at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone contact={CONTACTS['711']} tty />
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
      <p>
        <EligibilityLink typeIsCNP={typeIsCNP} />
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
