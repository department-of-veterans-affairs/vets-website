import React from 'react';
import PropTypes from 'prop-types';

import environment from 'platform/utilities/environment';

const downloadUrl = id => `${environment.API_URL}/v0/claim_letters/${id}`;

const ClaimLetterListItem = ({ letter }) => {
  const heading = `Letter dated ${letter.uploadDate}`;

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
