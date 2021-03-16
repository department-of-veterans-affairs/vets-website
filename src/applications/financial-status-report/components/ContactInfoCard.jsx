import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

const ContactInfoCard = ({
  addressLine1,
  addressLine2,
  city,
  stateCode,
  zipCode,
  countryName,
  edit,
}) => {
  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-top--3 vads-u-margin-bottom--5">
      <h4 className="vads-u-margin--0 vads-u-margin-bottom--2">
        Mailing address
      </h4>
      <div className="vads-u-padding-left--1 vads-u-border-left--7px vads-u-border-color--primary">
        <p className="vads-u-margin--1px">{addressLine1}</p>
        <p className="vads-u-margin--1px">{addressLine2}</p>
        <p className="vads-u-margin--1px">
          {city}, {stateCode} {zipCode}
        </p>
        <p className="vads-u-margin--1px">{countryName}</p>
      </div>
      <div className="vads-u-margin-top--1">
        <a onClick={() => edit()}>Edit mailing address</a>
      </div>
    </div>
  );
};

ContactInfoCard.propTypes = {
  addressLine1: PropTypes.string,
  addressLine2: PropTypes.string,
  city: PropTypes.string,
  stateCode: PropTypes.string,
  zipCode: PropTypes.string,
  countryName: PropTypes.string,
};

const mapStateToProps = ({ form }) => ({
  addressLine1: form.data.personalData.address?.addressLine1,
  addressLine2: form.data.personalData.address?.addressLine2,
  city: form.data.personalData.address?.city,
  stateCode: form.data.personalData.address?.stateCode,
  zipCode: form.data.personalData.address?.zipCode,
  countryName: form.data.personalData.address?.countryName,
});

export default connect(
  mapStateToProps,
  null,
)(ContactInfoCard);
