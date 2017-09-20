import React from 'react';
import UpdateFailureAlert from './UpdateFailureAlert';
import AddressBlock from './AddressBlock';

const AddressContent = ({ saveError, name, fields }) => {
  return (
    <div className="step-content">
      <p>Downloaded documents will list your address as:</p>
      {saveError
        ? <UpdateFailureAlert/>
        : <AddressBlock name={name} fields={fields}/>
      }
    </div>
  );
};

export default AddressContent;
