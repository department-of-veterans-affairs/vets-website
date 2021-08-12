import React from 'react';
import { useSelector } from 'react-redux';
import { mcpFeatureToggle } from '../utils/helpers';

const MedicalCopaysApp = ({ children }) => {
  const showMCP = useSelector(state => mcpFeatureToggle(state));

  if (showMCP === false) {
    return window.location.replace('/');
  }

  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0 vads-u-margin-bottom--5">
      <div className="usa-width-three-fourths medium-8 columns">{children}</div>
    </div>
  );
};

export default MedicalCopaysApp;
