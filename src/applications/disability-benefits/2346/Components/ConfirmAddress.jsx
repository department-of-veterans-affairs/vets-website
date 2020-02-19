import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getVeteranInformationData } from '../actions';

class ConfirmAddress extends Component {
  static propTypes = {
    addressLine1: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    zip: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    getVeteranInformationData: PropTypes.func.isRequired,
  };
  static defaultProps = {
    addressLine1: '',
    city: '',
    state: '',
    country: '',
    zip: '',
    email: '',
    getVeteranInformationData: () => {},
  };
  componentDidMount() {
    this.props.getVeteranInformationData();
  }

  render() {
    const { addressLine1, city, state, zip, email } = this.props;

    return (
      <div>
        <h2>Confirm your address</h2>
        <div>
          <label htmlFor="address1">Address Line 1</label>
          <input id="address1" type="text" defaultValue={addressLine1} />
          <label htmlFor="city">City</label>
          <input type="text" id="city" defaultValue={city} />
          <label htmlFor="state">State</label>
          <input type="text" id="state" defaultValue={state} />
          <label htmlFor="zip">Postal Code</label>
          <input type="text" id="zip" defaultValue={zip} />
          <p className="vads-u-margin-top--4">Confirm your email address</p>
          <input type="email" defaultValue={email} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  addressLine1: state.form2346Reducer?.formData?.veteranAddress?.street,
  city: state.form2346Reducer?.formData?.veteranAddress?.city,
  state: state.form2346Reducer?.formData?.veteranAddress?.state,
  country: state.form2346Reducer?.formData?.veteranAddress?.country,
  zip: state.form2346Reducer?.formData?.veteranAddress?.postalCode,
  email: state.form2346Reducer?.formData?.email,
});

const mapDispatchToProps = {
  getVeteranInformationData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmAddress);
