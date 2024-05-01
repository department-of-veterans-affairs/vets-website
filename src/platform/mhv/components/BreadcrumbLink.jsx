import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../sass/breadcrumb-link.scss';

const BreadcrumbLink = ({ to, label, onClick, className }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`include-back-arrow ${className}`}
    >
      {label}
    </Link>
  );
};

BreadcrumbLink.propTypes = {
  label: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default BreadcrumbLink;
