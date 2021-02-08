import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

const VeteranInfoBox = ({
  first,
  middle,
  last,
  dateOfBirth,
  ssnLastFour,
  vaFileNumber,
}) => {
  const fullName = [first, middle, last]
    .filter(name => !!name)
    .join(' ')
    .toUpperCase();

  return (
    <div>
      <p>This is the personal information we have on file for you.</p>
      <div className="vads-u-border-left--7px vads-u-border-color--primary">
        <div className="vads-u-padding-left--1">
          <p className="vads-u-margin--1px">
            <strong>{fullName}</strong>
          </p>
          <p className="vads-u-margin--1px">
            Last 4 of Social Security number: {ssnLastFour}
          </p>
          <p className="vads-u-margin--1px">VA File number: {vaFileNumber}</p>
          <p className="vads-u-margin--1px">
            Date of birth: {moment(dateOfBirth).format('DD/MM/YYYY')}
          </p>
        </div>
      </div>
      <p>
        <strong>Note: </strong>
        If you need to update your personal information, call our VA benefits
        hotline at <a href="tel:800-827-1000">800-827-1000</a>, Monday through
        Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </div>
  );
};

VeteranInfoBox.propTypes = {
  first: PropTypes.string,
  last: PropTypes.string,
  middle: PropTypes.string,
  dateOfBirth: PropTypes.string,
  ssnLastFour: PropTypes.string,
  vaFileNumber: PropTypes.string,
};

const mapStateToProps = ({ form }) => ({
  first: form?.data?.personalData?.fullName?.first,
  middle: form?.data?.personalData?.fullName?.middle,
  last: form?.data?.personalData?.fullName?.last,
  dateOfBirth: form?.data?.personalData?.dateOfBirth,
  ssnLastFour: form?.data?.personalIdentification?.sSn,
  vaFileNumber: form?.data?.personalIdentification?.vaFileNumber,
});

export default connect(
  mapStateToProps,
  null,
)(VeteranInfoBox);
