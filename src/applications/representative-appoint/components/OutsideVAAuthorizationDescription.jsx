import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getRepType } from '../utilities/helpers';

const OutsideVAAuthorizationDescription = props => {
  const { formData } = props;

  return (
    <>
      <h3>Authorization for access outside of VA’s systems</h3>
      <p className="appoint-text">
        This accredited {getRepType(formData['view:selectedRepresentative'])}{' '}
        may work with their team to help you file a claim or request a decision
        review. Some of their team members may need to access your records
        outside of VA’s information technology systems.
      </p>
    </>
  );
};

OutsideVAAuthorizationDescription.propTypes = {
  formData: PropTypes.object,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
});

export { OutsideVAAuthorizationDescription };
export default connect(
  mapStateToProps,
  null,
)(OutsideVAAuthorizationDescription);
