import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

export const dateFieldsDescription = (
  <div className="additional-info-title-help">
    <AdditionalInfo triggerText="How are these dates different? ">
      <h5>Date you became too disabled to work</h5>
      <p>
        This is the date that you could no longer work – full-time or part-time
        – due to your service connected disability.
      </p>
      <h5>Date you last worked full time</h5>
      <p>
        This is the date that you could no longer hold a full-time job due to
        your service connected disability.
      </p>
      <h5>Date your disability began to affect your full-time employment</h5>
      <p>
        This is the date when you may have started cutting back your working
        hours or taking time off from work – paid or unpaid – due to your
        disability.
      </p>
    </AdditionalInfo>
  </div>
);
