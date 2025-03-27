import React from 'react';

const GetFormHelp = () => {
  return (
    <>
      <div slot="content">
        <p>
          <span className="vads-u-font-weight--bold">
            If you have trouble using this online form,
          </span>{' '}
          call us at <va-telephone contact="8008271000" />. We’re here 24/7. If
          you have hearing loss, call <va-telephone contact="711" tty="true" />.
        </p>
        <p className="vads-u-margin-bottom--0">
          <span className="vads-u-font-weight--bold">
            If you need help gathering your information or filling out your
            form,
          </span>{' '}
          contact a local Veterans Service Organization (VSO).
        </p>
        <va-link
          href="/get-help-from-accredited-representative/"
          text="Get help from a VA accredited representative or VSO"
        />
      </div>
    </>
  );
};

export default GetFormHelp;
