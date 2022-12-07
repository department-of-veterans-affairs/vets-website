import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { setPreSubmit as setPreSubmitAction } from 'platform/forms-system/src/js/actions';

const CustomPreSubmitInfo = ({
  showMebDgi40Features,
  formData,
  showError,
  setPreSubmit,
}) => {
  const [privacyAgreement, setPrivacyAgreement] = useState(
    formData.privacyAgreementAccepted || true,
  );

  const [count, setCount] = useState(privacyAgreement ? 1 : 0);

  const triggerError = () => {
    // console.log('privacyAgreement: ' + privacyAgreement);
    // console.log('count: ' + count);

    // No checkbox error message during component init, count = 0
    // and shows error depending on checked box
    if (!privacyAgreement && count > 0) {
      return 'You must accept the privacy policy before continuing';
    }

    // Show error is a user clicks on submit with missing fields and unchecked boxed.
    if (showError && !privacyAgreement) {
      return 'You must accept the privacy policy before continuing';
    }

    return undefined;
  };

  return !showMebDgi40Features ? (
    <div className="vads-u-margin-bottom--1p5">
      <strong>Note:</strong> According to federal law, there are criminal
      penalties, including a fine and/or imprisonment for up to 5 years, for
      withholding information or for providing incorrect information (See 18
      U.S.C. 1001).{' '}
      <a
        href="https://www.va.gov/privacy-policy/"
        target="_blank"
        rel="noreferrer"
        aria-label="Privacy policy, will open in new tab"
      >
        Learn more about our privacy policy
      </a>
    </div>
  ) : (
    <>
      <p>
        <strong>Note:</strong> According to federal law, there are criminal
        penalties, including a fine and/or imprisonment for up to 5 years, for
        withholding information or for providing incorrect information. (See 18
        U.S.C. 1001)
      </p>
      <va-checkbox
        required
        error={triggerError()}
        label="I have read and accept the privacy policy"
        checked={privacyAgreement}
        onVaChange={value => setPreSubmit('privacyAgreementAccepted', value)}
        onClick={ev => {
          setCount(count + 1);
          // console.log(ev?.target?.checked);
          if (ev?.target?.checked !== undefined)
            setPrivacyAgreement(!ev?.target?.checked);
        }}
      />
    </>
  );
};

CustomPreSubmitInfo.propTypes = {
  showMebDgi40Features: PropTypes.bool,
};

const mapStateToProps = state => ({
  showMebDgi40Features: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.showMebDgi40Features
  ],
});

const mapDispatchToProps = {
  setPreSubmit: setPreSubmitAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomPreSubmitInfo);
