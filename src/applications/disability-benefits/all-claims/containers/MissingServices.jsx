import React from 'react';

import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

import recordEvent from 'platform/monitoring/record-event';

const titleLowerCase = (title = '') =>
  `${title[0].toLowerCase()}${title.slice(1)}`;

const Alert = ({ title, content }) => (
  <div className="vads-l-grid-container vads-u-padding-left--0 vads-u-padding-bottom--5">
    <div className="usa-content">
      <h1>{title}</h1>

      <va-alert visible status="error">
        {content}
      </va-alert>
    </div>
  </div>
);

export const MissingServices = ({ title }) => {
  const content = (
    <>
      <h2 className="vads-u-display--inline-block vads-u-font-size--h3 vads-u-margin-top--0">
        We need some information for your application
      </h2>
      <p className="vads-u-font-size--base">
        We need more information from you before you can {titleLowerCase(title)}
        . Please call Veterans Benefits Assistance at{' '}
        <Telephone contact={CONTACTS.VA_BENEFITS} /> (TTY:{' '}
        <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />
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

export const MissingId = ({ title }) => {
  const content = (
    <>
      <h2 className="vads-u-display--inline-block vads-u-font-size--h3 vads-u-margin-top--0">
        We need more information for your application
      </h2>
      <p className="vads-u-font-size--base">
        We don’t have all of your ID information for your account. We need this
        information before you can {titleLowerCase(title)}. To update your
        account, please call Veterans Benefits Assistance at{' '}
        <Telephone contact={CONTACTS.VA_BENEFITS} /> (TTY:
        <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
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

export const MissingDob = ({ title }) => {
  const content = (
    <>
      <h2 className="vads-u-display--inline-block vads-u-font-size--h3 vads-u-margin-top--0">
        We need some information for your application
      </h2>
      <p className="vads-u-font-size--base">
        We’re sorry, you can’t continue to {titleLowerCase(title)} because we
        can’t find your date of birth in our records. Please call Veterans
        Benefits Assistance at <Telephone contact={CONTACTS.VA_BENEFITS} />{' '}
        (TTY: <Telephone contact={CONTACTS['711']} />
        ), Monday through Friday, 8:00 a.m. to 9:00 p.m. ET to update your
        account.
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
