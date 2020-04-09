import moment from 'moment';
import { genderLabels } from 'platform/static-data/labels';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

const PersonalInfoBox = ({ first, last, gender, dateOfBirth }) => (
  <div>
    <p>This is the personal information we have for you.</p>
    <div>
      <div className="usa-alert schemaform-sip-alert">
        <div className="usa-alert-body">
          <p className="vads-u-margin--1px">
            {first} {last}
          </p>
          <p className="vads-u-margin--1px">
            Date of Birth: {moment(dateOfBirth).format('MM/DD/YYYY')}
          </p>
          <p className="vads-u-margin--1px">
            Gender: {gender ? genderLabels[gender] : ''}
          </p>
        </div>
      </div>
      <br />
    </div>
  </div>
);

PersonalInfoBox.propTypes = {
  first: PropTypes.string.isRequired,
  last: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  dateOfBirth: PropTypes.string.isRequired,
};

PersonalInfoBox.defaultProps = {
  first: '',
  last: '',
  gender: '',
  dateOfBirth: '',
};

const mapStateToProps = state => ({
  first: state.form?.data?.fullName?.first,
  last: state.form?.data?.fullName?.last,
  gender: state.form?.data?.gender,
  dateOfBirth: state.form?.data?.dateOfBirth,
});

export default connect(mapStateToProps)(PersonalInfoBox);
