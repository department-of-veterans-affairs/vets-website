import React from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';

const downloadUrl = id => `${environment.API_URL}/v0/claim_letters/${id}`;

const formatDate = date => {
  // Dates in the format YYYY-MM-DD use a simplified ISO-8601
  // format and are assumed to be in the UTC time zone. When given
  // a time in this format, the browser will offset the time to
  // match the users time zone. This can result in a time that is
  // off by a day. We need to calculate the offset and add it to
  // the Date object to ensure we get the expected date
  const withoutOffset = new Date(date);
  const offset = withoutOffset.getTimezoneOffset() * 60000;
  const withOffset = new Date(withoutOffset.getTime() + offset);

  return format(withOffset, 'MMMM dd, yyyy');
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
