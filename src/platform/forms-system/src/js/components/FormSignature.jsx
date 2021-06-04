import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';

/**
 * Description of how the component behaves here.
 *
 * Example usage in formConfig:
 * preSubmitInfo: {
 *   CustomComponent: (signatureProps) => (
 *     <>
 *       <h3>Veteran’s statement of truth</h3>
 *       <p>I solemnly swear I am up to no good.</p>
 *       <FormSignature
 *         {...signatureProps}
 *         onBehalfOf={`${props.formData.veteran.firstName} ${
 *           props.formData.veteran.lastName
 *         }`}
 *       />
 *     </>
 *   );
 * }
 */
export const FormSignature = ({ label }) =>
  // {
  //   formData,
  //   onSectionComplete,
  //   setFormData,
  //   showError,
  //   submission,
  // },
  {
    // TODO: Display the content and inputs
    // TODO: Handle the inputs
    return (
      <>
        <label htmlFor="signature">{label || 'Veteran’s full name'}</label>
        <input id="signature" type="text" />
      </>
    );
  };

FormSignature.propTypes = {
  formData: PropTypes.object.isRequired,
  onSectionComplete: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  submission: PropTypes.shape({
    hasAttemptedSubmit: PropTypes.bool,
    errorMessage: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    status: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  }),

  onBehalfOf: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  null,
  mapDispatchToProps,
)(FormSignature);
