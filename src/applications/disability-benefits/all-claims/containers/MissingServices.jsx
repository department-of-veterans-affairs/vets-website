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
        We’re sorry. It looks like we’re missing some information needed for
        your application
      </h2>
      <p>
        For help with your application, please call Veterans Benefits Assistance
        at <Telephone contact={CONTACTS.VA_BENEFITS} />, Monday through Friday,
        8:00 a.m. to 9:00 p.m. ET.
      </p>
    </>
  );
  return <Alert content={content} />;
};

export const MissingId = ({ children }) => {
  const content = (
    <>
      <h2 className="vads-u-display--inline-block vads-u-font-size--h3 vads-u-margin-top--0">
        A technical error has occurred
      </h2>
      <p>
        Some important technical details are missing from your account,
        preventing you from using this tool. Please call us at <TelephoneLink />{' '}
        so we can fix this issue for you.
      </p>
      <p>
        It may expedite the process to inform the support representative that
        you are missing either your{' '}
        <abbr title="Electronic Data Interchange Personal Identifier">
          EDIPI
        </abbr>
        {' or '}
        <abbr title="Beneficiary Identification and Records Locator (Sub)System">
          BIRLS ID
        </abbr>{' '}
        - this is necessary tech information they will need to fix the issue. We
        apologize for the inconvenience.
      </p>
    </>
  );
  return <Alert content={content} />;
};
