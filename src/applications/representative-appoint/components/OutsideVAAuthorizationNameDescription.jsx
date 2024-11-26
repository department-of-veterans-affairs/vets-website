import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getRepType } from '../utilities/helpers';

const OutsideVAAuthorizationNameDescription = props => {
  const { formData } = props;

  return (
    <>
      <h3>Authorization for access outside of VA’s systems</h3>
      <p className="appoint-text">
        You’ve authorized this accredited{' '}
        {getRepType(formData['view:selectedRepresentative'])}
        ’s team to access your records outside of VA’s information technology
        systems.
      </p>
    </>
  );
};

OutsideVAAuthorizationNameDescription.propTypes = {
  formData: PropTypes.object,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
});

export { OutsideVAAuthorizationNameDescription };
export default connect(
  mapStateToProps,
  null,
)(OutsideVAAuthorizationNameDescription);
