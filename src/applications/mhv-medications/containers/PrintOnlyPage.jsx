/* eslint-disable @department-of-veterans-affairs/prefer-table-component */
import React from 'react';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const PrintOnlyPage = props => {
  const { children, title, preface, subtitle, hasError } = props;
  return (
    <div className="print-only landing-page">
      <div
        data-testid="crisis-line-print-only"
        className="vads-u-padding--1 vads-u-border--1px vads-u-border-color--black print-only-crisis-line-header"
      >
        If you’re ever in crisis and need to talk to someone right away, call
        the Veterans Crisis Line at <strong>988</strong>. Then select 1.
      </div>
      <h1
        className="vads-u-margin-top--neg3"
        data-testid="list-page-title-print-only"
      >
        {title}
      </h1>
      <p className="vads-u-margin-top--neg1" data-testid="print-only-preface">
        {preface}
      </p>
      {subtitle && (
        <h2 className="print-only vads-u-margin-top--neg0p5 ">{subtitle}</h2>
      )}
      {!hasError ? (
        children
      ) : (
        <div>
          <p>
            We’re sorry. There’s a problem with our system. We can’t print your
            records right now. Try again later. If it still doesn’t work, call
            us at <va-telephone not-clickable contact="8773270022" /> (
            <va-telephone not-clickable contact={CONTACTS[711]} tty />
            ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
          </p>
        </div>
      )}
    </div>
  );
};

PrintOnlyPage.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  hasError: PropTypes.bool,
  preface: PropTypes.string,
  subtitle: PropTypes.string,
};

export default PrintOnlyPage;
