import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import './stylesheet.scss';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const App = ({ formNumber, hasOnlineTool }) => {
  const shouldShow = useSelector(
    state => toggleValues(state)[FEATURE_FLAG_NAMES.formUploadFlow],
  );

  if (shouldShow && hasOnlineTool === undefined) {
    return <va-loading-indicator message="Loading..." />;
  }

  if (shouldShow && !hasOnlineTool) {
    return (
      <>
        <h3>Submit completed form</h3>
        <p>After you complete the form, you can upload and submit it here.</p>
        <div className="action-bar-arrow">
          <div className="vads-u-background-color--primary vads-u-padding--1">
            <a
              className="vads-c-action-link--white"
              href={`/forms/upload/${formNumber.toLowerCase()}`}
            >
              Upload VA Form {formNumber}
            </a>
          </div>
        </div>
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
