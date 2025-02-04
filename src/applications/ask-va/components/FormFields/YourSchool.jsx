import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const YourSchool = props => {
  const { formData } = props;
  const { schoolInfo } = formData;

  const facilityCode = schoolInfo?.schoolFacilityCode;
  const facilityName = schoolInfo?.schoolName;
  return (
    <div>
      <p className="vads-u-margin-top--0">
        This is the school facility we have in your profile.
      </p>
      <p className="school-info-bar">
        <span className="vads-u-margin-left--2p5">{`${facilityCode} - ${facilityName}`}</span>
      </p>
    </div>
  );
};

YourSchool.propTypes = {
  school: PropTypes.object,
};

const mapStateToProps = state => ({
  school: state.form.data.schoolInfo,
});

export default connect(mapStateToProps)(YourSchool);
