import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';
import { srSubstitute } from '../utils';

const titleLowerCase = (title = '') =>
  `${title[0].toLowerCase() || ''}${title.slice(1)}`;

const Alert = ({ content, title }) => (
  <div className="vads-l-grid-container vads-u-padding-left--0 vads-u-padding-bottom--5">
    <div className="usa-content">
      <h1>{title}</h1>
      <va-alert status="error" uswds>
        {content}
      </va-alert>
    </div>
  </div>
);

Alert.propTypes = {
  content: PropTypes.node,
  title: PropTypes.string,
};

export const MissingServices = ({ title }) => {
  const content = (
    <>
      <h2 className="vads-u-display--inline-block vads-u-font-size--h3 vads-u-margin-top--0">
        We need some information for your application
      </h2>
      <p className="vads-u-font-size--base">
        We need more information from you before you can {titleLowerCase(title)}
        . Please call Veterans Benefits Assistance at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone contact={CONTACTS['711']} tty />
        ), Monday through Friday, 8:00 a.m. to 9:00 p.m. ET to update your
        account.
      </p>
    </>
  );
  recordEvent({
    event: 'visible-alert-box',
    'alert-box-type': 'warning',
    'alert-box-heading': title,
    'error-key': 'missing_526_or_original_claims_service',
    'alert-box-full-width': false,
    'alert-box-background-only': false,
    'alert-box-closeable': false,
  });
  return <Alert title={title} content={content} />;
};

MissingServices.propTypes = {
  title: PropTypes.string.isRequired,
};

export const MissingId = ({ title }) => {
  const content = (
    <>
      <h2 className="vads-u-display--inline-block vads-u-font-size--h3 vads-u-margin-top--0">
        We need more information for your application
      </h2>
      <p className="vads-u-font-size--base">
        We don’t have all of your ID information for your account. We need this
        information before you can {titleLowerCase(title)}. To update your
        account, please call the {srSubstitute('MyVA411', 'My V. A. 4 1 1.')}{' '}
        main information line at <va-telephone contact={CONTACTS.HELP_DESK} /> (
        <va-telephone contact={CONTACTS['711']} tty />) and select 0. We’re here
        24 hours a day, 7 days a week.
      </p>
      <p className="vads-u-font-size--base">
        Tell the representative that you may be missing your{' '}
        <abbr title="Electronic Data Interchange Personal Identifier">
          EDIPI
        </abbr>
        {' number or '}
        <abbr title="Beneficiary Identification and Records Locator (Sub)System">
          BIRLS ID
        </abbr>
        .
      </p>
    </>
  );
  recordEvent({
    event: 'visible-alert-box',
    'alert-box-type': 'warning',
    'alert-box-heading': title,
    'error-key': 'missing_edipi_or_birls_id',
    'alert-box-full-width': false,
    'alert-box-background-only': false,
    'alert-box-closeable': false,
  });
  return <Alert title={title} content={content} />;
};

MissingId.propTypes = {
  title: PropTypes.string.isRequired,
};

export const MissingDob = ({ title }) => {
  const content = (
    <>
      <h2 className="vads-u-display--inline-block vads-u-font-size--h3 vads-u-margin-top--0">
        We need some information for your application
      </h2>
      <p className="vads-u-font-size--base">
        We’re sorry. We can’t find your date of birth in our records. You won’t
        be able to continue your application for disability compensation until
        you update your VA account with your date of birth.
      </p>
      <p className="vads-u-font-size--base">
        Please call us at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone contact={CONTACTS['711']} tty />) to update your account.
        We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </>
  );
  recordEvent({
    event: 'visible-alert-box',
    'alert-box-type': 'warning',
    'alert-box-heading': title,
    'error-key': 'missing_dob',
    'alert-box-full-width': false,
    'alert-box-background-only': false,
    'alert-box-closeable': false,
  });
  return <Alert title={title} content={content} />;
};

MissingDob.propTypes = {
  title: PropTypes.string.isRequired,
};
