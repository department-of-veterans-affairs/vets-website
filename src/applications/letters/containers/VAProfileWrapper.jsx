import React from 'react';

import {
  FIELD_NAMES,
  FIELD_TITLES,
  TRANSACTION_CATEGORY_TYPES,
} from '@@vap-svc/constants';
import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';
import VAPServicePendingTransactionCategory from '@@vap-svc/containers/VAPServicePendingTransactionCategory';
import AddressField from '@@vap-svc/components/AddressField/AddressField';

export default function VAProfileWrapper() {
  return (
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
  );
}
