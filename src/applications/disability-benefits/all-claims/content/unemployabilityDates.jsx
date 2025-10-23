import React from 'react';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

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
  <div className="additional-info-title-help vads-u-margin-top--4">
    <VaAdditionalInfo
      trigger="How are these dates different?"
      disableAnalytics
      onClick={helpClicked}
    >
      <h4 className="vads-u-font-size--h5">
        Date you became too disabled to work
      </h4>
      <p>
        This is the date you could no longer work full time or part time due to
        your service-connected disability.
      </p>
      <h4 className="vads-u-font-size--h5">Date you last worked full-time</h4>
      <p>
        This is the date you could no longer work full time due to your
        service-connected disability.
      </p>
      <h4 className="vads-u-font-size--h5">
        Date your disability began to affect your full-time employment
      </h4>
      <p>
        This is the date when started to reduce your work hours or to take time
        off from work due to your service-connected disability.
      </p>
    </VaAdditionalInfo>
  </div>
);
