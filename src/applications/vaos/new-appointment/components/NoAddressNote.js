import React from 'react';
import PropTypes from 'prop-types';

import NewTabAnchor from '../../components/NewTabAnchor';

export default function NoAddressNote({ optionType }) {
  return (
    <p>
      <strong>Note:</strong> To sort your {optionType} by closest to your home,
      add your home address to your VA profile.
      <br />
      <NewTabAnchor href="/profile/contact-information">
        Manage your contact information (opens in a new tab)
      </NewTabAnchor>
    </p>
  );
}

NoAddressNote.propTypes = {
  optionType: PropTypes.string,
};
NoAddressNote.defaultProps = {
  optionType: 'facilities',
};
