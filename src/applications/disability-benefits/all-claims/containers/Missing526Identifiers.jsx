import React from 'react';
import PropTypes from 'prop-types';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import recordEvent from 'platform/monitoring/record-event';
import readableList from 'platform/forms-system/src/js/utilities/data/readableList';

// Downcases the first char in the capitalized form title passed to this component
// This is needed because we reference it within a sentence
const titleLowerCase = (title = '') => {
  if (title.length > 0) {
    const [firstChar, ...rest] = title;
    return `${firstChar.toLowerCase()}${rest.join('')}`;
  }

  return title;
};

const filterMissingIdentifiers = form526RequiredIdentifers => {
  return Object.keys(form526RequiredIdentifers).filter(
    idName => form526RequiredIdentifers[idName] === false,
  );
};

const formatMissingIdentifiers = missingIdentifiers => {
  const READABLE_IDENTIFIER_MAPPING = {
    participantId: 'Participant ID',
    birlsId: 'BIRLS ID',
    ssn: 'Social Security Number',
    birthDate: 'Date of Birth',
    edipi: 'EDIPI',
  };

  const readableIdentifiers = missingIdentifiers.map(
    idName => READABLE_IDENTIFIER_MAPPING[idName],
  );

  return readableList(readableIdentifiers);
};

const Alert = ({ children, title }) => (
  <div className="vads-l-grid-container vads-u-padding-left--0 vads-u-padding-bottom--5">
    <div className="usa-content">
      <h1>{title}</h1>
      <va-alert status="error" uswds>
        {children}
      </va-alert>
    </div>
  </div>
);

Alert.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

const displayContent = (title, form526RequiredIdentifers) => {
  const missingIdentifiers = filterMissingIdentifiers(
    form526RequiredIdentifers,
  );

  recordEvent({
    event: 'visible-alert-box',
    'alert-box-type': 'warning',
    'alert-box-heading': title,
    'error-key': `missing_526_identifiers_${missingIdentifiers.join('_')}`,
    'alert-box-full-width': false,
    'alert-box-background-only': false,
    'alert-box-closeable': false,
  });

  const formattedIdentifiers = formatMissingIdentifiers(missingIdentifiers);

  return (
    <>
      <h2
        slot="headline"
        className="vads-u-display--inline-block vads-u-font-size--h3 vads-u-margin-top--0"
      >
        We need more information for your application
      </h2>

      <p className="vads-u-font-size--base">
        We’re missing your {formattedIdentifiers}. We need this information
        before you can {titleLowerCase(title)}. Call us at{' '}
        <va-telephone contact={CONTACTS.HELP_DESK} /> (
        <va-telephone contact={CONTACTS['711']} tty />) to update your
        information. We’re here Monday through Friday from 8:00 a.m. to 9:00
        p.m. ET. Tell the representative that you want to add this missing
        information to your file.
      </p>
    </>
  );
};

export const Missing526Identifiers = ({ title, form526RequiredIdentifers }) => {
  const alertContent = displayContent(title, form526RequiredIdentifers);

  return <Alert title={title}>{alertContent}</Alert>;
};

Missing526Identifiers.propTypes = {
  title: PropTypes.string.isRequired,
  form526RequiredIdentifers: PropTypes.arrayOf(
    PropTypes.shape({
      participantId: PropTypes.bool.isRequired,
      birlsId: PropTypes.bool.isRequired,
      ssn: PropTypes.bool.isRequired,
      birthDate: PropTypes.bool.isRequired,
      edipi: PropTypes.bool.isRequired,
    }),
  ),
};
