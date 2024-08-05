import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isLoggedIn } from 'platform/user/selectors';
import {
  VaButton,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { toggleLoginModal as toggleLoginModalAction } from '@department-of-veterans-affairs/platform-site-wide/actions';
import './stylesheet.scss';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const App = ({ formNumber, hasOnlineTool }) => {
  const dispatch = useDispatch();

  // TODO: Confirm this accurately detects if the user is logged in.
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const shouldShow = useSelector(
    state => toggleValues(state)[FEATURE_FLAG_NAMES.formUploadFlow],
  );
  const onSignInClicked = () => dispatch(toggleLoginModalAction(true));

  if (shouldShow && hasOnlineTool === undefined) {
    return <va-loading-indicator message="Loading..." />;
  }

  if (shouldShow && !hasOnlineTool) {
    return (
      <>
        <h3>Submit completed form</h3>
        <p>After you complete the form, you can upload and submit it here.</p>
        {userLoggedIn ? (
          <div className="action-bar-arrow">
            <div className="vads-u-background-color--primary vads-u-padding--1">
              <a
                className="vads-c-action-link--white"
                href={`/form-upload/${formNumber}/upload`}
              >
                Start uploading your form
              </a>
            </div>
          </div>
        ) : (
          <VaAlert status="info" data-testid="form-upload-sign-in-alert" uswds>
            <h2 slot="headline">Sign in now to submit a completed form</h2>
            <p>By signing in you will be able to submit a completed PDF form</p>
            <VaButton
              onClick={onSignInClicked}
              uswds
              text="Sign in to upload your form"
            />
          </VaAlert>
        )}
      </>
    );
  }

  return null;
};

App.propTypes = {
  hasOnlineTool: PropTypes.bool.isRequired,
  formNumber: PropTypes.string,
};

export default App;
