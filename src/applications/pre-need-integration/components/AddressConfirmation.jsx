import React from 'react';
import { connect } from 'react-redux';
import { countries } from 'platform/forms/address';

function AddressConfirmation({ subHeader, userAddress }) {
  // Helper function to conditionally return a line with a break
  const renderLine = content => {
    return content ? (
      <>
        {content}
        <br />
      </>
    ) : null;
  };

  // For city/state/postalCode line, we build it conditionally:
  const cityStatePostal = [
    userAddress?.city,
    userAddress?.city && (userAddress?.state || userAddress?.postalCode)
      ? ', '
      : ' ',
    userAddress?.state,
    userAddress?.state && userAddress?.postalCode ? ' ' : '',
    userAddress?.postalCode,
  ]
    .join('')
    .trim();

  const getCountry = countryCode => {
    return countries.find(c => c.value === countryCode).label || countryCode;
  };

  return (
    <>
      <va-alert
        close-btn-aria-label="Close notification"
        status="warning"
        visible
      >
        <h2 slot="headline">Check the address you entered</h2>
        <React.Fragment key=".1">
          <p className="vads-u-margin-y--0">
            We can’t confirm the address you entered with the U.S. Postal
            Service. Check the address before continuing.
          </p>
        </React.Fragment>
      </va-alert>
      <h3 className="vads-u-font-size--h5" style={{ paddingTop: '2em' }}>
        {subHeader}
      </h3>
      <p style={{ marginTop: '1em' }}>You entered:</p>
      <div className="blue-bar-block">
        <p>
          {renderLine(userAddress?.street)}
          {renderLine(userAddress?.street2)}
          {cityStatePostal && renderLine(cityStatePostal)}
          {userAddress?.country !== 'USA' &&
            renderLine(getCountry(userAddress?.country))}
        </p>
      </div>
      <p>
        If the address is correct, you can continue. If you need to edit the
        address, you can go back.
      </p>
      <va-additional-info trigger="Why we can’t confirm the address you entered">
        <p>
          The address you entered may not be in the U.S. Postal Service’s
          system. Or, you may have entered an error or other incorrect
          information.
        </p>
      </va-additional-info>
    </>
  );
}

const mapStateToProps = state => {
  return {
    state,
    formData: state?.form?.data,
    addressValidation: state?.vapService?.addressValidation,
  };
};

export default connect(mapStateToProps)(AddressConfirmation);
