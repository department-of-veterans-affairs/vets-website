import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom-v5-compat';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { selectVAPContactInfo } from '@department-of-veterans-affairs/platform-user/selectors';

import NoAddressBanner from '../components/NoAddressBanner';
import { isAddressEmpty } from '../utils/helpers';
import VAProfileWrapper from './VAProfileWrapper';

const navigateToLetterList = navigate => {
  navigate('/letter-list');
};

export function AddressSection({ address }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    focusElement('#content');
  });

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
        <button
          onClick={() => navigateToLetterList(navigate)}
          className="usa-button-primary view-letters-button"
          disabled={emptyAddress}
          type="button"
        >
          View Letters
        </button>
      </div>
    );
  }

  return (
    <>
      <div aria-live="polite" aria-relevant="additions">
        {emptyAddress ? <NoAddressBanner /> : addressContent}
      </div>
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
