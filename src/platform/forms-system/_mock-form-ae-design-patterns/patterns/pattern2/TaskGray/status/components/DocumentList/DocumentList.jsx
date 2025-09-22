import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { getCoeDocuments } from './api';
import List from './List';

const DocumentList = ({ notOnUploadPage }) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await getCoeDocuments();
      if (data.errors) {
        // Will add error handling in the future
      } else {
        setDocuments(data);
      }
    };

    getData();
  }, []);

  if (documents.length > 0) {
    return (
      <>
        <h2 className="vads-u-margin-bottom--0">
          You have letters about your COE request
        </h2>
        <p className="vads-u-border-color--gray-lighter vads-u-border-bottom--1px vads-u-margin--0 vads-u-padding-y--3">
          We’ve emailed you notification letters about your COE request. Read
          these and follow the steps they outline. You may need to take action
          before we can make a final decision.
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
          If we need more information, we’ll notify you by email. You can also
          check the status of your request for a COE by returning to this page.
        </p>
      </>
    );
  }

  return null;
};

DocumentList.propTypes = {
  notOnUploadPage: PropTypes.bool,
};

export default DocumentList;
