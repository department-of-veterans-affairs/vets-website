/* eslint-disable @department-of-veterans-affairs/prefer-table-component */
import React from 'react';
import PropTypes from 'prop-types';

const PrintOnlyPage = props => {
  const { children, title, preface, subtitle } = props;
  return (
    <div className="print-only landing-page">
      <div className="vads-u-padding--1 vads-u-border--1px vads-u-border-color--black print-only-crisis-line-header">
        If you’re ever in crisis and need to talk to someone right away, call
        the Veterans Crisis line at <strong>988</strong>. Then select 1.
      </div>
      <h1
        className="vads-u-margin-top--neg3"
        data-testid="list-page-title-print-only"
      >
        {title}
      </h1>
      <div className="print-only vads-u-margin-top--neg1 vads-l-col--12 medium-screen:vads-l-col--6">
        <p>{preface}</p>
      </div>
      {subtitle && (
        <h2 className="print-only vads-u-margin-top--neg0p5 ">{subtitle}</h2>
      )}
      {children}
    </div>
  );
};

PrintOnlyPage.propTypes = {
  children: PropTypes.object.isRequired,
  preface: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};

export default PrintOnlyPage;
