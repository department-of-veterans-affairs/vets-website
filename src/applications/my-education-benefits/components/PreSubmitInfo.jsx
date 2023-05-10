import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { setPreSubmit as setPreSubmitAction } from 'platform/forms-system/src/js/actions';

const CustomPreSubmitInfo = ({
  showMebEnhancements, // feature flag name
  formData,
  showError,
  setPreSubmit,
}) => {
  const [privacyAgreement, setPrivacyAgreement] = useState(
    formData.privacyAgreementAccepted || false,
  );
  const [count, setCount] = useState(0);
  // Function to trigger the error message
  const triggerError = () => {
    if ((privacyAgreement === false && count > 0) || showError) {
      return 'You must accept the privacy policy before continuing';
    }
    return undefined;
  };
  // Function to handle the checkbox change
  const handleChange = event => {
    event.preventDefault();
    const isChecked = event?.target?.checked;
    setCount(count + 1);
    if (isChecked !== undefined) {
      setPrivacyAgreement(!privacyAgreement);
      setPreSubmit('privacyAgreementAccepted', !privacyAgreement);
    }
  };
  // Note text to be displayed with or without the privacy policy link
  const noteText = (
    <>
      <strong>Note:</strong> According to federal law, there are criminal
      penalties, including a fine and/or imprisonment for up to 5 years, for
      withholding information or for providing incorrect information (See 18
      U.S.C. 1001).{' '}
      {showMebEnhancements && ( // Conditionally render the privacy policy link
        <a
          href="https://www.va.gov/privacy-policy/"
          target="_blank"
          rel="noreferrer"
          aria-label="Privacy policy, will open in new tab"
        >
          Learn more about our privacy policy
        </a>
      )}
    </>
  );
  return (
    <>
      <div className="vads-u-margin-bottom--1p5">{noteText}</div>
      {!showMebEnhancements && ( // Conditionally render the checkbox
        <va-checkbox
          required
          error={triggerError()}
          label="I have read and accept the privacy policy"
          checked={privacyAgreement}
          onClick={event => handleChange(event)}
        />
      )}
    </>
  );
};
CustomPreSubmitInfo.propTypes = {
  formData: PropTypes.object.isRequired,
  showError: PropTypes.bool.isRequired,
  showMebEnhancements: PropTypes.bool, // Update the propTypes
};
const mapStateToProps = state => ({
  showMebEnhancements: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.showMebEnhancements // Update the feature flag name
  ],
});
const mapDispatchToProps = {
  setPreSubmit: setPreSubmitAction,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomPreSubmitInfo);
