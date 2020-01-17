import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';
import ErrorableTextInput from '@department-of-veterans-affairs/formation-react/ErrorableTextInput';
import React from 'react';
import { Link } from 'react-router';

export const ConfirmAddress = () => (
  <div>
    <h1>Confirm your shipping address</h1>
    <p>Your order will take 5-10 business days.</p>
    <div>
      <ErrorableCheckbox onValueChange={value => value} />
      <p>Regina Philange</p>
      <p>
        1234 Fake St.
        <br /> Tampa, FL 12345
      </p>
    </div>
    <div>
      <ErrorableCheckbox onValueChange={value => value} onChange />
      <p>Different Address</p>
      <ErrorableTextInput
        disabled={false}
        label="Label"
        placeholder="Address Line 1"
        name="Name"
        required
        onValueChange={field => this.setState({ field })}
      />
      <ErrorableTextInput
        disabled={false}
        label="Label"
        placeholder="Address Line 2"
        name="Name"
        required
        onValueChange={field => this.setState({ field })}
      />
      <ErrorableTextInput
        disabled={false}
        label="Label"
        placeholder="City"
        name="Name"
        required
        onValueChange={field => this.setState({ field })}
      />
      <ErrorableTextInput
        disabled={false}
        label="Label"
        placeholder="State"
        name="Name"
        required
        onValueChange={field => this.setState({ field })}
      />
      <ErrorableTextInput
        disabled={false}
        label="Label"
        placeholder="Zip Code"
        name="Name"
        required
        onValueChange={field => this.setState({ field })}
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
