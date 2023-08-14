import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import PropTypes from 'prop-types';

// Downcases the first char in the capitalized form title passed to this component
// This is needed because we reference it within a sentance
const titleLowerCase = (title = '') => {
  const [firstChar, ...rest] = title;
  return `${firstChar.toLowerCase()}${rest.join('')}`;
};

const Alert = ({ content, title }) => (
  <div className="vads-l-grid-container vads-u-padding-left--0 vads-u-padding-bottom--5">
    <div className="usa-content">
      <h1>{title}</h1>
      <va-alert status="error">{content}</va-alert>
    </div>
  </div>
);

Alert.propTypes = {
  content: PropTypes.node,
  title: PropTypes.string,
};

const displayContent = (title, missingIdentifiers) => {
  return (
    <>
      <h2 className="vads-u-display--inline-block vads-u-font-size--h3 vads-u-margin-top--0">
        We need more information for your application
      </h2>

      <p className="vads-u-font-size--base">
        We’re missing your {missingIdentifiers}. We need this information before
        you can {titleLowerCase(title)}. Call us at{' '}
        <va-telephone contact={CONTACTS.HELP_DESK} /> (
        <va-telephone contact={CONTACTS['711']} tty />) to update your
        information. We’re here Monday through Friday from 8:00 a.m. to 9:00
        p.m. ET. Tell the representative that you want to add this missing
        information to your file.
      </p>
    </>
  );
};

const formatMissingIdentifiers = identifiers => {
  const READABLE_IDENTIFIER_MAPPING = {
    particpantId: 'Participant ID',
    birlsId: 'BIRLS ID',
    ssn: 'Social Security Number',
    birthDate: 'Date of Birth',
    edipi: 'EDIPI',
  };

  const missingIdentifiers = Object.keys(identifiers).filter(
    idName => identifiers[idName] === false,
  );
  const readableIdentifiers = missingIdentifiers.map(
    idName => READABLE_IDENTIFIER_MAPPING[idName],
  );

  // Properly format "and" and commas based on list size
  const listFormatter = new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction',
  });
  return listFormatter.format(readableIdentifiers);
};

export const Missing526Identifiers = ({
  title,
  form526RequiredIdentifersPresence,
}) => {
  const missingIdentifiers = formatMissingIdentifiers(
    form526RequiredIdentifersPresence,
  );
  const alertContent = displayContent(title, missingIdentifiers);

  return <Alert title={title} content={alertContent} />;
};

Missing526Identifiers.propTypes = {
  title: PropTypes.string.isRequired,
  form526RequiredIdentifersPresence: PropTypes.arrayOf(
    PropTypes.shape({
      particpantId: PropTypes.bool.isRequired,
      birlsId: PropTypes.bool.isRequired,
      ssn: PropTypes.bool.isRequired,
      birthDate: PropTypes.bool.isRequired,
      edipi: PropTypes.bool.isRequired,
    }),
  ),
};
