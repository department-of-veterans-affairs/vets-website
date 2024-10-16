import React from 'react';
import PropTypes from 'prop-types';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import recordEvent from 'platform/monitoring/record-event';
import readableList from 'platform/forms-system/src/js/utilities/data/readableList';

const READABLE_IDENTIFIER_MAPPING = {
  participantId: 'Participant ID',
  birlsId: 'BIRLS ID',
  ssn: 'Social Security Number',
  birthDate: 'Date of Birth',
  edipi: 'EDIPI',
};

// Downcases the first char in the capitalized form title passed to this component
// This is needed because we reference it within a sentence
const titleLowerCase = (title = '') => {
  if (title.length > 0) {
    const [firstChar, ...rest] = title;
    return `${firstChar.toLowerCase()}${rest.join('')}`;
  }

  return title;
};

const filterMissingIdentifiers = form526RequiredIdentifiers => {
  return Object.keys(form526RequiredIdentifiers).filter(
    idName => form526RequiredIdentifiers[idName] === false,
  );
};

const formatMissingIdentifiers = missingIdentifiers => {
  const readableIdentifiers = missingIdentifiers.map(
    idName => READABLE_IDENTIFIER_MAPPING[idName],
  );

  return readableList(readableIdentifiers);
};

const okMessageToDisplayText = missingIdentifiers => {
  if (!missingIdentifiers) return '';

  const OK_IF_NOT_KNOWN = ['participantId', 'birlsId', 'edipi'];

  const readableIdentifiers = missingIdentifiers
    .filter(id => OK_IF_NOT_KNOWN.includes(id))
    .map(idName => READABLE_IDENTIFIER_MAPPING[idName]);
  if (readableIdentifiers.length === 0) return '';

  return ` It's OK if you don't know your ${readableList(
    readableIdentifiers,
    'or',
  )}.`;
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

const displayContent = (title, form526RequiredIdentifiers) => {
  const missingIdentifiers = filterMissingIdentifiers(
    form526RequiredIdentifiers,
  );
  const itsOkDisplayMessage = okMessageToDisplayText(missingIdentifiers);

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
        information. We’re here 24/7.
        {itsOkDisplayMessage} Tell the representative that you want to add this
        missing information to your file.
      </p>
    </>
  );
};

export const Missing526Identifiers = ({
  title,
  form526RequiredIdentifiers,
}) => {
  const alertContent = displayContent(title, form526RequiredIdentifiers);

  return <Alert title={title}>{alertContent}</Alert>;
};

Missing526Identifiers.propTypes = {
  title: PropTypes.string.isRequired,
  form526RequiredIdentifiers: PropTypes.arrayOf(
    PropTypes.shape({
      participantId: PropTypes.bool.isRequired,
      birlsId: PropTypes.bool.isRequired,
      ssn: PropTypes.bool.isRequired,
      birthDate: PropTypes.bool.isRequired,
      edipi: PropTypes.bool.isRequired,
    }),
  ),
};
