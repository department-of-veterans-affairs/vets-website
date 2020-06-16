import moment from 'moment';
import { genderLabels } from 'platform/static-data/labels';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

const VeteranInfoBox = props => {
  const {
    first,
    middle,
    last,
    suffix,
    dateOfBirth,
    gender,
    ssnLastFour,
  } = props;
  const fullName = [first, middle, last, suffix]
    .filter(name => !!name)
    .join(' ')
    .toUpperCase();

  return (
    <div>
      <p>This is the personal information we have on file for you.</p>
      <div className="vads-u-border-left--7px vads-u-border-color--primary">
        <div className="vads-u-padding-left--1">
          <p className="vads-u-margin--1px vads-u-font-weight--bold">
            {fullName}
          </p>
          <p className="vads-u-margin--1px">
            Last 4 of Social Security number: {ssnLastFour}
          </p>
          <p className="vads-u-margin--1px">
            Date of birth: {moment(dateOfBirth).format('MMMM DD, YYYY')}
          </p>
          <p className="vads-u-margin--1px">
            Gender: {gender ? genderLabels[gender] : ''}
          </p>
        </div>
      </div>
      <p>
        <span className="vads-u-font-weight--bold">Note:</span> If you need to
        update your personal information, please call Veterans Benefits
        Assistance at <a href="tel:800-827-1000">800-827-1000</a>, Monday
        through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </div>
  );
};

VeteranInfoBox.propTypes = {
  first: PropTypes.string.isRequired,
  last: PropTypes.string.isRequired,
  suffix: PropTypes.string,
  middle: PropTypes.string,
  gender: PropTypes.string.isRequired,
  dateOfBirth: PropTypes.string.isRequired,
  ssnLastFour: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  first: state.form?.data?.fullName?.first,
  middle: state.form?.data?.fullName?.middle,
  last: state.form?.data?.fullName?.last,
  suffix: state.form?.data?.fullName?.suffix,
  dateOfBirth: state.form?.data?.dateOfBirth,
  gender: state.form?.data?.gender,
  ssnLastFour: state.form?.data?.ssnLastFour,
});

export default connect(
  mapStateToProps,
  null,
)(VeteranInfoBox);
