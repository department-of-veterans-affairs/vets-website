import React from 'react';

import { CERTIFICATES_LABEL } from './config/constants';

export const certificatesReviewField = ({ children }) => {
  return (
    <div className="review-row">
      <dt>{CERTIFICATES_LABEL}</dt>
      <dd>{children}</dd>
    </div>
  );
};
