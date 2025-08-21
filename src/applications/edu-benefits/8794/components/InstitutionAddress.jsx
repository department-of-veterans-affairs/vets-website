import React from 'react';
import { useSelector } from 'react-redux';

const InstitutionAddress = () => {
  const formData = useSelector(state => state.form?.data);
  const address = formData?.institutionDetails?.address || {};

  const hasAddress = Object.values(address).some(Boolean);

  return (
    <div aria-live="polite">
      {hasAddress ? (
        <>
          <p className="va-address-block" id="institutionAddress">
            {address.address1}
            {address.address2 && (
              <>
                <br />
                {address.address2}
              </>
            )}
            {address.address3 && (
              <>
                <br />
                {address.address3}
              </>
            )}
            <br />
            {address.city}, {address.state} {address.zip}
            <br />
            {address.country}
          </p>

          <va-additional-info trigger="What to do if this name or address looks incorrect">
            <p>
              After you have verified the facility code is correctly entered, if
              either the facility name or address is incorrect, please contact
              your State Approving Agency (SAA) to have your approval
              updated.&nbsp;
              <a
                href="https://nasaa-vetseducation.com/nasaa-contacts/"
                target="_blank"
                rel="noreferrer"
              >
                Go here to find your SAA’s email address (opens in new tab).
              </a>
            </p>
          </va-additional-info>
        </>
      ) : (
        <>
          <span
            aria-hidden="true"
            className="vads-u-font-weight--normal vads-u-font-size--h4 vads-u-margin-top--0p5"
          >
            --
          </span>
        </>
      )}
    </div>
  );
};

export default InstitutionAddress;
