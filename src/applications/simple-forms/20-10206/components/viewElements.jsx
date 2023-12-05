import React from 'react';

import moment from 'moment';

export const DisabilityExamDate = ({ formData }) => (
  <div className="vads-u-padding--2">
    <p>
      <strong>Exam date</strong>
    </p>
    <p>
      {moment(formData.disabilityExamDate, 'YYYY-MM-DD').format('MMMM D, YYYY')}
    </p>
  </div>
);
