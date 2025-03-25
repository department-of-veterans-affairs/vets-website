import React from 'react';
import { useSelector } from 'react-redux';
import { selectVAPMailingAddress } from 'platform/user/selectors';
import { TRANSACTION_CATEGORY_TYPES } from '@@vap-svc/constants';

import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';
import VAPServicePendingTransactionCategory from '@@vap-svc/containers/VAPServicePendingTransactionCategory';
import AddressView from '@@vap-svc/components/AddressField/AddressView';

export function NewAddressSection() {
  const mailingAddress = useSelector(selectVAPMailingAddress);

  return (
    <div className="va-profile-wrapper">
      <InitializeVAPServiceID>
        <VAPServicePendingTransactionCategory
          categoryType={TRANSACTION_CATEGORY_TYPES.ADDRESS}
        >
          <h2>Mailing Address</h2>
          <p>
            This mailing address will be listed on your benefit letters and
            documentation. You can edit this address.
          </p>
          <va-card className="vads-u-justify-content--space-between">
            <AddressView data={mailingAddress} />
            <p className="edit-link">
              <va-link
                active
                href="/records/download-va-letters/letters/edit-address"
                text="Edit mailing address"
              />
            </p>
          </va-card>
        </VAPServicePendingTransactionCategory>
      </InitializeVAPServiceID>
    </div>
  );
}

export default NewAddressSection;
