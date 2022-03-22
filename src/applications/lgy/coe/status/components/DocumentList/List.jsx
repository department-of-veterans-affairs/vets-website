import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import ListItem from './ListItem';

const formatDate = timestamp => moment(timestamp).format('MMMM DD, YYYY');
const formatLabelDate = timestamp => moment(timestamp).format('MMDDYYYY');

// ex docType: '.pdf'
const getDocumentType = docType => docType.slice(1).toUpperCase();

const getDownloadLinkLabel = (timestamp, documentType) =>
  `Download Notification Letter ${formatLabelDate(
    timestamp,
  )} (${getDocumentType(documentType)})`;

const List = ({ documents }) => {
  return documents.map((document, i) => {
    const { description, documentType, timestamp } = document;

    const downloadLinkLabel = getDownloadLinkLabel(timestamp, documentType);
    // This will come from the document payload in the future
    const downloadUrl = '∂';
    const sentDate = formatDate(timestamp);
    const title = description;

    return (
      <ListItem
        key={i}
        downloadLinkLabel={downloadLinkLabel}
        downloadUrl={downloadUrl}
        sentDate={sentDate}
        title={title}
      />
    );
  });
};

List.propTypes = {
  documents: PropTypes.array,
};

export default List;
