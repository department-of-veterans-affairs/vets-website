import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

import { recordEventOnce } from 'platform/monitoring/record-event';

const helpClicked = () =>
  recordEventOnce({
    event: 'disability-526EZ--form-help-text-clicked',
    'help-text-label':
      'Disability - Form 526EZ - How are these dates different',
  });

export const dateDescription = (
  <div>
    <h3 className="vads-u-font-size--h5">Disability dates</h3>
    <p>
      Now we’ll ask you to tell us when your disability prevented you from
      working.
    </p>
  </div>
);

export const dateFieldsDescription = (
  <div className="additional-info-title-help">
    <AdditionalInfo
      triggerText="How are these dates different?"
      onClick={helpClicked}
    >
      <h3 className="vads-u-font-size--h5">
        Date you became too disabled to work
      </h3>
      <p>
        This is the date you could no longer work full time or part time due to
        your service-connected disability.
      </p>
      <h3 className="vads-u-font-size--h5">Date you last worked full-time</h3>
      <p>
        This is the date you could no longer work full time due to your
        service-connected disability.
      </p>
      <h3 className="vads-u-font-size--h5">
        Date your disability began to affect your full-time employment
      </h3>
      <p>
        This is the date when started to reduce your work hours or to take time
        off from work due to your service-connected disability.
      </p>
    </AdditionalInfo>
  </div>
);
