import React from 'react';
import UpdateFailureAlert from './UpdateFailureAlert';
import AddressBlock from './AddressBlock';

const AddressContent = ({ saveError, addressObject, name, children }) => {
  return (
    <div className="step-content">
      <p>Downloaded documents will list your address as:</p>
      {saveError
        ? <UpdateFailureAlert addressObject={addressObject}/>
        : <AddressBlock name={name}>
          {children}
        </AddressBlock>
      }
    </div>
  );
};

export default AddressContent;

