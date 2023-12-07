import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  FIELD_NAMES,
  FIELD_TITLES,
  TRANSACTION_CATEGORY_TYPES,
} from '@@vap-svc/constants';
import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';
import VAPServicePendingTransactionCategory from '@@vap-svc/containers/VAPServicePendingTransactionCategory';
import AddressField from '@@vap-svc/components/AddressField/AddressField';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { selectVAPContactInfo } from '@department-of-veterans-affairs/platform-user/selectors';

import NoAddressBanner from '../components/NoAddressBanner';
import { isAddressEmpty } from '../utils/helpers';

const navigateToLetterList = router => {
  router.push('/letter-list');
};

export function AddressSection({ address, location, router }) {
  useEffect(() => {
    focusElement('#content');
  });

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
          onClick={() => navigateToLetterList(router)}
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
  location: PropTypes.object,
  address: PropTypes.object,
  router: PropTypes.object,
};

export default connect(mapStateToProps)(AddressSection);
