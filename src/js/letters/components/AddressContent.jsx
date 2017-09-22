import React from 'react';
import UpdateFailureAlert from './UpdateFailureAlert';
import AddressBlock from './AddressBlock';

const AddressContent = (props) => {
  return (
    <div className="step-content">
      <p>Downloaded documents will list your address as:</p>
      {props.saveError
        ? <UpdateFailureAlert addressObject={props.addressObject}/>
        : <AddressBlock name={props.name}>
            {props.children}
          </AddressBlock>
      }
    </div>
  );
};

export default AddressContent;

