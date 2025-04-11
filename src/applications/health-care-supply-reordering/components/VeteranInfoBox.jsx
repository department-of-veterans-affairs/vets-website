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
          <p className="vads-u-margin--1px vads-u-font-weight--bold dd-privacy-mask">
            {fullName}
          </p>
          <p className="vads-u-margin--1px dd-privacy-mask">
            Last 4 of Social Security number: {ssnLastFour}
          </p>
          <p className="vads-u-margin--1px dd-privacy-mask">
            Date of birth: {moment(dateOfBirth).format('MMMM DD, YYYY')}
          </p>
          <p className="vads-u-margin--1px dd-privacy-mask">
            Gender: {gender ? genderLabels[gender] : ''}
          </p>
        </div>
      </div>
      <p>
        <span className="vads-u-font-weight--bold">Note:</span> If you need to
        update your personal information, please call Veterans Benefits
        Assistance at <va-telephone contact="8008271000" />, Monday through
        Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </div>
  );
};

VeteranInfoBox.propTypes = {
  dateOfBirth: PropTypes.string.isRequired,
  first: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  last: PropTypes.string.isRequired,
  ssnLastFour: PropTypes.string.isRequired,
  middle: PropTypes.string,
  suffix: PropTypes.string,
};

VeteranInfoBox.defaultProps = {
  first: '',
  last: '',
  middle: '',
  suffix: '',
  gender: '',
  dateOfBirth: '',
  ssnLastFour: '',
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

export default connect(mapStateToProps, null)(VeteranInfoBox);
