import React from 'react';

const Error403 = () => {
  return (
    <>
      <h2 slot="headline">
        We couldn’t find an active accreditation linked to your identity.
      </h2>
      <div>
        <p className="vads-u-margin-y--0">
          If you are a representative currently accredited with VA, connect the
          email on file with VA’s Office of General Counsel to your{' '}
          <a href="https://login.gov/">Login.gov</a>. You can utilize the{' '}
          <a href="https://www.va.gov/get-help-from-accredited-representative/find-rep/">
            Find a VA Accredited Representative or VSO tool
          </a>{' '}
          to see which email address they have on file.
        </p>
        <p className="vads-u-margin-y--0">
          If you have updated and/or verified your email address and are still
          seeing this message, contact{' '}
          <a href="mailto:RepresentativePortalHelp@va.gov">
            RepresentativePortalHelp@va.gov
          </a>
          .
        </p>
      </div>
    </>
  );
};

export default Error403;
