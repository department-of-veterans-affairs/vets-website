import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

const Alert = ({ content }) => (
  <div className="vads-l-grid-container vads-u-padding-bottom--5">
    <div className="usa-content">
      <h1>File for Disability Compensation</h1>
      <AlertBox isVisible content={content} status="error" />
    </div>
  </div>
);

export const MissingServices = () => {
  const content = (
    <>
      <h2 className="vads-u-display--inline-block vads-u-font-size--h3 vads-u-margin-top--0">
        We need some information for your application
      </h2>
      <p>
        We need more information from you before you can file for disability
        compensation. Please call Veterans Benefits Assistance at{' '}
        <Telephone contact={CONTACTS.VA_BENEFITS} /> (TTY: 711), Monday through
        Friday, 8:00 a.m. to 9:00 p.m. ET to update your account.
      </p>
    </>
  );
  return <Alert content={content} />;
};

export const MissingId = ({ children }) => {
  const content = (
    <>
      <h2 className="vads-u-display--inline-block vads-u-font-size--h3 vads-u-margin-top--0">
        We need more information for your application
      </h2>
      <p>
        We don’t have all of your ID information for your account. We need this
        information before you can file for disability compensation. To update
        your account, please call Veterans Benefits Assistance at{' '}
        <Telephone contact={CONTACTS.VA_BENEFITS} /> (TTY: 711). We’re here
        Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
      <p>
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
  return <Alert content={content} />;
};
