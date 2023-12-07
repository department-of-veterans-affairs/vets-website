import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom-v5-compat';

import {
  FIELD_NAMES,
  FIELD_TITLES,
  TRANSACTION_CATEGORY_TYPES,
} from '@@vap-svc/constants';
import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';
import VAPServicePendingTransactionCategory from '@@vap-svc/containers/VAPServicePendingTransactionCategory';
import AddressField from '@@vap-svc/components/AddressField/AddressField';
import { focusElement } from '~/platform/utilities/ui';
import { selectVAPContactInfo } from '~/platform/user/selectors';

import { isAddressEmpty } from '../utils/helpers';
import noAddressBanner from '../components/NoAddressBanner';

const navigateToLetterList = navigate => {
  navigate('/letter-list');
};

function AddressSection({ savedAddress }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    focusElement('#content');
  });

  const address = savedAddress;
  const emptyAddress = isAddressEmpty(address);

  const addressContent = (
    <div className="step-content">
      <p>Downloaded documents will list your address as:</p>

      <div className="va-profile-wrapper">
        <InitializeVAPServiceID>
          <VAPServicePendingTransactionCategory
            categoryType={TRANSACTION_CATEGORY_TYPES.VAP_ADDRESS}
          >
            <AddressField
              fieldName={FIELD_NAMES.MAILING_ADDRESS}
              title={FIELD_TITLES[FIELD_NAMES.MAILING_ADDRESS]}
            />
          </VAPServicePendingTransactionCategory>
        </InitializeVAPServiceID>
      </div>
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
        >
          View Letters
        </button>
      </div>
    );
  }

  return (
    <>
      <div>
        <div aria-live="polite" aria-relevant="additions">
          {emptyAddress ? noAddressBanner : addressContent}
        </div>
      </div>
      {viewLettersButton}
    </>
  );
}

const mapStateToProps = state => ({
  savedAddress: selectVAPContactInfo(state)?.mailingAddress,
});

AddressSection.propTypes = {
  savedAddress: PropTypes.object,
};

export default connect(mapStateToProps)(AddressSection);
