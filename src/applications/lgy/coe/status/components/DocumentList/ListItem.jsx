import React from 'react';
import PropTypes from 'prop-types';

// NOTE: The DownloadLink is being hidden for the moment because vets-api doesn't currently
// return a url as part of the payload, which means the link currently doesn't point to anything.
// Adding a url to the payload is planned as future work.
// import DownloadLink from '../../../shared/components/DownloadLink';

const ListItem = ({
  /* downloadUrl, downloadLinkLabel, */ sentDate,
  title,
}) => (
  <div className="vads-u-border-bottom--1px vads-u-border-color--gray-lighter vads-u-margin-top--2p5 vads-u-padding-bottom--4">
    <h3 className="vads-u-font-family--serif vads-u-margin--0">{title}</h3>
    <p className="vads-u-margin-y--1p5">Date Sent: {sentDate}</p>
    {/* <DownloadLink href={downloadUrl} label={downloadLinkLabel} /> */}
  </div>
);

ListItem.propTypes = {
  // downloadLinkLabel: PropTypes.string,
  // downloadUrl: PropTypes.string,
  sentDate: PropTypes.string,
  title: PropTypes.string,
};

export default ListItem;
