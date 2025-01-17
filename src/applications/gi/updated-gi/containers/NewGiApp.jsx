import React from 'react';
import PropTypes from 'prop-types';

import { AboutThisTool } from '../components/AboutThisTool';
import InfoDisclaimer from '../components/InfoDisclaimer';
import GiBillBreadcrumbs from '../components/GiBillBreadcrumbs';

const NewGiApp = ({ children }) => {
  return (
    <div className="row gi-bill-container">
      <GiBillBreadcrumbs />
      <div className="vads-u-margin-left--neg1">
        {children}
        <AboutThisTool />
        <InfoDisclaimer />
      </div>
    </div>
  );
};

NewGiApp.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NewGiApp;
