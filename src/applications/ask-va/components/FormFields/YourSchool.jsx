import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const YourSchool = props => {
  const { school } = props;

  const facilityCode = school?.schoolFacilityCode
    ? school.schoolFacilityCode
    : 'No school code found';
  const facilityName = school?.schoolName
    ? school.schoolName
    : 'No school name found';
  return (
    <div>
      <p>This is the school facility we have in your profile.</p>
      <p className="vads-u-border-left--4px">
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
