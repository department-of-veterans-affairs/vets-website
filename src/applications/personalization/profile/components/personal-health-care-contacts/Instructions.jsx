import React from 'react';
import PropTypes from 'prop-types';

import HelpDeskContact from './HelpDeskContact';

const Instructions = ({ testId }) => (
  <div data-testid={testId}>
    To add a contact, call us at <HelpDeskContact testId={testId} />.
  </div>
);

Instructions.propTypes = {
  testId: PropTypes.string,
};

export default Instructions;
