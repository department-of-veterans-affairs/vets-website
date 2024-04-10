import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const StateSelect = props => {
  const { school } = props;

  return (
    <p>
      {' '}
      Your school facility is <strong>{`${school}`}</strong>. Would you like to
      use this school or choose a different option?{' '}
    </p>
  );
};

StateSelect.propTypes = {
  school: PropTypes.string,
};

const mapStateToProps = state => ({
  // TODO: change this to get school from AVA profile
  school: state.form.data.school,
});

export default connect(mapStateToProps)(StateSelect);
