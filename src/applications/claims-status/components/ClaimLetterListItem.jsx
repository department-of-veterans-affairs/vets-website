import React from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

import environment from 'platform/utilities/environment';

const docTypeToDescription = {
  '184': 'Notification Letter',
  '339': 'Rating Decision Letter',
};

const subjectToDescription = {
  'Intent to File': 'Notice of receipt of Intent to File',
};

const downloadUrl = id => `${environment.API_URL}/v0/claim_letters/${id}`;

const formatDate = date => {
  return format(new Date(date), 'MMMM dd, yyyy');
};

const documentDescription = ({ docType, subject }) => {
  if (subject) {
    return subjectToDescription[subject];
  }

  if (docType) {
    return docTypeToDescription[docType];
  }

  return 'Notification Letter';
};

const ClaimLetterListItem = ({ letter }) => {
  const heading = `Letter dated ${formatDate(letter.receivedAt)}`;

  return (
    <div className="vads-u-border-bottom--1px vads-u-border-color--gray-lighter vads-u-padding-bottom--2">
      <h4>{heading}</h4>
      <div className="vads-u-color--gray-warm-dark vads-u-margin-bottom--0p5">
        {documentDescription(letter)}
      </div>
      <va-link
        download
        filetype="PDF"
        href={downloadUrl(letter.documentId)}
        text="Download letter"
      />
    </div>
  );
};

ClaimLetterListItem.propTypes = {
  letter: PropTypes.object,
};

export default ClaimLetterListItem;
