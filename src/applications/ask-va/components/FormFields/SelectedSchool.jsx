import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const SelectedSchool = props => {
  const { school } = props;
  return (
    <div>
      <p>This is the new school facility you have chosen.</p>
      <p className="vads-u-border-left--4px">
        <span className="vads-u-margin-left--2p5">{`${school}`}</span>
      </p>
    </div>
  );
};

SelectedSchool.propTypes = {
  school: PropTypes.string,
};

const mapStateToProps = state => ({
  school: state.form.data.school,
});

export default connect(mapStateToProps)(SelectedSchool);
