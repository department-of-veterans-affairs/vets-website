import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

const ContactInfoCard = ({
  addressLine1,
  city,
  state,
  zipCode,
  country,
  edit,
}) => {
  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-top--3 vads-u-margin-bottom--5">
      <h4 className="vads-u-margin--0 vads-u-margin-bottom--2">
        Mailing address
      </h4>
      <div className="vads-u-padding-left--1 vads-u-border-left--7px vads-u-border-color--primary">
        <p className="vads-u-margin--1px">{addressLine1}</p>
        <p className="vads-u-margin--1px">
          {city}, {state} {zipCode}
        </p>
        <p className="vads-u-margin--1px">{country}</p>
      </div>
      <div className="vads-u-margin-top--1">
        <a onClick={() => edit()}>Edit mailing address</a>
      </div>
    </div>
  );
};

ContactInfoCard.propTypes = {
  addressLine1: PropTypes.string,
  city: PropTypes.string,
  state: PropTypes.string,
  zipCode: PropTypes.string,
  country: PropTypes.string,
};

ContactInfoCard.defaultProps = {
  addressLine1: '1234 W Nebraska St',
  city: 'Tampa',
  state: 'FL',
  zipCode: '33614',
  country: 'United States',
};

const mapStateToProps = state => ({
  addressLine1: state.form?.data?.mailingAddress.addressLine1,
  city: state.form?.data?.mailingAddress.city,
  state: state.form?.data?.mailingAddress.state,
  zipCode: state.form?.data?.mailingAddress.zipCode,
  country: state.form?.data?.mailingAddress.country,
});

export default connect(
  mapStateToProps,
  null,
)(ContactInfoCard);
