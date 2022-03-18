import React from 'react';
import PropTypes from 'prop-types';

import List from './List';

const documents = [
  {
    id: 0,
    title: 'a document',
    type: 'PDF',
    timestamp: 1645565285000,
  },
  {
    id: 1,
    title: 'another document',
    type: 'PDF',
    timestamp: 1645565285000,
  },
];

const DocumentList = ({ notOnUploadPage }) => {
  if (documents.length > 0) {
    return (
      <>
        <h2 className="vads-u-margin-bottom--0">
          You have letters about your COE request
        </h2>
        <p className="vads-u-border-color--gray-lighter vads-u-border-bottom--1px vads-u-margin--0 vads-u-padding-y--4">
          We’ve emailed you notification letters about your COE request. Please
          read these and follow the steps they outline. You may need to take
          action before we can make a final decision.
        </p>
        <List documents={documents} />
      </>
    );
  }
  if (notOnUploadPage) {
    return (
      <>
        <h2>How will I know if VA needs more information from me?</h2>
        <p className="vads-u-margin-bottom--0">
          If we need more information, we’ll notify you by email or mail. You
          can also check the status of your request for a COE by returning to
          this page.
        </p>
      </>
    );
  }
  return '';
};

DocumentList.propTypes = {
  notOnUploadPage: PropTypes.bool,
};

export default DocumentList;
