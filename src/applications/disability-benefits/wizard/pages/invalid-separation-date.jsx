import React from 'react';
import { pageNames } from './pageList';

const InvalidSeparationDatePage = () => (
  <span
    className="usa-input-error-message"
    role="alert"
    id="separation-date-future-error-message"
  >
    <span className="sr-only">Error</span>A separation date must occur in the
    future
  </span>
);

export default {
  name: pageNames.invalidSeparationDate,
  component: InvalidSeparationDatePage,
};
