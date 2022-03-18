import React from 'react';
import PropTypes from 'prop-types';
import DownloadLink from '../../../shared/components/DownloadLink';

const ListItem = ({ downloadUrl, sentDate, title, type }) => (
  <div className="vads-u-border-bottom--1px vads-u-border-color--gray-lighter vads-u-margin-top--4 vads-u-padding-bottom--4">
    <h3 className="vads-u-font-family--serif vads-u-margin--0">{title}</h3>
    <p className="vads-u-margin-y--1p5">Date Sent: {sentDate}</p>
    <DownloadLink href={downloadUrl} label={`${title} ${type}`} />
  </div>
);

ListItem.propTypes = {
  downloadUrl: PropTypes.string,
  sentDate: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
};

export default ListItem;
