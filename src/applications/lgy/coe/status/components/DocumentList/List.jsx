import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import environment from 'platform/utilities/environment';
import { formatDateLong } from 'platform/utilities/date';

import ListItem from './ListItem';

export const formatLabelDate = timestamp =>
  moment(timestamp).format('MM-DD-YYYY');

// Example documentType: 'pdf', but the local mock data has '54'; this has been
// updated to extract the file extension from the `mimeType` (e.g. `file.pdf`),
// which really should contain the mime type (expecting `application/pdf`) -
// still awaiting a response from LGY
export const getDocumentType = fileName =>
  fileName
    .split('.')
    .pop()
    .toUpperCase();

export const getDownloadLinkLabel = timestamp =>
  `Download Notification Letter ${formatLabelDate(timestamp)}`;

const List = ({ documents }) =>
  documents.map((document, i) => {
    const { createDate, description, mimeType, id } = document;
    const downloadLinkLabel = getDownloadLinkLabel(createDate);
    const sentDate = formatDateLong(createDate);

    return (
      <ListItem
        key={i}
        downloadLinkLabel={downloadLinkLabel}
        downloadUrl={`${environment.API_URL}/v0/coe/document_download/${id}`}
        fileType={getDocumentType(mimeType)}
        sentDate={sentDate}
        title={description}
      />
    );
  });

List.propTypes = {
  documents: PropTypes.array,
};

export default List;
