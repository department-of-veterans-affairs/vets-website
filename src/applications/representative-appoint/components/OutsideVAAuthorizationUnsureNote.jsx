import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
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
  formData: state.form?.data || {},
});

export { OutsideVAAuthorizationUnsureNote };
export default connect(
  mapStateToProps,
  null,
)(OutsideVAAuthorizationUnsureNote);
