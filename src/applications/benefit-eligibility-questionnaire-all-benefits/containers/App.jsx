import React from 'react';
import PropTypes from 'prop-types';

import { ConfirmationPage } from './ConfirmationPage';

export default function App() {
  return (
    <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0 benefit-eligibility-questionnaire">
      <ConfirmationPage />
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node,
};
