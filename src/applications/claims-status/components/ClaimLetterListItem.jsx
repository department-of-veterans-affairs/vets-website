import React from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';

const downloadUrl = id => `${environment.API_URL}/v0/claim_letters/${id}`;

const formatDate = date => {
  return format(new Date(date), 'MMMM dd, yyyy');
};

const filename = 'ClaimLetter.pdf';

const downloadHandler = () => {
  recordEvent({
    event: 'claim-letters-download',
    'click-text': 'Download letter (PDF)',
  });
};

const ClaimLetterListItem = ({ letter }) => {
  const heading = `Letter dated ${formatDate(letter.receivedAt)}`;

  return (
    <li className="vads-u-border-bottom--1px vads-u-border-color--gray-lighter vads-u-padding-bottom--2">
      <h2 className="vads-u-font-size--h4">{heading}</h2>
      <div className="vads-u-color--gray-warm-dark vads-u-margin-bottom--0p5">
        {letter.typeDescription}
      </div>
      <va-link
        download
        filename={filename}
        filetype="PDF"
        href={downloadUrl(letter.documentId)}
        onClick={downloadHandler}
        text="Download letter"
      />
    </li>
  );
};

ClaimLetterListItem.propTypes = {
  letter: PropTypes.object,
};

export default ClaimLetterListItem;
