import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getRepType } from '../utilities/helpers';

const AddressAuthorizationDescription = props => {
  const { formData } = props;

  return (
    <>
      <h3>Authorization to change your address</h3>
      <p className="appoint-text">
        This accredited {getRepType(formData['view:selectedRepresentative'])}{' '}
        can help you change the address on your VA records. If the address on
        your VA records is incorrect or outdated, it may take us longer to
        contact you and process your benefit claims.
      </p>
    </>
  );
};

AddressAuthorizationDescription.propTypes = {
  formData: PropTypes.object,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
});

export { AddressAuthorizationDescription };
export default connect(
  mapStateToProps,
  null,
)(AddressAuthorizationDescription);
