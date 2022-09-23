import React from 'react';
import PropTypes from 'prop-types';
import NewTabAnchor from '../../../components/NewTabAnchor';
import InfoAlert from '../../../components/InfoAlert';

export default function UpdateAddressAlert({ onClickUpdateAddress }) {
  const headline =
    'To use some of the tool’s features, you need a home address on file';
  const style = {
    width: 'fit-content',
    webkitWidth: 'fit-content',
  };

  return (
    <InfoAlert
      status="warning"
      headline={headline}
      className="vads-u-margin-y--3"
    >
      <p>
        To update your address, go to your VA.gov profile. Please allow some
        time for your address update to process through our system. <br />
        <NewTabAnchor
          style={style}
          href="/change-address/#how-do-i-change-my-address-in-"
          className="usa-button usa-button-primary vads-u-margin-top--4"
          onClick={() => onClickUpdateAddress(headline)}
        >
          Update your address
        </NewTabAnchor>
      </p>
    </InfoAlert>
  );
}

UpdateAddressAlert.propTypes = {
  onClickUpdateAddress: PropTypes.func,
};
