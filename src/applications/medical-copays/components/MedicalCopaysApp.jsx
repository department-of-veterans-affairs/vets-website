import React from 'react';
import { useSelector } from 'react-redux';
import { mcpFeatureToggle } from '../utils/helpers';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

const MedicalCopaysApp = ({ children }) => {
  const showMCP = useSelector(state => mcpFeatureToggle(state));

  if (showMCP === false) {
    return window.location.replace('/');
  }

  return (
    <>
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0 vads-u-margin-bottom--5">
        {showMCP ? (
          children
        ) : (
          <LoadingIndicator
            setFocus
            message="Please wait while we load the application for you."
          />
        )}
      </div>
    </>
  );
};

export default MedicalCopaysApp;
