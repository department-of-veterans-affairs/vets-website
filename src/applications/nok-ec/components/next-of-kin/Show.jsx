import React from 'react';

const Show = props => {
  const {
    name,
    relationship,
    address,
    phoneNumber,
    // handleSubmit,
  } = props;

  return (
    <>
      <div>
        <h3>Name</h3>
        {name}
      </div>

      <div>
        <h3>Relationship</h3>
        {relationship}
      </div>

      <div>
        <h3>Address</h3>
        {address}
      </div>

      <div>
        <h3>Phone</h3>
        {phoneNumber}
      </div>

      <div>
        <h3>Work phone</h3>
        {phoneNumber}

        {/* <va-button text="Edit" onClick={handleSubmit} /> */}
      </div>
    </>
  );
};

Show.defaultProps = {
  name: 'Jonnie Shaye',
  relationship: 'Brother',
  address: '123 Main St, Ste 234; Los Angeles, CA 90089',
  phoneNumber: '111-222-3333',
};

export default Show;
