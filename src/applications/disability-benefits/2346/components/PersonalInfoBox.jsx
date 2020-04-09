import moment from 'moment';
import { genderLabels } from 'platform/static-data/labels';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

const PersonalInfoBox = ({
  first,
  last,
  middle,
  suffix,
  gender,
  dateOfBirth,
  ssnLastFour,
}) => {
  const nameString = [first, middle, last, suffix]
    .filter(name => !!name)
    .join(' ')
    .toUpperCase();
  return (
    <div>
      <p>This is the personal information we have on file for you.</p>
      <div className="vads-u-border-left--7px vads-u-border-color--primary-alt-darkest">
        <div className="vads-u-padding--1">
          <p className="vads-u-margin--1px vads-u-font-weight--bold">
            {nameString}
          </p>
          <p className="vads-u-margin--1px">
            Last 4 of Social Security number: {ssnLastFour}
          </p>
          <p className="vads-u-margin--1px">
            Date of Birth: {moment(dateOfBirth).format('MM/DD/YYYY')}
          </p>
          <p className="vads-u-margin--1px">
            Gender: {gender ? genderLabels[gender] : ''}
          </p>
        </div>
      </div>
      <p>
        <span className="vads-u-font-weight--bold">Note:</span> if you need to
        update your personal information, please call Veterans Benefits
        assistance at <a href="tel:800-827-1000">800-827-1000</a>, Monday
        through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </div>
  );
};

PersonalInfoBox.propTypes = {
  first: PropTypes.string.isRequired,
  last: PropTypes.string.isRequired,
  middle: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  dateOfBirth: PropTypes.string.isRequired,
};

PersonalInfoBox.defaultProps = {
  first: '',
  last: '',
  middle: '',
  gender: '',
  dateOfBirth: '',
  ssnLastFour: '1234',
};

const mapStateToProps = state => ({
  first: state.form?.data?.fullName?.first,
  last: state.form?.data?.fullName?.last,
  middle: state.form?.data?.fullName?.middle,
  suffix: state.form?.data?.fullName?.suffix,
  ssnLastFour: state.form?.data?.ssnLastFour,
  gender: state.form?.data?.gender,
  dateOfBirth: state.form?.data?.dateOfBirth,
});

export default connect(mapStateToProps)(PersonalInfoBox);
