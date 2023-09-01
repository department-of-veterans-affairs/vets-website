import React from 'react';
import Edit from './Edit';

const headings = {
  'nextOfKinPrimary': 'Is this your current next of kin information?',
  'nextOfKinOther': 'Next-of-Kin, Other',
  'emergencyContactPrimary': 'Emergency Contact, Primary',
  'emergencyContactOther': 'Emergency Contact, Other'
};

const Show = props => {
  let { name, relationship, address, phoneNumber, variant } = props;

  return (
    <>
      <h2>{headings[variant]}</h2>
      <hr />

      <p>
        <b>Name</b><br />
        { name }
      </p>
      <hr />

      <p>
        <b>Relationship</b><br />
        { relationship }
      </p>
      <hr />

      <p>
        <b>Address</b><br />
        { address }
      </p>
      <hr />

      <p>
        <b>Phone Number</b><br />
        { phoneNumber }
      </p>
      <hr />
    </>
  )
};

Show.defaultProps = {
  name: "Jonnie Shaye",
  relationship: "Brother",
  address: "123 Main St, Ste 234; Los Angeles, CA 90089",
  phoneNumber: "111-222-3333",
};

export default Show;
