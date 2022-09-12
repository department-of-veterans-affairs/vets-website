import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import environment from 'platform/utilities/environment';
import { formatDateLong } from 'platform/utilities/date';

import ListItem from './ListItem';

export const formatLabelDate = timestamp =>
  moment(timestamp).format('MMDDYYYY');

// Example docType: 'pdf', but the mock data has '54'; this may need to be
// updated to extract the file extension from the `mimeType` (e.g. `file.pdf`),
// which should contain the mime type (expecting `application/pdf`) - awaiting
// response from LGY
export const getDocumentType = docType => docType.slice(1).toUpperCase();

export const getDownloadLinkLabel = (timestamp, documentType) =>
  `Download Notification Letter ${formatLabelDate(
    timestamp,
  )} (${getDocumentType(documentType)})`;

const List = ({ documents }) =>
  documents.map((document, i) => {
    const { createDate, description, documentType, id } = document;
    const downloadLinkLabel = getDownloadLinkLabel(createDate, documentType);
    const sentDate = formatDateLong(createDate);

    return (
      <ListItem
        key={i}
        downloadLinkLabel={downloadLinkLabel}
        downloadUrl={`${environment.API_URL}/v0/coe/document_download/${id}`}
        sentDate={sentDate}
        title={description}
      />
    );
  });

List.propTypes = {
  documents: PropTypes.array,
};

export default List;
