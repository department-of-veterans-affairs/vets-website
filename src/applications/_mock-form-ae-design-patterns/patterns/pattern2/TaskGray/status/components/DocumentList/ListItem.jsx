import React from 'react';
import PropTypes from 'prop-types';

const ListItem = ({
  downloadUrl,
  downloadLinkLabel,
  fileName,
  sentDate,
  title,
}) => (
  <div className="coe-list-item vads-u-border-bottom--1px vads-u-border-color--gray-lighter vads-u-margin-top--2p5 vads-u-padding-bottom--4">
    <h3 className="vads-u-font-family--serif vads-u-margin--0">{title}</h3>
    <p className="vads-u-margin-y--1p5">Date sent: {sentDate}</p>
    <va-link
      download
      filetype="PDF"
      href={downloadUrl}
      filename={fileName}
      text={downloadLinkLabel}
    />
  </div>
);

ListItem.propTypes = {
  downloadLinkLabel: PropTypes.string,
  downloadUrl: PropTypes.string,
  fileName: PropTypes.string,
  sentDate: PropTypes.string,
  title: PropTypes.string,
};

export default ListItem;
