import React from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

import environment from 'platform/utilities/environment';

const formatDate = timestamp => {
  return format(
    new Date(timestamp.replace(/-/g, '/').replace(/T.+/, '')),
    'MMMM dd, yyyy',
  ); // using replace to fix the off by one day issue
};

const downloadUrl = id =>
  `${environment.API_URL}/v0/efolder/notification_letter/${id}`;

const ClaimLetterListItem = ({ letter }) => {
  const date = formatDate(letter.uploadDate);
  const heading = `Letter dated ${date}`;

  return (
    <div className="vads-u-border-bottom--1px vads-u-border-color--gray-lighter vads-u-padding-bottom--2">
      <h4>{heading}</h4>
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
