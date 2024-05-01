import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../sass/breadcrumb-link.scss';

const BreadcrumbLink = ({ to, label, onClick, datadogActionName }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      data-dd-action-name={datadogActionName}
      className="include-back-arrow"
    >
      {label}
    </Link>
  );
};

BreadcrumbLink.propTypes = {
  label: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  datadogActionName: PropTypes.string,
  onClick: PropTypes.func,
};

export default BreadcrumbLink;
