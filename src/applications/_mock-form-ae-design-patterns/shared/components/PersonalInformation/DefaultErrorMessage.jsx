import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import PropTypes from 'prop-types';

const MISSING_FIELD_LABELS = {
  ssn: 'Social Security number',
  vaFileNumber: 'VA file number',
};

export const DefaultErrorMessage = ({ missingFields = [] }) => {
  if (!missingFields || missingFields.length === 0) {
    return null;
  }

  // get the labels for the missing fields, don't include null values
  const missingFieldLabels = missingFields.reduce((acc, field) => {
    if (MISSING_FIELD_LABELS?.[field]) {
      acc.push(MISSING_FIELD_LABELS[field]);
    }
    return acc;
  }, []);

  const formatter = new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction',
  });

  // format the missing fields for use in the error message text
  const missingFieldsText = formatter.format(missingFieldLabels);

  return (
    <div>
      <p>
        Your VA account is missing your {missingFieldsText}, which we need
        before you can begin this form. For security reasons, we don’t allow
        online changes to this information. To update this information, call us
        at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone contact="711" tty />
        ). We’re here Monday through Friday, between 8:00 a.m. and 9:00 p.m. ET.
      </p>

      <p>Tell the representative you may be missing {missingFieldsText}.</p>
    </div>
  );
};

DefaultErrorMessage.propTypes = {
  missingFields: PropTypes.arrayOf(PropTypes.string).isRequired,
};
