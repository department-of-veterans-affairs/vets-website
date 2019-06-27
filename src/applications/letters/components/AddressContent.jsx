import React from 'react';
import UpdateFailureAlert from './UpdateFailureAlert';
import AddressBlock from './AddressBlock';

const AddressContent = ({
  saveError,
  addressObject,
  recipientName,
  children,
}) => (
  <div className="step-content">
    <p>Downloaded documents will list your address as:</p>
    {saveError ? (
      <UpdateFailureAlert
        addressObject={addressObject}
        recipientName={recipientName}
      />
    ) : (
      <AddressBlock>{children}</AddressBlock>
    )}
  </div>
);

export default AddressContent;
