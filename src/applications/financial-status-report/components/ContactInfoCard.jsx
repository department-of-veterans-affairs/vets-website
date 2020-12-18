import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

const ContactInfoCard = ({ streetAddress, cityState, country }) => {
  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-top--3 vads-u-margin-bottom--5">
      <h4 className="vads-u-margin--0 vads-u-margin-bottom--2">
        Mailing address
      </h4>
      <div className="vads-u-padding-left--1 vads-u-border-left--7px vads-u-border-color--primary">
        <p className="vads-u-margin--1px">{streetAddress}</p>
        <p className="vads-u-margin--1px">{cityState}</p>
        <p className="vads-u-margin--1px">{country}</p>
      </div>
      <div className="vads-u-margin-top--1">
        <a onClick={() => {}}>Edit mailing address</a>
      </div>
    </div>
  );
};

ContactInfoCard.propTypes = {
  streetAddress: PropTypes.string,
  cityState: PropTypes.string,
  country: PropTypes.string,
};

ContactInfoCard.defaultProps = {
  streetAddress: '1234 W Nebraska St',
  cityState: 'Tampa, FL 33614',
  country: 'United States',
};

const mapStateToProps = state => ({
  streetAddress: state.form?.data?.streetAddress,
  cityState: state.form?.data?.cityState,
  country: state.form?.data?.country,
});

export default connect(
  mapStateToProps,
  null,
)(ContactInfoCard);
