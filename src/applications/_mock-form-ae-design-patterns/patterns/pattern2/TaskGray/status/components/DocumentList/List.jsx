import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import environment from 'platform/utilities/environment';
import { formatDateLong } from 'platform/utilities/date';

import ListItem from './ListItem';

export const formatLabelDate = timestamp =>
  moment(timestamp).format('MM-DD-YYYY');

export const getDownloadLinkLabel = timestamp =>
  `Download Notification Letter ${formatLabelDate(timestamp)}`;

const List = ({ documents }) =>
  documents.map((document, i) => {
    const { createDate, id, documentType, mimeType } = document;
    const downloadLinkLabel = getDownloadLinkLabel(createDate);
    const sentDate = formatDateLong(createDate);

    // `documentType` represents what "kind" of Notification Letter this is
    // (e.g. "COE Application First Returned Letter").
    // Strangely, LGY represents a document's filename with `mimeType`.
    return (
      <ListItem
        key={i}
        downloadLinkLabel={downloadLinkLabel}
        downloadUrl={`${environment.API_URL}/v0/coe/document_download/${id}`}
        sentDate={sentDate}
        title={documentType}
        fileName={mimeType}
      />
    );
  });

List.propTypes = {
  documents: PropTypes.array,
};

export default List;
