import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getRepType } from '../utilities/helpers';

const OutsideVAAuthorizationUnsureNote = props => {
  const { formData } = props;

  return (
    <>
      <p className="appoint-text">
        <strong>Note:</strong> If you’re not sure who to enter, ask the
        accredited {getRepType(formData['view:selectedRepresentative'])} you’re
        appointing.{' '}
      </p>
    </>
  );
};

OutsideVAAuthorizationUnsureNote.propTypes = {
  formData: PropTypes.object,
};

const mapStateToProps = state => ({
  formData: state.form?.data,
});

export default connect(mapStateToProps, null)(OutsideVAAuthorizationUnsureNote);
