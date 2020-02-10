import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getVeteranAddressInfo } from '../actions';

class ConfirmAddress extends Component {
  componentDidMount() {
    this.props.getVeteranAddressInfo();
  }

  render() {
    const { addressLine1, addressLine2, city, state, zip, email } = this.props;

    return (
      <div>
        <h1>Confirm your address</h1>
        <div>
          <label htmlFor="address1">Address Line 1</label>
          <input id="address1" type="text" defaultValue={addressLine1} />
          <label htmlFor="address2">Address Line 2</label>
          <input type="text" defaultValue={addressLine2} />
          <label htmlFor="city">City</label>
          <input type="text" id="city" defaultValue={city} />
          <label htmlFor="state">State</label>
          <input type="text" id="state" defaultValue={state} />
          <label htmlFor="zip">Zip</label>
          <input type="text" id="zip" defaultValue={zip} />
          <br />
          <p>Confirm your email address</p>
          <input type="text" defaultValue={email} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  addressLine1: state.form2346Reducer?.formData?.veteranAddress?.street || '',
  addressLine2: state.form2346Reducer?.formData?.veteranAddress?.street || '',
  city: state.form2346Reducer?.formData?.veteranAddress?.city || '',
  state: state.form2346Reducer?.formData?.veteranAddress?.state || '',
  country: state.form2346Reducer?.formData?.veteranAddress?.country || '',
  zip: state.form2346Reducer?.formData?.veteranAddress?.postalCode || '',
  email: state.form2346Reducer?.formData?.email || '',
});

const mapDispatchToProps = {
  getVeteranAddressInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmAddress);
