import ErrorableTextInput from '@department-of-veterans-affairs/formation-react/ErrorableTextInput';
import React, { useState } from 'react';
import { Link } from 'react-router';

export const ConfirmAddress = () => {
  const [checked, setChecked] = useState(false);
  const handleChange = e => {
    const value = e.target.checked;
    const name = e.target.name;

    // eslint-disable-next-line no-debugger
    debugger;
    setChecked({
      ...checked,
      [name]: value,
    });
  };
  return (
    <div>
      <h1>Confirm your shipping address</h1>
      <p>Your order will take 5-10 business days.</p>
      <div>
        <input
          name="confirmAddress"
          id="confirmAddress"
          type="checkbox"
          checked={checked}
          onChange={handleChange}
        />
        <label htmlFor="confirmAddress">Confirm Address</label>
        <p>Regina Philange</p>
        <p>
          1234 Fake St.
          <br /> Tampa, FL 12345
        </p>
      </div>
      <div>
        <input
          name="differentAddress"
          id="differentAddress"
          type="checkbox"
          checked={checked}
          onChange={handleChange}
        />
        <label htmlFor="differentAddress">Different Address</label>
        <p>Different Address</p>
        <ErrorableTextInput
          disabled={false}
          label="Address Line 1"
          placeholder="Address Line 1"
          name="addressLine1"
          required
          field=""
          onValueChange={() => {}}
        />
        <ErrorableTextInput
          disabled={false}
          label="Address Line 2"
          placeholder="Address Line 2"
          name="addressLine2"
          required
          field=""
          onValueChange={() => {}}
        />
        <ErrorableTextInput
          disabled={false}
          label="City"
          placeholder="City"
          name="city"
          required
          field=""
          onValueChange={() => {}}
        />
        <ErrorableTextInput
          disabled={false}
          label="State"
          placeholder="State"
          name="state"
          required
          field=""
          onValueChange={() => {}}
        />
        <ErrorableTextInput
          disabled={false}
          label="Zip"
          placeholder="Zip Code"
          name="zip"
          required
          field=""
          onValueChange={() => {}}
        />
      </div>
      <Link to="/home">
        <button>Back</button>
      </Link>
      <Link to="/orderpage">
        <button>Confirm Address</button>
      </Link>
    </div>
  );
};
