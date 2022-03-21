import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import ListItem from './ListItem';

const formatDate = date => moment(date).format('MMMM DD, YYYY');

const List = ({ documents }) => {
  return documents.map((document, i) => {
    // This will come from the document payload in the future
    const downloadUrl = '∂';
    const sentDate = formatDate(document.timestamp);

    return (
      <ListItem
        key={i}
        downloadUrl={downloadUrl}
        sentDate={sentDate}
        title={document.title}
        type={document.type}
      />
    );
  });
};

List.propTypes = {
  documents: PropTypes.array,
};

export default List;
