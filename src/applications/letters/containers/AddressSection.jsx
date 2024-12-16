import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom-v5-compat';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { selectVAPContactInfo } from '@department-of-veterans-affairs/platform-user/selectors';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import NoAddressBanner from '../components/NoAddressBanner';
import { isAddressEmpty } from '../utils/helpers';
import VAProfileWrapper from './VAProfileWrapper';

const navigateToLetterList = navigate => {
  navigate('/letter-list');
};

export function AddressSection({ address }) {
  const location = useLocation();
  const navigate = useNavigate();
  const emptyAddress = isAddressEmpty(address);

  const addressContent = (
    <div className="step-content">
      <p>Downloaded documents will list your address as:</p>
      <VAProfileWrapper />
      <p>
        When you download a letter, it will show this address. If this address
        is incorrect you may want to update it, but your letter will still be
        valid even with the incorrect address.
      </p>
    </div>
  );

  let viewLettersButton;
  if (location.pathname === '/confirm-address') {
    viewLettersButton = (
      <div className="step-content">
        <VaButton
          data-cy="view-letters-button"
          className="vads-u-margin-y--4"
          disabled={emptyAddress ? true : undefined} // false causes MS Voice Access to ignore buttons
          text="View letters"
          onClick={() => navigateToLetterList(navigate)}
        />
      </div>
    );
  }

  // Only set focus on the H1 when AddressSection is loaded.
  // LettersList component has its own logic.
  useEffect(() => {
    focusElement('#letters-title-id');
  }, []);

  return (
    <>
      {emptyAddress ? <NoAddressBanner /> : addressContent}
      {viewLettersButton}
    </>
  );
}

const mapStateToProps = state => ({
  address: selectVAPContactInfo(state)?.mailingAddress,
});

AddressSection.propTypes = {
  address: PropTypes.object,
};

export default connect(mapStateToProps)(AddressSection);
