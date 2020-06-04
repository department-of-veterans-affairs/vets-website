import moment from 'moment';
import { genderLabels } from 'platform/static-data/labels';
import PropTypes from 'prop-types';
import React from 'react';

const PersonalInfoBox = props => {
  // Derive formData properties.
  const first = props.formData?.fullName?.first || '';
  const middle = props.formData?.fullName?.middle || '';
  const last = props.formData?.fullName?.last || '';
  const suffix = props.formData?.fullName?.suffix || '';
  const gender = props.formData?.gender || '';
  const dateOfBirth = props.formData?.dateOfBirth || '';
  const ssnLastFour = props.formData?.ssnLastFour || '';

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

PersonalInfoBox.propTypes = {
  formData: PropTypes.shape({
    fullName: PropTypes.shape({
      first: PropTypes.string.isRequired,
      last: PropTypes.string.isRequired,
      middle: PropTypes.string,
    }).isRequired,
    gender: PropTypes.string.isRequired,
    dateOfBirth: PropTypes.string.isRequired,
    ssnLastFour: PropTypes.string.isRequired,
  }).isRequired,
};

export default PersonalInfoBox;
